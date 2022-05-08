from flask import render_template, session
from app import app

@app.route("/")
def index():
  return render_template('base.html', title='Home') # Replace base.html with the home page

@app.route("/game")
def game():
  return render_template('game.html', title='Game')

@app.route("/analysis")
def analysis():
  return render_template('analysis.html', title='Analysis')