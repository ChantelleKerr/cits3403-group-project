import unittest
import json
from app import app
from config import TestConfig


# Run the tests using the command "python3 -m unittest app/tests/foods_test.py"
class UserModelTest(unittest.TestCase):

  def setUp(self):
    app.config.from_object(TestConfig)
    self.app = app.test_client()

  def tearDown(self):
    pass


  def test_get_daily_foods(self):
    response = self.app.get('/api/foods/')

    self.assertEqual(200, response.status_code)


    
if __name__ == '__main__':
  unittest.main()