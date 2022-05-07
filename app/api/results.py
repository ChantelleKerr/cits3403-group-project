from app.api import bp
from app.models import Result
from flask import jsonify, request, make_response, session, redirect
from app import db
from flask import url_for
from flask_login import current_user

@bp.route('/results/<int:id>', methods=['GET'])
def get_result(id):
  return jsonify(Result.query.get_or_404(id).to_dict())


@bp.route('/results/write', methods=['POST'])
def write_results():
    data = request.get_json() or {}
    result = Result()
    result.from_dict(data)
    db.session.add(result)
    db.session.commit()
    response = jsonify(result.to_dict())
    response.status_code = 201
    response.headers['Location'] = url_for('api.get_result', id=result.id)
    return response