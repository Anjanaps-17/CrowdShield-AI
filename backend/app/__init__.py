
from flask import Flask, jsonify
from werkzeug.exceptions import RequestEntityTooLarge

from app.routes.health import health_bp
from app.routes.crowd import crowd_bp
from app.routes.risk import risk_bp
from app.routes.alerts import alerts_bp
from app.routes.evacuation import evacuation_bp
from app.routes.upload import upload_bp


def create_app():
    app = Flask(__name__)

    # Limit each incoming request to 50 MB.
    app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024

    # Return a JSON response when a request exceeds the size limit.
    @app.errorhandler(RequestEntityTooLarge)
    def handle_request_too_large(error):
        limit_bytes = app.config["MAX_CONTENT_LENGTH"]

        if limit_bytes < 1024 * 1024:
            limit_description = f"{limit_bytes} bytes"
        else:
            limit_mb = limit_bytes / (1024 * 1024)
            limit_description = f"{limit_mb:.2f} MB"

        return jsonify({
            "error": (
                "Uploaded request exceeds the configured "
                f"limit of {limit_description}"
            )
        }), 413

    # Register API route blueprints.
    app.register_blueprint(health_bp)
    app.register_blueprint(crowd_bp)
    app.register_blueprint(risk_bp)
    app.register_blueprint(alerts_bp)
    app.register_blueprint(evacuation_bp)
    app.register_blueprint(upload_bp)

    return app
