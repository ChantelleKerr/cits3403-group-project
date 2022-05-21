from app.api import bp
from app.models import User
from flask import jsonify, request
from app import db
from flask import url_for

# Returns the user by ID
@bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
  return jsonify(User.query.get_or_404(id).to_dict())

# Creates a new database entry in the user table
@bp.route('/users/create', methods=['POST'])
def create_user():
  data = request.get_json() or {}
  user = User()
  user.from_dict(data, new_user=True)
  db.session.add(user)
  db.session.commit()
  
  response = jsonify(user.to_dict())
  response.status_code = 201
  response.headers['Location'] = url_for('api.get_user', id=user.id)
  return response