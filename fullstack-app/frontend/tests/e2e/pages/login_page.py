from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from .base_page import BasePage


class LoginPage(BasePage):
    TITLE = (By.CSS_SELECTOR, "[data-testid='auth-title']")
    TOGGLE_MODE_BUTTON = (By.CSS_SELECTOR, "[data-testid='auth-toggle-mode']")
    USERNAME_INPUT = (By.CSS_SELECTOR, "[data-testid='auth-username']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "[data-testid='auth-password']")
    EMAIL_INPUT = (By.CSS_SELECTOR, "[data-testid='auth-email']")
    SUBMIT_BUTTON = (By.CSS_SELECTOR, "[data-testid='auth-submit']")

    def open(self, frontend_base_url: str) -> None:
        self.driver.get(f"{frontend_base_url}/login")

    def wait_until_loaded(self) -> None:
        self.wait.until(EC.url_contains("/login"))
        self.wait.until(EC.visibility_of_element_located(self.TITLE))
        # we do not need to wait all elements, as they are not all visible at the same time or required for the tests

    def switch_to_signup(self) -> None:
        self.wait.until(EC.element_to_be_clickable(self.TOGGLE_MODE_BUTTON)).click()

    def login(self, username: str, password: str) -> None:
        self.wait.until(EC.visibility_of_element_located(self.USERNAME_INPUT)).send_keys(username)
        self.driver.find_element(*self.PASSWORD_INPUT).send_keys(password)
        self.driver.find_element(*self.SUBMIT_BUTTON).click()

    def signup(self, username: str, password: str, email: str) -> None:
        self.wait.until(EC.visibility_of_element_located(self.USERNAME_INPUT)).send_keys(username)
        self.driver.find_element(*self.PASSWORD_INPUT).send_keys(password)
        self.driver.find_element(*self.EMAIL_INPUT).send_keys(email)
        self.driver.find_element(*self.SUBMIT_BUTTON).click()
