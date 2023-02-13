from helpers import get_driver, wait_for_element, write_screenshot, admin_login, Constants
import time
from selenium.webdriver.common.by import By

constants = Constants()

def test_admin_login():
    global driver
    driver = get_driver()
    driver.get(constants.homeflix_url)
    wait_for_element(driver, "#theater-name")

    write_screenshot(driver, "admin_login")

    admin_login(driver)

    profile = driver.find_element("id", "profile")
    profile.click()


def test_navigate_to_admin_showings():
    wait_for_element(driver, "#admin-menu-nav")
    write_screenshot(driver, "add_showing_navbar_profile")

    admin_menu = driver.find_element("id", "admin-menu-nav")
    admin_menu.click()

    wait_for_element(driver, "#admin-container")
    write_screenshot(driver, "add_showing_admin_menu")

    showings_nav = driver.find_element("id", "showings-nav")
    showings_nav.click()
    write_screenshot(driver, "add_showing_admin_showings")

def test_search_for_movie():

    wait_for_element(driver, "#add-showing-button")
    add_showing = driver.find_element("id", "add-showing-button")
    add_showing.click()

    search_input = driver.find_element("id", "search-movie")
    search_input.send_keys("Avengers Endgame")
    time.sleep(4)
    write_screenshot(driver, "add_showing_search_for_movie")

    add_showing_endgame = driver.find_element("id", "add-showing-299534")
    add_showing_endgame.click()

    

def test_edit_showing_details():

    write_screenshot(driver, "add_showing_edit_showing_details")

    wait_for_element(driver, ".showing-datetime-picker")


    showing_date_div = driver.find_element( By.CLASS_NAME , "showing-datetime-picker")

    showing_date = showing_date_div.find_element(By.TAG_NAME, "input")
    showing_date.clear()
    showing_date.send_keys("01/12/2050 12:30 PM")

    submit_showing = driver.find_element("id", "submit-add-showing")
    submit_showing.click()

    write_screenshot(driver, "add_showing_submit_showing")

    driver.close()
    driver.quit()