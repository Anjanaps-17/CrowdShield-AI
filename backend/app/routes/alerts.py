from flask import Blueprint, jsonify
from app.services.alert_service import get_alerts

alerts_bp = Blueprint("alerts", __name__)


@alerts_bp.route("/alerts", methods=["GET"])
def alerts():
    data = get_alerts()
    return jsonify(data)