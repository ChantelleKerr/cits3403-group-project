# Nutri Hi-Lo
###### CITS3403 Group Project
Developed by Huxley Berry, Djimon Jayasundera & Chantelle Kerr

## Purpose
todo

## Architecture
todo

## Setup Project

Run the following commands
###### Clone the Project
```
git clone https://github.com/ChantelleKerr/cits3403-group-project
```
###### Create Virtual Environment
```
python3 -m venv venv
```
###### Activate Virtual Environment
```
source venv/bin/activate
```
###### Install Dependencies
```
pip3 install -r requirements.txt
```
## Setup Database
```
todo
```

## Create An Admin Account
*Having an admin account gives you extra functionality within the website!*
In your terminal type the following commands!
```
1. python3
2. from app import db
3. from app.models import User
4. u = User(username="admin", email="admin@admin.com", is_admin=True)
5. u.set_password("adminpassword")
6. db.session.add(u)
7. db.session.commit()
```

Now you should be able to login using your admin account!

## Run Project
In the terminal type the following command to start the project. It will return a url that will direct you to the projects home page!
```
flask run
```

## Run Unit Tests
```
todo
```

#### References
###### Images
https://unsplash.com/
https://www.istockphoto.com/
###### Icons
https://www.flaticon.com/

