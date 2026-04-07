import os
import sys


BACKEND_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

from app.schemas.message import AIRequest


def test_ai_request_as_form_supports_recommendations_flag():
    request = AIRequest.as_form(
        message="User: hello\nAssistant:",
        max_tokens=200,
        mode="chat",
        recommendations_enabled=False,
    )

    assert request.message == "User: hello\nAssistant:"
    assert request.max_tokens == 200
    assert request.mode == "chat"
    assert request.recommendations_enabled is False
