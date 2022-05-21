from app.api import bp
from flask import jsonify, redirect
from flask_login import current_user
from datetime import datetime, timezone
import json, random, time


# The function will return the nutrient of the day for the current day, if 0 is passed as the parameter
# If any other number is passed, it will instead return JSON containing all the nutrients and units
@bp.route("/foods/notd/<int:day>", methods=["GET"])
def get_daily_nutrient(day):
  return jsonify(generate_daily_nutrient(day))

# updates the daily foods if the day has changed
@bp.route("/foods/", methods=["GET"])
def get_daily_foods():
  seed = int(datetime.now(timezone.utc).strftime("%Y%m%d"))
  random.seed(seed)

  doUpdate = False
  today = read_file()
  
  if today["updated"] != seed:  # check if it was last updated on a different day
    doUpdate = True
    today["updated"] = seed
    today["seed"] = seed
    today["foods"] = generate_foods(seed)

  if doUpdate:
    update_file(today)

  return jsonify(today["foods"])

# You can pass an integer to use as a seed for food generation
# If 0 is the seed, then it will instead use the system time (different each time)
@bp.route("/foods/<int:seed>", methods=["GET"])
def update_daily_foods(seed):
  if not (current_user.is_authenticated and current_user.is_superuser()):
    return redirect("/")
  if seed == 0:
    seed = int(1000*time.time()) # needs to be an integer

  today = read_file()
  today["updated"] = int(datetime.now(timezone.utc).strftime("%Y%m%d"))
  today["seed"] = seed
  today["foods"] = generate_foods(seed)
  update_file(today)

  return jsonify(today["foods"])

# Gets the foods for a given seed
@bp.route('/foods/get/<int:seed>', methods=['GET'])
def get_foods_from_seed(seed):
  return jsonify(generate_foods(seed, allNutrients=True))

# Returns the content of today.json 
def read_file():
  # get the stored foods 
  try :
    with open("app/api/today.json") as ftoday:
      today = json.load(ftoday)
  except:
    today = {"updated": 0, "seed": 0, "foods": []}
  
  return today

# Updates the content of today.json 
def update_file(today):
  open("app/api/today.json", "w").close()  # erase file
  with open("app/api/today.json", "w") as ftoday:
    ftoday.write(json.dumps(today, indent=2))
  
def generate_daily_nutrient(day):
  units = ["mg", "g", "g", "mg", "g", "mg", "g"]
  nutrients = ["Calcium", "Fat", "Fibre", "Iron", "Protein", "Sodium", "Sugar"]
  if day == 0:
    return {"notd": nutrients[datetime.now(timezone.utc).weekday()], "unit": units[datetime.now(timezone.utc).weekday()]}
  else:
    return {"nutrients": nutrients, "units": units}

# Generates 11 random foods
def generate_foods(seed, allNutrients=False):
  # get the stored data
  with open("app/api/data.json") as fdata:
    data = json.load(fdata)  # data is dictionary containing every food
  
  nutrient = generate_daily_nutrient(0)["notd"]
  foods = []

  # Function to add a food to the foods array
  def addFood(name):
    if allNutrients:
      foods.append(data[name])
      foods[-1]["name"] = name
    else:
      foods.append({
        "name": name,
        "url": data[name]["url"],
        nutrient: data[name][nutrient]
      })

  # generate the 11 foods
  random.seed(seed)
  pool = list(data.keys())
  
  random.shuffle(pool)

  # Initialise foods with the first item in pool
  name = pool.pop(0)
  addFood(name)
  

  cycleStart = 0 # Used to tell if the while loop has reached a full cycle
  
  while len(foods) < 11 and len(pool) > 0:
    name = pool.pop(0)

    # calculate the "difference" between the current food nutrient value and previous one (0 means same, 1 means maximum difference)
    diff = abs(data[name][nutrient] - foods[-1][nutrient])/(data[name][nutrient] + foods[-1][nutrient])

    # prioritise foods that have nutrient values with at least a certain amount of difference
    if len(pool) < 11 - len(foods) or cycleStart == name or (diff > 0.2 and data[name][nutrient] > 0): # threshold is 0.2
      cycleStart = 0
      addFood(name)

    else:
      cycleStart = name if cycleStart == 0 else cycleStart
      # Add item back into pool since it wasn't accepted at this stage
      pool.append(name)

  return foods