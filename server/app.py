from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import db
from config import Config
from auth_routes import auth_bp
from habit_routes import habit_bp
from entry_routes import entry_bp



app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
Migrate(app, db)
app.register_blueprint(auth_bp)
app.register_blueprint(habit_bp)
app.register_blueprint(entry_bp)
JWTManager(app)


@app.route("/")
def home():
    return {"message": "Momentum backend is running!"}


if __name__ == "__main__":
    app.run(debug=True)


