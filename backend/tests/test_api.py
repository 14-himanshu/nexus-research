import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Multi-Agent Research API" in response.json()["message"]

def test_user_signup_and_login():
    # Use a unique username for each test run to avoid conflicts
    unique_username = f"testuser_{uuid.uuid4().hex[:8]}"
    password = "securepassword123"

    # Test Signup
    response = client.post(
        "/signup",
        json={"username": unique_username, "password": password}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

    # Test Login
    login_response = client.post(
        "/login",
        json={"username": unique_username, "password": password}
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
    
    # Test getting user profile
    token = login_response.json()["access_token"]
    me_response = client.get(
        "/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    assert me_response.json()["username"] == unique_username

def test_login_invalid_credentials():
    response = client.post(
        "/login",
        json={"username": "nonexistentuser123", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
