from helpers import get_driver, wait_for_element, write_screenshot, Constants

constants = Constants()

def test_first_time_login():
    global driver
    driver = get_driver()
    driver.get(constants.homeflix_url)

    wait_for_element(driver, "#username")
    write_screenshot(driver, 'first_time_login')

    username = driver.find_element("id", 'username')
    username.send_keys(constants.admin_username)
    write_screenshot(driver, 'first_time_login_username')

    password = driver.find_element("id", 'password')
    password.send_keys(constants.admin_password)
    write_screenshot(driver, 'first_time_login_password')

    confirm_password = driver.find_element("id", 'confirm-password')
    confirm_password.send_keys(constants.admin_password)
    write_screenshot(driver, 'first_time_login_confirm_password')

    create_account = driver.find_element("id", 'create-admin-account-button')
    create_account.click()
    write_screenshot(driver, 'first_time_login_create_account')
    

def test_theater_info():

    wait_for_element(driver, "#theater-name-input")
    write_screenshot(driver, 'theater_info')

    theater_name = driver.find_element("id", 'theater-name-input')
    theater_name.send_keys(constants.theater_name)
    write_screenshot(driver, 'theater_name')

    submit = driver.find_element("id", 'save-theater-info')
    submit.click()

    

def test_theater_layout():

    wait_for_element(driver, "#add-row")
    write_screenshot(driver, 'theater_layout')

    # Remove All Rows
    remove_row = driver.find_element("id", 'remove-row')
    remove_row.click()
    remove_row.click()
    write_screenshot(driver, 'theater_layout_no_rows')

    ## Add 2 Rows
    add_row = driver.find_element("id", 'add-row')
    add_row.click()
    add_row.click()
    write_screenshot(driver, 'theater_layout_two_rows')

    ## Decrease Seat Size
    decrease_seat_size = driver.find_element("id", 'decrease-seat-size')
    for i in range(0, 5):
        decrease_seat_size.click()

    write_screenshot(driver, 'theater_layout_decrease_seat_size')

    ## Add Seats
    row_0_add_seat = driver.find_element("id", 'row-0-add-seat')
    for i in range(0, 2):
        row_0_add_seat.click()
    
    ## Move Seats
    a3_slide_right = driver.find_element("id", 'A3-move-right')
    for i in range(0, 2):
        a3_slide_right.click()
    
    write_screenshot(driver, 'theater_layout_move_seats')

    # Save Layout
    save_layout = driver.find_element("id", 'save-layout')
    save_layout.click()
    
    driver.close()
    driver.quit()
    

