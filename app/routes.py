from flask import render_template
from app import app


@app.route("/")
def index():
  return render_template('home.html', title='Home') 

@app.route("/game")
def game():
  return render_template('game.html', title='Game')