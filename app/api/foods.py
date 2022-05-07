from app.api import bp
from flask import jsonify, request, make_response, session, redirect
from app import db
from flask import url_for

from datetime import datetime, timezone
import json, random, time


# updates the daily foods if the day has changed
@bp.route('/foods/', methods=['GET'])
def get_daily_food():
  seed = int(datetime.now(timezone.utc).strftime("%Y%m%d"))
  random.seed(seed)

  doUpdate = False
  today, data = read_files()
  
  if today["updated"] != seed:  # check if it was last updated on a different day
    doUpdate = True
    today["updated"] = seed
    today["foods"] = [] # empty today foods and add a new 11 foods
    for food in random.sample(data.keys(), 11): 
      today["foods"].append({food: data[food]})

  if doUpdate:
    update_file(today)

  return jsonify(today["foods"])

# TODO: Admin only access
# You can pass an integer to use as a seed for food generation
# If 0 is the seed, then it will instead use the system time (different each time)
@bp.route('/foods/<int:seed>', methods=['GET'])
def update_daily_food(seed):
  if seed == 0:
    seed = time.time()
  random.seed(seed)

  today, data = read_files()

  today["updated"] = int(datetime.now(timezone.utc).strftime("%Y%m%d"))
  today["foods"] = []  # empty today foods and add a new 11 foods
  for food in random.sample(data.keys(), 11):
    today["foods"].append({food: data[food]})

  update_file(today)

  return jsonify(today["foods"])

# returns the today.json and nutrition data after reading them from file
def read_files():
  with open("app/api/data.json") as fdata, open("app/api/today.json") as ftoday:
    try:
      today = json.load(ftoday)
    except:
      today = {"updated": 0, "foods": []}
    data = json.load(fdata)  # data is dictionary containing every food
  return today, data

# Updates the today.json food file
def update_file(today):
  open("app/api/today.json", "w").close()  # erase file
  with open("app/api/today.json", "w") as ftoday:
    ftoday.write(json.dumps(today, indent=2))