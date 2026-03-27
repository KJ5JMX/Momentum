from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    habits = db.relationship("Habit", backref="user", cascade="all, delete-orphan")


class Habit(db.Model):
    __tablename__ = "habits"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String)
    description = db.Column(db.String)
    schedule = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    entries = db.relationship("HabitEntry", backref="habit", cascade="all, delete-orphan")


class HabitEntry(db.Model):
    __tablename__ = "habit_entries"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    habit_id = db.Column(db.Integer, db.ForeignKey("habits.id"), nullable=False)



    
