import os
import sys
from uuid import uuid4

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
    # Use unique username to avoid conflicts
    unique_username = f"testuser_{uuid4().hex[:8]}"
    response = client.post(
        "/auth/signup",
        json={"username": unique_username, "password": "testpass", "email": "testuser@example.com"}
    )
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.json()}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
    assert "status" in response.json()
