import unittest
from app import app, db
from app.models import Result
from config import TestConfig

# Run the tests using the command "python3 -m unittest app/tests/result_test.py"
class ResultModelTest(unittest.TestCase):
  # Set up the dummy data 
  def setUp(self):
    app.config.from_object(TestConfig)
    self.app = app.test_client()
    db.create_all()
    result1 = Result(id=100, user_id=1000, date='12/5/2022 4', score='0110101100', seed=20220512)
    db.session.add(result1)
    db.session.commit()

  # Remove test database data
  def tearDown(self):
    db.session.remove()
    db.drop_all()

  # Test result information
  def test_result(self):
    result = Result.query.get(100)
    self.assertEqual(result.to_dict(),{'id' : 100, 'user_id' : 1000, 'date' : '12/5/2022 4', 'score' : '0110101100', 'seed' : 20220512})

if __name__ == '__main__':
  unittest.main()