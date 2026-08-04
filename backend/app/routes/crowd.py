from flask import Blueprint, jsonify
from app.services.crowd_service import get_crowd_data

crowd_bp = Blueprint("crowd", __name__)


@crowd_bp.route("/crowd-density", methods=["GET"])
def get_crowd_density():
    data = get_crowd_data()
    return jsonify(data)