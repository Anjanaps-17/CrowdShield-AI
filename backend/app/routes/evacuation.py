from flask import Blueprint, jsonify
from app.services.evacuation_service import get_evacuation_route

evacuation_bp = Blueprint("evacuation", __name__)


@evacuation_bp.route("/evacuation-route", methods=["GET"])
def evacuation():
    data = get_evacuation_route()
    return jsonify(data)