import unittest
from app import app, db
from app.models import User
from config import TestConfig

# Run the tests using the command "python3 -m unittest app/tests/user_test.py"
class UserModelTest(unittest.TestCase):
  # Set up the dummy 
  def setUp(self):
    app.config.from_object(TestConfig)
    self.app = app.test_client()
    db.create_all()
    user1 = User(id='1000', username='Linx', email='linx@msn.com')
    db.session.add(user1)
    db.session.commit()

  # Remove test database data
  def tearDown(self):
    db.session.remove()
    db.drop_all()

  # Test password hashes
  def test_password(self):
    user = User.query.get('1000')
    user.set_password('secret')
    password_hash = user.password
    self.assertTrue(user.check_password('secret'))
    self.assertFalse(user.check_password('notsecret'))
    self.assertFalse(user.check_password('secret') == password_hash)
    self.assertFalse('secret' == password_hash)

  # Test user information
  def test_user(self):
    user = User.query.get('1000')
    self.assertTrue(user.to_dict() == {'id': 1000, 'username': 'Linx', 'email': 'linx@msn.com'})


if __name__ == '__main__':
  unittest.main()