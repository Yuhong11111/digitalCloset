from tests.e2e.pages.home_page import HomePage
from tests.e2e.pages.login_page import LoginPage
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def test_home_page_loads_and_navigates_to_login(driver, frontend_base_url: str):
    home_page = HomePage(driver)
    login_page = LoginPage(driver)

    home_page.open(frontend_base_url) #navigate to the home page of the web application using the open method of the HomePage class, which takes the frontend_base_url as an argument and constructs the full URL for the home page.
    home_page.wait_until_loaded()
    assert "Welcome to the Digital Closet" in home_page.title_text()

    home_page.go_to_login()
    WebDriverWait(driver, 10).until(EC.url_contains("/login"))
    login_page.wait_until_loaded()
