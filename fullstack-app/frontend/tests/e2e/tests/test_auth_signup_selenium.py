from uuid import uuid4

from tests.e2e.pages.closet_page import ClosetPage
from tests.e2e.pages.login_page import LoginPage


def test_signup_redirects_to_closet(driver, frontend_base_url: str):
    unique_suffix = uuid4().hex[:8]
    username = f"e2e_user_{unique_suffix}"
    email = f"e2e_{unique_suffix}@example.com"
    password = "E2Epass123!"

    login_page = LoginPage(driver)
    closet_page = ClosetPage(driver)

    login_page.open(frontend_base_url)
    login_page.switch_to_signup()
    login_page.signup(username=username, password=password, email=email)

    closet_page.wait_until_loaded()
    assert "Welcome to your Closet" in closet_page.title_text()
