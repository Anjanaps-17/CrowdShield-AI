from flask import Flask
from app.routes.health import health_bp
from app.routes.crowd import crowd_bp
from app.routes.risk import risk_bp
from app.routes.alerts import alerts_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(health_bp)
    app.register_blueprint(crowd_bp)
    app.register_blueprint(risk_bp)
    app.register_blueprint(alerts_bp)

    return app