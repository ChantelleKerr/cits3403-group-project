import unittest
from app import app, db
from app.models import Result
from config import TestConfig
import json

# Run the tests using the command "python3 -m unittest app/tests/result_test.py"
class ResultModelTest(unittest.TestCase):
  # Set up the dummy data 
  def setUp(self):
    app.config.from_object(TestConfig)
    app.config['LOGIN_DISABLED'] = True
    self.app = app.test_client()
    db.create_all()
    result1 = Result(id=100, user_id=1000, date='12/5/2022 4', score='0110101100', seed=20220512)
    result2 = Result(id=101, user_id=2000, date='12/5/2022 4', score='1000111101', seed=3242342)
    result3 = Result(id=200, user_id=1000, date='10/5/2022 2', score='1111111110', seed=20220510)
    db.session.add(result1)
    db.session.add(result2)
    db.session.add(result3)
    db.session.commit()

  # Remove test database data
  def tearDown(self):
    db.session.remove()
    db.drop_all()

  # Test result information
  def test_result(self):
    result = Result.query.get(100)
    self.assertEqual(result.to_dict(),{'id' : 100, 'user_id' : 1000, 'date' : '12/5/2022 4', 'score' : '0110101100', 'seed' : 20220512})

  # Test the get_result API endpoint
  def test_get_result(self):
    response_success = self.app.get('/api/results/200')
    response_fail = self.app.get('/api/results/201')
    self.assertEqual(response_success.status_code, 200)
    self.assertEqual(json.loads(response_success.data), {'id' : 200, 'user_id' : 1000, 'date' : '10/5/2022 2', 'score' : '1111111110', 'seed' : 20220510})
    self.assertEqual(response_fail.status_code, 404)

if __name__ == '__main__':
  unittest.main()