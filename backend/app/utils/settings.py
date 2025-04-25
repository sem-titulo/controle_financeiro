from os import getenv

MONGO_URL: str = getenv('MONGO_URL')
MONGO_ENVIROMENT: str = getenv('MONGO_ENVIROMENT')
SECRET_KEY_JWT: str = getenv('SECRET_KEY_JWT')
