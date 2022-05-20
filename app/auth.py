from flask import Blueprint
from flask import jsonify, request, make_response
from app.models import User
from flask_login import current_user, login_user, logout_user


auth = Blueprint("auth", __name__)

# A route that logs the user in 
@auth.route("/login", methods=["GET","POST"])
def login():
  data = request.get_json() or {}
  # Find the user by email
  user = User.query.filter_by(email=data.get("email")).first()
  # If the user was found by email and the password is correct
  if user and user.check_password(data.get("password")):
    login_user(user)
    return make_response(jsonify(user.to_dict()), 200)
  return make_response(jsonify({"Failed": "Unsuccessful login"}), 401)

# A route that logs the user out
@auth.route('/logout')
def logout():
  logout_user()
  return make_response(jsonify({"Success": "Logout successful"}), 200)