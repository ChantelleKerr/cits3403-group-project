from app.api import bp
from app.models import User
from flask import jsonify, request, make_response
from app import db
from flask import url_for
import webbrowser
import urllib.parse


@bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
  return jsonify(User.query.get_or_404(id).to_dict())


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

# IMPORTANT: To be moved into results.py api when completed
# Opens twitter and creates a tweet with given text (does not submit tweet automatically)
@bp.route('/results/share', methods=['POST'])
def share_achievement():
  data = request.get_json() or {}
  # Converts the text into this format -> %F0%9F%9F%A9
  # Allows twitter to read the emojis correctly
  encoded_data = (urllib.parse.quote_plus(data))
  webbrowser.open_new_tab('http://twitter.com/intent/tweet?text=' + encoded_data)
  return make_response(jsonify({"Success": "Share achievement Successful"}), 200)