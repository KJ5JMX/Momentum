import os
from datetime import timedelta


class Config: 
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "MY_SECRET_KEY"
    JWT_SECRET_KEY = "1a2b3c4d5e6f7g8h9i0j"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=5)