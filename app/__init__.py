from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager

app = Flask(__name__)
CORS(app)

app.secret_key = "test123"

app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

login = LoginManager()
login.init_app(app)
login.login_view = "auth.login"

from app import routes, models
from app.api import bp as api_bp
app.register_blueprint(api_bp, url_prefix="/api")


from app.auth import auth as auth_bp
app.register_blueprint(auth_bp, url_prefix="/auth")

from .models import User

# Callback used to reload the user object stored in session
@login.user_loader
def user_loader(id):
  return User.query.get(int(id))