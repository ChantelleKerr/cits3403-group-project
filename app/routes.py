from flask import jsonify, render_template, request, make_response, session, redirect, url_for
from app import app
from flask_login import login_user, current_user
from app.models import User


@app.route("/")
def index():
  return render_template('base.html', title='Home') # Replace base.html with the home page

@app.route("/game")
def game():
  return render_template('game.html', title='Game')