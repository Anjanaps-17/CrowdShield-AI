from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/")
def home():
    return jsonify({
        "message": "Welcome to CrowdShield AI Backend!"
    })


@health_bp.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "CrowdShield AI Backend"
    })