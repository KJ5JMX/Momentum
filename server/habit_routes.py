from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Habit


habit_bp = Blueprint("habits", __name__, url_prefix="/habits")


@habit_bp.route("/", methods=["POST"])
@jwt_required()
def create_habit():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    schedule = data.get("schedule")
    category = data.get("category")

    new_habit = Habit(name=name, category=category, description=description, schedule=schedule, user_id=user_id)
    db.session.add(new_habit)
    db.session.commit()

    return jsonify({"message": "Habit created successfully", "habit": {"id": new_habit.id, "name": new_habit.name, "description": new_habit.description, "schedule": new_habit.schedule, "category": new_habit.category}}), 201




@habit_bp.route("/", methods=["GET"])
@jwt_required()
def get_habits():
    user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Habit.query.filter_by(user_id=user_id).paginate(page=page, per_page=per_page, error_out=False)
    habits_data = [{"id": habit.id, "name": habit.name, "category": habit.category, "description": habit.description, "schedule": habit.schedule} for habit in pagination.items]
    return jsonify({"habits": habits_data, "page": pagination.page, "per_page": pagination.per_page, "total": pagination.total, "pages": pagination.pages}), 200




@habit_bp.route("/<int:habit_id>", methods=["PUT"])
@jwt_required()
def update_habit(habit_id):
    user_id = get_jwt_identity()
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
    if not habit:
        return jsonify({"message": "Habit not found"}), 404

    data = request.get_json()
    habit.name = data.get("name", habit.name)
    habit.description = data.get("description", habit.description)
    habit.schedule = data.get("schedule", habit.schedule)
    habit.category = data.get("category", habit.category)
    db.session.commit()

    return jsonify({"message": "Habit updated successfully", "habit": {"id": habit.id, "name": habit.name, "description": habit.description, "schedule": habit.schedule, "category": habit.category}}), 200



@habit_bp.route("/<int:habit_id>", methods=["DELETE"])
@jwt_required()
def delete_habit(habit_id):
    user_id = get_jwt_identity()
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
    if not habit:
        return jsonify({"message": "Habit not found"}), 404

    db.session.delete(habit)
    db.session.commit()

    return jsonify({"message": "Habit deleted successfully"}), 200      