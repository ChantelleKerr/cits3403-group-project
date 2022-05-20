from flask import render_template, redirect
from app import app
from flask_login import current_user, login_required

""" routes.py handles all the page routing for our website. """

@app.route("/")
def index():
  return render_template('home.html', title='Home') 

@app.route("/game")
def game():
  return render_template('game.html', title='Game')

@app.route("/analysis")
@login_required
def analysis():
  return render_template('analysis.html', title='Analysis')

@app.route("/admin")
@login_required
def admin():
  if current_user.is_superuser():
    return render_template('admin.html', title='Admin Dashboard')
  return unauthorized_callback()

# Called when a user trys to access a page that they don't have access to.
@app.login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect('/')
