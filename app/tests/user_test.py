import unittest
import json
from app import app, db
from app.models import User
from config import TestConfig


# Run the tests using the command "python3 -m unittest app/tests/user_test.py"
class UserModelTest(unittest.TestCase):
  # Set up the dummy data 
  def setUp(self):
    app.config.from_object(TestConfig)
    self.app = app.test_client()
    db.create_all()
    user1 = User(id="1000", username="Linx", email="linx@msn.com")
    user1.set_password("secret")
    db.session.add(user1)
    db.session.commit()

  # Remove test database data
  def tearDown(self):
    db.session.remove()
    db.drop_all()

  # Test password hashes
  def test_password(self):
    user = User.query.get("1000")
    password_hash = user.password
    self.assertTrue(user.check_password("secret"))
    self.assertFalse(user.check_password("notsecret"))
    self.assertFalse("secret" == password_hash)

  # Test user information
  def test_user(self):
    user = User.query.get("1000")
    self.assertTrue(user.to_dict() == {"id": 1000, "username": "Linx", "email": "linx@msn.com"})

  # Test create_user API endpoint 
  # Test will pass if the response status code is 201
  def test_create_user(self):
    payload = json.dumps({
      "username": "Zyra",
      "email": "zyra@gmail.com",
      "password": "reallysafepassword"
    })
    response = self.app.post('/api/users/create', headers={"Content-Type": "application/json"}, data=payload)
    self.assertEqual(201, response.status_code)

  # Test the get_user API endpoint
  #
  # The test will try to get a response from a known existing user 
  # which will be passed if the status code is 200.
  # It also tests if the response from a user that doesn't exist
  # which will pass if the status code is 404.
  def test_get_user(self):
    response = self.app.get("/api/users/1000")
    response_fail = self.app.get("/api/users/5000")

    self.assertEqual(200, response.status_code)
    self.assertEqual(404, response_fail.status_code)

  # Test the user auth login endpoint
  def test__successful_login(self):
    payload = json.dumps({
      "email": "linx@msn.com",
      "password": "secret"
    })
    response = self.app.post("/auth/login", headers={"Content-Type": "application/json"}, data=payload)
    self.assertEqual(200, response.status_code)

  # Test the user auth login endpoint
  # Uses user credentials that doesn't exist
  # The test will pass if it returns the status code 401
  def test_unsuccessful_login(self):
    payload = json.dumps({
      "email": "idontexist@hotmail.com",
      "password": "idontexist"
    })
    response = self.app.post("/auth/login", headers={"Content-Type": "application/json"}, data=payload)
    self.assertEqual(401, response.status_code)
  
  # Test the auth logout endpoint
  def test_logout(self):
    response = self.app.get("/auth/logout")
    self.assertEqual(200, response.status_code)
    
if __name__ == "__main__":
  unittest.main()