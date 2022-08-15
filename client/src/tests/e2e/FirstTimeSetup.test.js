import puppeteer from "puppeteer";
import {
  SCREENSHOT_PATH,
  THEATER_NAME,
  HOMEFLIX_URL
} from '../TestConstants'

//jest.useRealTimers();


const take_screenshot = async (page, name) => {
  await page.screenshot({ path: `${SCREENSHOT_PATH}${name}-${process.env.SCREEN_WIDTH}x${process.env.SCREEN_HEIGHT}.jpg` });
}

describe("First Time Setup", () => {
  let browser;
  let page;
  

  beforeAll(async () => {
    browser = await puppeteer.launch({
      defaultViewport: {
        width: parseInt(process.env.SCREEN_WIDTH),
        height: parseInt(process.env.SCREEN_HEIGHT)
      }
  });
    page = await browser.newPage();
    await page.goto(HOMEFLIX_URL);
  }, 10000);

  it("Admin Creation", async () => {
    await page.waitForSelector("#username");
    take_screenshot(page, 'first_time_login_admin_create.jpg');

    // Enter Username
    await page.type('input[id=username]', 'MyUsername')
    take_screenshot(page, 'first_time_login_admin_create_username.jpg');

    // Enter Password
    await page.type('input[id=password]', 'password')
    take_screenshot(page, 'first_time_login_admin_create_password.jpg');

    // Enter Confirm Password (Incomplete)
    await page.type('input[id=confirm-password]', 'passwor')
    await page.waitForTimeout(2000)
    take_screenshot(page, 'first_time_login_admin_create_confirm_password_incomplete.jpg');

    // Enter Confirm Password (Complete)
    await page.type('input[id=confirm-password]', 'd')
    await page.waitForTimeout(2000)
    take_screenshot(page, 'first_time_login_admin_create_confirm_password_complete.jpg');

    await page.click('[id="create-admin-account-button"]')
  }, 12000);

  it("Theater Info", async () => {
    await page.waitForSelector("#theater-name");
    take_screenshot(page, 'first_time_login_theater_info.jpg');

    await page.type('input[id=theater-name]', THEATER_NAME)
    take_screenshot(page, 'first_time_login_theater_info_theater_name.jpg');
    await page.click('[id="save-theater-info"]')
  }, 10000);

  it("Theater Layout", async () => {
    await page.waitForSelector("#add-row");
    take_screenshot(page, 'first_time_login_theater_layout.jpg');

    // Remove all Rows
    await page.click('[id="remove-row"]')
    await page.click('[id="remove-row"]')
    take_screenshot(page, 'first_time_login_theater_layout_no_rows.jpg');

    // Add 2 Rows
    await page.click('[id="add-row"]')
    await page.click('[id="add-row"]')
    for (let i = 0; i < 5; i++) {
      await page.click('[id="decrease-seat-size"]')
    }
    take_screenshot(page, 'first_time_login_theater_layout_3_rows.jpg');

    await page.click('[id="row-0-add-seat"]')
    await page.click('[id="row-0-add-seat"]')
    await page.click('[id="row-0-add-seat"]')

    await page.click('[id="A3-move-right"]')
    await page.click('[id="A3-move-right"]')
    await page.click('[id="A3-move-right"]')

    take_screenshot(page, 'first_time_login_theater_layout_add_move_seats.jpg');
    await page.click('[id="save-layout"]')

    await page.waitForSelector("#no-movies-found");
    take_screenshot(page, 'empty_homepage.jpg' );

  }, 10000);

  afterAll(() => browser.close(), 10000);
});