from app.api import bp
from flask import jsonify, request, make_response, session, redirect
from app import db
from flask import url_for

from datetime import datetime, timezone
import json, random


@bp.route('/foods', methods=['GET'])
def get_daily_food():
  seed = int(datetime.now(timezone.utc).strftime("%Y%m%d"))
  random.seed(seed)
  with open("app/api/data.json") as file:
    data = json.load(file) # data is dictionary containing every food
  daily_foods = [{x: data[x]} for x in random.sample(data.keys(), 11)] # 11 is number of foods
  return jsonify(daily_foods)

