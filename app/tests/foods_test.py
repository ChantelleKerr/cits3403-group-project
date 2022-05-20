import unittest
import json
from app import app
from config import TestConfig


# Run the tests using the command "python3 -m unittest app/tests/foods_test.py"
class FoodsTest(unittest.TestCase):

  def setUp(self):
    app.config.from_object(TestConfig)
    self.app = app.test_client()

  def tearDown(self):
    pass

  # Tests the get_daily_nutrient function for the /api/foods/notd/<int:day> route
  def test_get_daily_nutrient(self):
    # Test the route with a zero parameter
    response = self.app.get('/api/foods/notd/0')
    data = json.loads(response.data)
    self.assertEqual(200, response.status_code)

    self.assertEqual(dict, type(data))
    self.assertEqual(str, type(data["notd"]))
    self.assertEqual(str, type(data["unit"]))

    self.assertEqual(2, len(data.keys()))

    # Test the route with a non-zero parameter
    response = self.app.get('/api/foods/notd/1')
    data = json.loads(response.data)
    self.assertEqual(200, response.status_code)

    self.assertEqual(dict, type(data))
    self.assertEqual(list, type(data["nutrients"]))
    self.assertEqual(list, type(data["units"]))

    self.assertEqual(2, len(data.keys()))
    self.assertEqual(7, len(data["nutrients"]))
    self.assertEqual(7, len(data["units"]))
    
  # Tests the get_daily_foods function for the /api/foods/ route
  def test_get_daily_foods(self):
    response = self.app.get("/api/foods/")
    data = json.loads(response.data)
    self.assertEqual(200, response.status_code)

    self.assertEqual(list, type(data))
    self.assertEqual(11, len(data))

    # Validate each food item in the returned data
    for food in data:
      for key in food.keys():
        if key == "url":
          self.assertTrue(food[key].startswith("https://"))
        if key == "name" or key == "url":
          self.assertTrue(type(food[key]) == str)
        else:
          self.assertTrue(type(food[key]) == int or type(food[key]) == float)


  def test_get_foods_from_seed(self):
    response = self.app.get("/api/foods/get/0")
    data = json.loads(response.data)

    self.assertEqual(200, response.status_code)

    self.assertEqual(list, type(data))
    self.assertEqual(11, len(data))

    # Validate each food item in the returned data
    for food in data:
      for key in food.keys():
        if key == "url":
          self.assertTrue(food[key].startswith("https://"))
        if key == "name" or key == "url":
          self.assertTrue(type(food[key]) == str)
        else:
          self.assertTrue(type(food[key]) == int or type(food[key]) == float)
    
    # Check different seeds
    different_data = json.loads(self.app.get("/api/foods/get/1").data)
    self.assertTrue(data != different_data)
    same_data = json.loads(self.app.get("/api/foods/get/0").data)
    self.assertTrue(data == same_data)


    
if __name__ == '__main__':
  unittest.main()