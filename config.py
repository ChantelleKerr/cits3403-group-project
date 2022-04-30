import os
basedir = os.path.abspath(os.path.dirname(__file__))

# Configuration class used for development
class Config(object):
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    'sqlite:///' + os.path.join(basedir, 'app.db')
  SQLALCHEMY_TRACK_MODIFICATIONS = False

# Configuration class used for unittests
class TestConfig(object):
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    'sqlite:///' + os.path.join(basedir, 'test.db')
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  TESTING = True

