from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, current_user


class User(UserMixin, db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(32), index=True, unique=False)
  email = db.Column(db.String(128), index=True, unique=True)
  password = db.Column(db.String(128))

  def __repr__(self):
      return f'<User {self.username}>'

  # Generates a password hash
  def set_password(self, password):
    self.password = generate_password_hash(password)
  
  # Checks if the password is the same as the hashed password
  def check_password(self, password):
    return check_password_hash(self.password, password)

  # Converts a user object into a JSON format
  def to_dict(self):
    data = {
      'id': self.id,
      'username': self.username,
      'email': self.email
    }
    return data

  # Convert JSON object into a user objects
  def from_dict(self, data, new_user=False):
    for field in ['username', 'email']:
      if field in data:
        setattr(self, field, data[field])
    # We want to set the password separately so that
    # it can be stored as a hash instead of a string
    if new_user and 'password' in data:
      self.set_password(data['password'])

# TODO: add an attribute for the puzzle itself, to allow the user to view past puzzles?
class Result(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.String(32), db.ForeignKey('user.id'))
  date = db.Column(db.String(32), index=True)
  score = db.Column(db.String(32))

  def __repr__(self):
    return '<Result {}>'.format(self.id)

  # Converts a result object into a JSON format
  def to_dict(self):
    data = {
      'id': self.id,
      'user_id': self.user_id,
      'date': self.date,
      'score': self.score
    }
    return data

  # Convert JSON object into a result objects
  def from_dict(self, data):
    if current_user.is_authenticated:
      setattr(self,'user_id',current_user.id)
    else:
      # set the user id to -1 to signify a user who is not logged in
      setattr(self,'user_id',-1)
    for field in ['date', 'score']:
      if field in data:
        setattr(self, field, data[field])


