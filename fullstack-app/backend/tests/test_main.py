import os
import sys

from fastapi.testclient import TestClient

# Ensure the backend package is importable when tests run from repo root
BACKEND_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200

def test_signup():
    response = client.post(
        "/auth/signup",
        json={"username": "testuser", "password": "testpass", "email": "testuser@example.com"}
    )
    assert response.status_code == 200
    assert "status" in response.json()
