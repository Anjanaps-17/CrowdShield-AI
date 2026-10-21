import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True

    with app.test_client() as test_client:
        yield test_client


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"


def test_crowd_density_endpoint(client):
    response = client.get("/crowd-density")

    assert response.status_code == 200
    data = response.get_json()
    assert "crowd_count" in data
    assert "density" in data
    assert "zone" in data


def test_risk_level_endpoint(client):
    response = client.get("/risk-level")

    assert response.status_code == 200
    data = response.get_json()
    assert "risk_level" in data
    assert "confidence" in data
    assert "reason" in data


def test_alerts_endpoint(client):
    response = client.get("/alerts")

    assert response.status_code == 200
    data = response.get_json()
    assert "alert" in data
    assert "priority" in data
    assert "zone" in data


def test_evacuation_endpoint(client):
    response = client.get("/evacuation-route")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "route_found"
    assert data["route"] in {"Gate 1", "Gate 2"}
    assert data["estimated_time_minutes"] > 0
    assert len(data["path"]) >= 2
