# cits3403-group-project

###**Create An Admin Account**
*Having an admin account gives you extra functionality within the website!*
In your terminal type the following commands!
```
1. python3
2. from app import db
3. from app.models import User
4. u = User(username="admin", email="admin@admin.com", is_admin=True)
5. u.set_password("adminpassword")
6. u.session.add(u)
7. u.session.commit()
```

Now you should be able to login using your admin account!
