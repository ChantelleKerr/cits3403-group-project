from flask import render_template
from app import app


@app.route("/")
def index():
  return render_template('base.html', title='Home') # Replace base.html with the home page

@app.route("/game")
def game():
  return render_template('game.html', title='Game')

# TODO: Admin Access only. 
@app.route("/admin")
def admin():
  return render_template('admin.html', title='Admin Dashboard')