from app.api import bp
from app.models import Result
from flask import jsonify, request, make_response
from app import db
from flask import url_for
from flask_login import current_user, login_required
import json
import webbrowser
import urllib.parse

# Returns the result by id
@bp.route("/results/<int:id>", methods=["GET"])
def get_result(id):
  return jsonify(Result.query.get_or_404(id).to_dict())

# Returns a list of user results
@bp.route("/results/user", methods=["GET"])
@login_required
def get_user_results(id):
  if id == 0:
    id = current_user.id
  u_results = Result.query.filter_by(user_id=id).all()
  result_list = []
  for result in u_results:
    result_list.append(result.to_dict())
  return jsonify(result_list)

# Creates a new entry in the results database table
@bp.route("/results/write/<int:id>", methods=["POST"])
def write_results(id):
  data = request.get_json() or {}
  if current_user.is_authenticated or id != 0:
    if id == 0:
      id = current_user.id
    result = Result()
    with open("app/api/today.json") as ftoday:
      seed = json.load(ftoday)["seed"]
    result.from_dict(data, id, seed)
    db.session.add(result)
    db.session.commit()
    response = jsonify(result.to_dict())
    response.status_code = 201
    response.headers["Location"] = url_for("api.get_result", id=result.id)
  else:
    response = jsonify({})
    response.status_code = 200
  return response

# Opens twitter and creates a tweet with given text (does not submit tweet automatically)
@bp.route("/results/share", methods=["POST"])
def share_achievement():
  data = request.get_json() or {}
  # Converts the text into this format -> %F0%9F%9F%A9
  # Allows twitter to read the emojis correctly
  encoded_data = (urllib.parse.quote_plus(data))
  webbrowser.open_new_tab("http://twitter.com/intent/tweet?text=" + encoded_data)
  return make_response(jsonify({"Success": "Share achievement Successful"}), 200)