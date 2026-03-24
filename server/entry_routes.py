from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Habit, db, HabitEntry
from datetime import date






entry_bp = Blueprint("entries", __name__, url_prefix="/entries")


@entry_bp.route("/", methods=["POST"])
@jwt_required()
def create_entry():

    user_id = int(get_jwt_identity())
    data = request.get_json()
    entry_date = date.fromisoformat(data.get("date"))
    habit_id = data.get("habit_id")
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
    if not habit:
        return jsonify({"message": "Habit not found"}), 404
    new_entry = HabitEntry(date=entry_date, habit_id=habit_id)
    db.session.add(new_entry)
    db.session.commit()
     

    return jsonify({"message": "Habit entry created successfully", "entry": {"id": new_entry.id, "date": new_entry.date.isoformat(), "habit_id": new_entry.habit_id}}), 201



@entry_bp.route("/<int:entry_id>", methods=["GET"])
@jwt_required()
def get_entry(entry_id):
    user_id = get_jwt_identity()
    entry = HabitEntry.query.filter_by(id=entry_id).first()
    if not entry or entry.habit.user_id != user_id:
        return jsonify({"message": "Habit entry not found"}), 404

    return jsonify({"entry": {"id": entry.id, "date": entry.date.isoformat(), "habit_id": entry.habit_id}}), 200



