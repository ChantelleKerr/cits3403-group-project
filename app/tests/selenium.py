import unittest, os, time
from app import app, db
from app.models import User
from config import TestConfig
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By
import random


# Run the tests using the command "python3 -m unittest app/tests/selenium.py"
class SeleniumTest(unittest.TestCase):
  driver = None
  # Set up the dummy data 
  def setUp(self):
    service = Service(executable_path=GeckoDriverManager().install())
    self.driver = webdriver.Firefox(service=service)
    app.config.from_object(TestConfig)
    self.app = app.test_client()
    db.create_all()
    #user1 = User(id='500', username='Zyra', email='zy@msn.com')
    #user1.set_password('secret')
    #db.session.add(user1)
    #db.session.commit()

    # create a new Firefox session
    self.driver.implicitly_wait(10)
    self.driver.maximize_window()
    self.driver.get('http://127.0.0.1:5000')
    time.sleep(1)


  # Remove test database data
  def tearDown(self):
    db.session.remove()
    db.drop_all()
    self.driver.close()
  
  def test_register_user(self):
    # Click the register button
    self.driver.find_element_by_xpath("/html/body/nav/div/div/form/button[2]").click()
    self.driver.implicitly_wait(10)
    # Insert text into the input fields
    self.driver.find_element_by_id('register-username-input').send_keys('Chantelle')

    time.sleep(1)
    self.driver.find_element_by_id('register-email-input').send_keys('chaniscool@gmail.com')
    time.sleep(1)
    self.driver.find_element_by_id('register-password-input').send_keys('coolpassword')
    self.driver.implicitly_wait(10)
    self.driver.find_element_by_xpath('/html/body/div[2]/div/div/div[2]/form/div[4]/button').click()
    time.sleep(1)
    is_registered = self.driver.find_element_by_id('messageModal').is_displayed()
    self.assertEqual(is_registered, True)
    

  def test_log_in(self):
    login_modal_button = self.driver.find_element(By.XPATH, '/html/body/nav/div/div/form/button[1]')
    login_modal_button.click()

    email_input = self.driver.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/form/div[1]/div[2]/input')
    email_input.send_keys('chaniscool@gmail.com')
    password_input = self.driver.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/form/div[2]/div[2]/input')
    password_input.send_keys('coolpassword')
    time.sleep(1)
    login_button = self.driver.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/form/div[3]/button')
    login_button.click()
    time.sleep(1)
    is_logged_in = self.driver.find_element(By.ID, 'logout-button').is_displayed()
    self.assertEqual(is_logged_in, True)


  def test_game(self):
    self.driver.find_element(By.ID, 'play').click()
    time.sleep(1)
    # Game loop
    for i in range(10):
      # Uses a random number to choose a food choice
      n = random.randint(1,2)
      if n == 1:
        self.driver.find_element(By.XPATH,'/html/body/div[4]/section/div[1]').click()
      else:
        self.driver.find_element(By.XPATH,'/html/body/div[4]/section/div[2]').click()
      time.sleep(2)







  



    
    
    



if __name__ == '__main__':
  unittest.main()