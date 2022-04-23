from numpy import unicode_
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(32), index=True, unique=False)
  email = db.Column(db.String(128), index=True, unique=True)
  password = db.Column(db.String(128))

  def __repr__(self):
      return f'<User {self.username}>'

  def set_password(self, password):
    self.password = generate_password_hash(password)
  
  def check_password(self, password):
    return check_password_hash(self.password, password)
