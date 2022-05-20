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

  # Test the get_user_results API endpoint
  def test_get_user_results(self):
    response_success = self.app.get('/api/results/user/2000')
    response_fail = self.app.get('/api/results/user/2001')
    self.assertEqual(json.loads(response_success.data),[{"date":"12/5/2022 4","id":101,"score":"1000111101","seed":3242342,"user_id":2000}])
    self.assertEqual(response_success.status_code,200)
    self.assertEqual(json.loads(response_fail.data),[])
    self.assertEqual(response_fail.status_code,200)

  def test_write_results(self):
    user_id = 2000
    with open("app/api/today.json") as ftoday:
      seed = json.load(ftoday)["seed"]
    payload = json.dumps({
      "date": "13/5/2022 5",
      "score": "0000001000"
    })
    response = self.app.post('/api/results/write/' + str(user_id), headers={"Content-Type": "application/json"}, data=payload)
    self.assertEqual(response.status_code,201)
    self.assertEqual(json.loads(response.data),{"date":"13/5/2022 5","id":201,"score":"0000001000","seed":seed,"user_id":user_id})
    response_not_authenticated = self.app.post('/api/results/write/0', headers={"Content-Type": "application/json"}, data=payload)
    self.assertEqual(response_not_authenticated.status_code,200)

  # Test the share_achievement API endpoint
  def test_share_achievement(self):
    payload = '"My Nutri Hi-Lo Daily Score: 5/10🟥🟩🟥🟩🟥🟩🟥🟩🟥🟩"'
    response = self.app.post('/api/results/share',headers={"Content-Type": "application/json"}, data=payload)
    self.assertEqual(json.loads(response.data),{"Success":"Share achievement Successful"})
    self.assertEqual(response.status_code,200)

if __name__ == '__main__':
  unittest.main()