from flask import render_template
from app import app

@app.route("/")
def index():
  return "Home Page"

@app.route("/game")
def game():
  return render_template('game.html', title='Game')