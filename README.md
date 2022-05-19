# Nutri Hi-Lo
###### CITS3403 Group Project - University of Western Australia

Developed by Huxley Berry, Djimon Jayasundera & Chantelle Kerr

---

**Nutri Hi-Lo** is an educational game that promotes a greater understanding on nutritional information on everyday foods and challenges the users on their knowledge! 

The game creates a random set of 11 different food choices everyday with a new nutrient for each day of the week. The user is given two foods to choose from and selecting the food with more nutritional value will score a correct answer.
<img align="right" src="app/static/images/logo.png">

#### Nutrient of the day

<img src="app/static/images/fat.png" height=20 width=20>&nbsp;**Monday:** Fat  
<img src="app/static/images/fibre.png" height=20 width=20>&nbsp;**Tuesday:** Fibre  
<img src="app/static/images/iron.png" height=20 width=20>&nbsp;**Wednesday:** Iron  
<img src="app/static/images/protein.png" height=20 width=20>&nbsp;**Thursday:** Protein  
<img src="app/static/images/sodium.png" height=20 width=20>&nbsp;**Friday:** Sodium  
<img src="app/static/images/sugar.png" height=20 width=20>&nbsp;**Saturday:** Sugar  
<img src="app/static/images/calcium.png" height=20 width=20>&nbsp;**Sunday:** Calcium  


## Architecture
Nutri Hi-Lo is a Flask-based website utilising a RESTful API for communication between the backend and frontend. It uses several extensions that enhance the functionality

###### Backend
- **Flask-sqlalchemy** provides communication with the SQLite database
- **Flask-login** manages user login and registration
- **Flask-migrate** handles database schema changes by performing migrations 
- **Unittest** used for automated testing of models and API endpoints
- **Selenium** automatically tests the client side workflow
- **webdriver-manager** automatically installs the driver that selenium will use

###### Frontend
- **HTML** structures the website
- **Javascript** handles DOM manipulation
- **Bootstrap** provides the base styling to the website
- **CSS** used to create custom styling 
- **AJAX** used to make requests to the backend


## Setup Project

Run the following commands
###### Clone the Project
```
git clone https://github.com/ChantelleKerr/cits3403-group-project
```
*Navigate inside the cits3403-group-project folder*
###### Create Virtual Environment
```
python3 -m venv venv
```
###### Activate Virtual Environment
```
# Mac / WSL
source venv/bin/activate

# Windows (command prompt)
venv\Scripts\activate
```
###### Install Dependencies
```
pip3 install -r requirements.txt
```
## Setup Database
Create the database and migrate

```
flask db migrate
```
Apply migrations to the database
```
flask db upgrade
```

## Create An Admin Account
*Having an admin account gives you **extra functionality** within the website!*

In your terminal type the following commands!
```
python3 (you may have to use "python" instead)
```
import the database and user model
```
from app import db
from app.models import User
```
Create an admin user
```
u = User(username="admin", email="admin@admin.com", is_admin=True)
u.set_password("adminpassword")
```
Add the user to the database
```
db.session.add(u)
db.session.commit()
```

Now you should be able to login using your admin account!

## Run Project
In the terminal type the following command to start the project. It will return a url that will direct you to the projects home page!
```
flask run
```

## Run Unit Tests
###### User Tests
Tests multiple user functionality including authorisation and password hashes.
```
python3 -m unittest app/tests/user_test.py
```
###### Analysis Tests
TODO: description
```
TODO
```
###### Selenium Tests
The test opens up FireFox and simulates navigation that a user may take while using our website.  

**Please made sure the server is running** as we are performing client side testing.  

***Note**: This test will run for ~40 seconds*
```
python3 -m unittest app/tests/selenium.py
```

#### References
###### Food Database
[Food Standards Database](https://www.foodstandards.gov.au/science/monitoringnutrients/afcd/Pages/foodsearch.aspx)

###### Images
[Unsplash](https://unsplash.com/)
[iStockPhoto](https://www.istockphoto.com/)
###### Icons
[Flaticon](https://www.flaticon.com/)

