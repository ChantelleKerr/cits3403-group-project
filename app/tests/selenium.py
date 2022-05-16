import unittest, time
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
  def setUp(self):
    service = Service(executable_path=GeckoDriverManager().install())
    self.driver = webdriver.Firefox(service=service)
    app.config.from_object(TestConfig)
    self.app = app.test_client()

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
  
  # Creates a new user by opening the registration modal and entering user details in the input.
  def simulate_register_user(self):
    # Click the register button
    self.driver.find_element_by_xpath("/html/body/nav/div/div/form/button[2]").click()
    # Insert text into the input fields
    self.driver.find_element_by_id('register-username-input').send_keys('Chantelle')
    time.sleep(1)
    self.driver.find_element(By.ID, 'register-email-input').send_keys('chaniscool@gmail.com')
    time.sleep(1)
    self.driver.find_element(By.ID, 'register-password-input').send_keys('coolpassword')
    time.sleep(1)
    self.driver.find_element(By.XPATH, '/html/body/div[2]/div/div/div[2]/form/div[4]/button').click()
    time.sleep(1)
    # Check if the registration was successful by checking if the message modal is displayed
    message_modal = self.driver.find_element(By.ID, 'messageModal')
    is_registered = message_modal.is_displayed()
    
    if is_registered:
      # Close the message modal
      self.driver.find_element(By.XPATH, '/html/body/div[3]/div/div/div/button').click()
      self.assertEqual(is_registered, True)
    else:
      # The user account is already made
      self.driver.find_element(By.XPATH, '/html/body/div[2]/div/div/div[1]/button').click()
      self.assertEqual(is_registered, False)

  # Logs a user in by opening the login modal and entering user details in the input.
  def simulate_log_in_user(self):
    # Click the login modal button (on navbar)
    login_modal_button = self.driver.find_element(By.XPATH, '/html/body/nav/div/div/form/button[1]')
    login_modal_button.click()
    # Fill out user input fields
    email_input = self.driver.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/form/div[1]/div[2]/input')
    email_input.send_keys('chaniscool@gmail.com')
    password_input = self.driver.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/form/div[2]/div[2]/input')
    password_input.send_keys('coolpassword')
    time.sleep(1)
    # Click the login button thats on the modal
    login_button = self.driver.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/form/div[3]/button')
    login_button.click()
    time.sleep(1)
    # See if we are logged in by checking for a logout button
    is_logged_in = self.driver.find_element(By.ID, 'logout-button').is_displayed()
    self.assertEqual(is_logged_in, True)

  # Simulates the game
  def simulate_game(self):
    # Click the play button on the homepage
    self.driver.find_element(By.ID, 'play').click()
    time.sleep(1)
    # Game loop
    for i in range(10):
      # Uses a random number to choose a food choice
      n = random.randint(1,2)
      if n == 1:
        # Click the first food choice
        self.driver.find_element(By.XPATH,'/html/body/div[4]/section/div[1]').click()
      else:
        # Click the second food choice
        self.driver.find_element(By.XPATH,'/html/body/div[4]/section/div[2]').click()
      time.sleep(2)
    # Check that we are finished the game by looking for the game over screen!
    game_over_score = self.driver.find_element(By.XPATH, '/html/body/div[4]/section/div[2]/div/h2[2]')
    game_over = game_over_score.is_displayed()
    self.assertEqual(game_over, True)

  def simulate_analysis(self):
    # Click the analysis link (navbar)
    self.driver.find_element(By.XPATH, '/html/body/nav/div/div/ul/li[2]/a').click()
    # Check if there is a table row
    has_result = self.driver.find_element(By.XPATH, '/html/body/div[5]/table/tr[2]').is_displayed()
    self.assertEqual(has_result, True)

 # Simulates the path the user might user to navigate the page
  # The test involves:
  #   1. Opening the registration modal and inserting user details into the input fields
  #   2. Opening the login modal and logging the user in using the newly created account
  #   3. Navigating to the game page and playing the game
  #   4. Navigating to analysis page
  # The test will pass if all tasks successfully execute. 
  def test_complete_user_flow(self):
    self.simulate_register_user()
    time.sleep(1)
    self.simulate_log_in_user()
    time.sleep(1)
    self.simulate_game()
    time.sleep(1)
    self.simulate_analysis()
    time.sleep(1)

if __name__ == '__main__':
  unittest.main()