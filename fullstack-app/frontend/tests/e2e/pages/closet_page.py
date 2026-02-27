from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from .base_page import BasePage


class ClosetPage(BasePage):
    TITLE = (By.CSS_SELECTOR, "[data-testid='closet-title']")

    def wait_until_loaded(self) -> None:
        self.wait.until(EC.url_contains("/closet"))
        self.wait.until(EC.visibility_of_element_located(self.TITLE))

    def title_text(self) -> str:
        return self.driver.find_element(*self.TITLE).text
