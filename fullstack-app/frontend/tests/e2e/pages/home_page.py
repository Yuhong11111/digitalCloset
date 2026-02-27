from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from .base_page import BasePage


class HomePage(BasePage):
    TITLE = (By.CSS_SELECTOR, "[data-testid='home-title']")
    START_BUTTON = (By.CSS_SELECTOR, "[data-testid='start-button']")

    def open(self, frontend_base_url: str) -> None:
        self.driver.get(f"{frontend_base_url}/")

    def wait_until_loaded(self) -> None:
        self.wait.until(EC.visibility_of_element_located(self.TITLE))
        self.wait.until(EC.element_to_be_clickable(self.START_BUTTON))

    def title_text(self) -> str:
        return self.driver.find_element(*self.TITLE).text

    def go_to_login(self) -> None:
        self.driver.find_element(*self.START_BUTTON).click()
