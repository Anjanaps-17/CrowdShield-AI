from flask import Blueprint, jsonify
from app.services.risk_service import get_risk_level

risk_bp = Blueprint("risk", __name__)


@risk_bp.route("/risk-level", methods=["GET"])
def get_risk():
    data = get_risk_level("Medium")
    return jsonify(data)