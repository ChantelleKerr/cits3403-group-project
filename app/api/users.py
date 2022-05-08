from app.api import bp
from app.models import User
from flask import jsonify, request, make_response, session, redirect
from app import db
from flask import url_for


@bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
  return jsonify(User.query.get_or_404(id).to_dict())


@bp.route('/users/create', methods=['POST'])
def create_user():
  print("how")
  data = request.get_json() or {}
  # TO DO:
  # Error handling here
  user = User()
  user.from_dict(data, new_user=True)
  db.session.add(user)
  db.session.commit()
  response = jsonify(user.to_dict())
  response.status_code = 201
  response.headers['Location'] = url_for('api.get_user', id=user.id)
  return response
