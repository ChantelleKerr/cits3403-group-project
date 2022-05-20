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

  def test_get_daily_nutrient(self):
    # Test the route with a zero parameter
    response = self.app.get('/api/foods/notd/0')
    data = json.loads(response.data)
    self.assertEqual(200, response.status_code)

    self.assertEqual(dict, type(data))
    self.assertEqual(2, len(data.keys()))

    self.assertEqual(str, type(data["notd"]))
    self.assertEqual(str, type(data["unit"]))

    # Test the route with a non-zero parameter
    response = self.app.get('/api/foods/notd/1')
    data = json.loads(response.data)
    self.assertEqual(200, response.status_code)

    self.assertEqual(dict, type(data))
    self.assertEqual(2, len(data.keys()))

    self.assertEqual(list, type(data["nutrients"]))
    self.assertEqual(list, type(data["units"]))
    self.assertEqual(7, len(data["nutrients"]))
    self.assertEqual(7, len(data["units"]))
    

  def test_get_daily_foods(self):
    response = self.app.get('/api/foods/')

    self.assertEqual(200, response.status_code)

  def test_update_daily_foods(self):
    pass

  def test_get_foods_from_seed(self):
    pass


    
if __name__ == '__main__':
  unittest.main()