import os
from datetime import timedelta

from dotenv import load_dotenv
load_dotenv(dotenv_path='../.env')
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'apikey'
    MAIL_PASSWORD = os.getenv('SMTP_PASSWORD')
    MAIL_DEBUG = True
    MAIL_DEFAULT_SENDER = os.getenv('SMTP_EMAIL')
    BASE_URL = os.getenv('BASE_URL')
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://watchmate:'+os.getenv('DB_PASSWORD')+'@localhost/watchmate_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


