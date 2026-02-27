from tests.e2e.pages.closet_page import ClosetPage
from tests.e2e.pages.login_page import LoginPage

def test_login_redirects_to_closet(driver, frontend_base_url: str):
    username = f"test1"
    password = "test1"

    login_page = LoginPage(driver)
    closet_page = ClosetPage(driver)

    login_page.open(frontend_base_url)
    login_page.wait_until_loaded()
    login_page.login(username=username, password=password)

    closet_page.wait_until_loaded()
    assert "Welcome to your Closet" in closet_page.title_text()