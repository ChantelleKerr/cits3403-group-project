from app.api import bp
from app.models import Result
from flask import jsonify, request, make_response, session, redirect
from app import db
from flask import url_for
from flask_login import current_user, login_required
import json

@bp.route('/results/<int:id>', methods=['GET'])
def get_result(id):
  return jsonify(Result.query.get_or_404(id).to_dict())

@bp.route('/results/user', methods=['GET'])
@login_required
def get_user_results():
  u_results = Result.query.filter_by(user_id=current_user.id).all()
  result_list = []
  for result in u_results:
    result_list.append(result.to_dict())
  return jsonify(result_list)


@bp.route('/results/write', methods=['POST'])
@login_required
def write_results():
  data = request.get_json() or {}
  result = Result()
  with open("app/api/today.json") as ftoday:
    # TODO: This doesn't actually get the seed if an admin has changed the seed, it just gets the date
    seed = json.load(ftoday)['updated']
  result.from_dict(data, current_user.id, seed)
  db.session.add(result)
  db.session.commit()
  response = jsonify(result.to_dict())
  response.status_code = 201
  response.headers['Location'] = url_for('api.get_result', id=result.id)
  return response