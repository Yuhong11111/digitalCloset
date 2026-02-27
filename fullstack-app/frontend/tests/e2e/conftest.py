# test environment setup for end-to-end tests using pytest and Selenium WebDriver
# if you do not use it, you need to create a webdriver instance in each test file, which is not efficient and can lead to code duplication

import os

import pytest
from selenium import webdriver #create a webdriver instance to control the browser, which is used to simulate user interactions with the web application
from selenium.webdriver.chrome.options import Options


@pytest.fixture(scope="session")
def frontend_base_url() -> str:
    return os.getenv("E2E_FRONTEND_URL", "http://localhost:3000").rstrip("/")


# create the selenium browser instance, which will be used in the test cases to interact with the web application.
# The fixture is scoped to "session", which means that the same browser instance will be used for all tests in the session, and it will be closed after all tests are done. 
# The browser is configured to run in headless mode if the E2E_HEADLESS environment variable is set to true, and it also sets some options to improve performance and compatibility in different environments.
@pytest.fixture(scope="session")
def driver():
    options = Options()
    if os.getenv("E2E_HEADLESS", "true").lower() in {"1", "true", "yes"}:
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1400,1000")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    browser = webdriver.Chrome(options=options)
    yield browser
    browser.quit()
