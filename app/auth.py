from flask import Blueprint
from . import db
from flask import jsonify, request, make_response
from app.models import User


auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET','POST'])
def login():
  data = request.get_json() or {}
  # Find the user by email
  user = User.query.filter_by(email=data.get('email')).first()

  # If the user was found by email and the password is correct
  if user and user.check_password(data.get('password')):
    return make_response(jsonify(user.to_dict()), 200)

  return make_response(jsonify({"Failed": "Unsuccessful login"}), 404)
