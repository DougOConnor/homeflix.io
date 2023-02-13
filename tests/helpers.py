from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import os

from retry import retry

SCREEN_WIDTH = os.environ.get("SCREEN_WIDTH", 1920)
SCREEN_HEIGHT = os.environ.get("SCREEN_HEIGHT", 1080)

@retry(tries=5, delay=3)
def get_driver():
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument(f"--window-size={SCREEN_WIDTH},{SCREEN_HEIGHT}")
    driver = webdriver.Remote(
        command_executor='http://localhost:4444/wd/hub',
        options=chrome_options
    )
    return driver

def wait_for_element(driver, selector):
    return WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
    )

def write_screenshot(driver, filename):
    driver.save_screenshot(
        os.path.join(
            os.path.dirname(__file__),
            'screenshots',
            filename + "_" + SCREEN_WIDTH + "_" + SCREEN_HEIGHT + ".png"
        )
    )

def admin_login(driver):
    constants = Constants()

    login = driver.find_element("id", 'login-nav')
    login.click()

    username = driver.find_element("id", 'username')
    username.send_keys(constants.admin_username)

    password = driver.find_element("id", 'password')
    password.send_keys(constants.admin_password)

    login_button = driver.find_element("id", 'login-button')
    login_button.click()

class Constants:

    def __init__(self):
        self.admin_username = 'MyUsername'
        self.admin_password = 'password'
        self.theater_name = 'MyTheater'
        self.homeflix_url = 'http://homeflix:5000'