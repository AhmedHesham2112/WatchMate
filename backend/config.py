import os

class Config:
    SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://watchmate:admin@localhost:3500/watchmate_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

