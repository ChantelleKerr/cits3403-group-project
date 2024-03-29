from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

# A model that represents the user database table
class User(UserMixin, db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(32), index=True, unique=False)
  email = db.Column(db.String(128), index=True, unique=True)
  password = db.Column(db.String(128))
  is_admin = db.Column(db.Boolean, default=False)

  def __repr__(self):
      return f"<User {self.username}>"

  # Generates a password hash
  def set_password(self, password):
    self.password = generate_password_hash(password)
  
  # Checks if the password is the same as the hashed password
  def check_password(self, password):
    return check_password_hash(self.password, password)

  def is_superuser(self):
    return self.is_admin

  # Converts a user object into a JSON format
  def to_dict(self):
    data = {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      "is_admin": self.is_admin
    }
    return data

  # Convert JSON object into a user objects
  def from_dict(self, data, new_user=False):
    for field in ["username", "email"]:
      if field in data:
        setattr(self, field, data[field])
    # We want to set the password separately so that
    # it can be stored as a hash instead of a string
    if new_user and "password" in data:
      self.set_password(data["password"])

# A model that represents the results database table.
# References the user by foreign key and store game result data.
class Result(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
  date = db.Column(db.String(32), index=True)
  score = db.Column(db.String(32))
  seed = db.Column(db.Integer)

  def __repr__(self):
    return f"<Result {self.id}>"

  # Converts a result object into a JSON format
  def to_dict(self):
    data = {
      "id": self.id,
      "user_id": self.user_id,
      "date": self.date,
      "score": self.score,
      "seed": self.seed
    }
    return data

  # Convert JSON object into a result objects
  def from_dict(self, data, current_user, seed):
    setattr(self, "seed", seed)
    setattr(self,"user_id", current_user)
    for field in ["date", "score"]:
      if field in data:
        setattr(self, field, data[field])
