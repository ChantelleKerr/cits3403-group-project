from flask import render_template, session
from app import app
from flask_login import current_user

@app.route("/")
def index():
  return render_template('base.html', title='Home') # Replace base.html with the home page

@app.route("/game")
def game():
  return render_template('game.html', title='Game')

@app.route("/analysis")
def analysis():
  if current_user.is_authenticated:
    return render_template('analysis.html', title='Analysis')
  else:
    return "Login please"