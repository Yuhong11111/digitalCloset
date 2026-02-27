# base page is for shared methods and properties that can be used across different page objects in the end-to-end tests. 
# It provides a common interface for interacting with the web application, such as waiting for elements to be visible, clicking on elements, and navigating to different pages. 
# By using a base page, we can avoid code duplication and make our test code more maintainable and reusable.

from selenium.webdriver.support.ui import WebDriverWait


class BasePage:
    def __init__(self, driver, timeout: int = 20):
        self.driver = driver
        self.wait = WebDriverWait(driver, timeout)
