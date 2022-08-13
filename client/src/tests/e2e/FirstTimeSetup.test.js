import puppeteer from "puppeteer";
import {
  SCREENSHOT_PATH,
  THEATER_NAME,
  HOMEFLIX_URL
} from '../TestConstants'

describe("First Time Setup", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });

  it("Admin Creation", async () => {
    await page.waitForSelector("#username");
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_admin_create.jpg' });

    // Enter Username
    await page.type('input[id=username]', 'MyUsername')
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_admin_create_username.jpg' });

    // Enter Password
    await page.type('input[id=password]', 'password')
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_admin_create_password.jpg'});

    // Enter Confirm Password (Incomplete)
    await page.type('input[id=confirm-password]', 'passwor')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_admin_create_confirm_password_incomplete.jpg'});

    // Enter Confirm Password (Complete)
    await page.type('input[id=confirm-password]', 'd')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_admin_create_confirm_password_complete.jpg'});

    await page.click('[id="create-admin-account-button"]')
  }, 12000);

  it("Theater Info", async () => {
    await page.waitForSelector("#theater-name");
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_theater_info.jpg' });

    await page.type('input[id=theater-name]', THEATER_NAME)
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_theater_info_theater_name.jpg' });
    await page.click('[id="save-theater-info"]')
  }, 10000);

  it("Theater Layout", async () => {
    await page.waitForSelector("#add-row");
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_theater_layout.jpg' });

    // Remove all Rows
    await page.click('[id="remove-row"]')
    await page.click('[id="remove-row"]')
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_theater_layout_no_rows.jpg' });

    // Add 2 Rows
    await page.click('[id="add-row"]')
    await page.click('[id="add-row"]')
    for (let i = 0; i < 5; i++) {
      await page.click('[id="decrease-seat-size"]')
    }
    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_theater_layout_3_rows.jpg' });

    await page.click('[id="row-0-add-seat"]')
    await page.click('[id="row-0-add-seat"]')
    await page.click('[id="row-0-add-seat"]')

    await page.click('[id="A3-move-right"]')
    await page.click('[id="A3-move-right"]')
    await page.click('[id="A3-move-right"]')

    await page.screenshot({ path: SCREENSHOT_PATH + 'first_time_login_theater_layout_add_move_seats.jpg' });
    await page.click('[id="save-layout"]')

    await page.waitForSelector("#no-movies-found");
    await page.screenshot({ path: SCREENSHOT_PATH + 'empty_homepage.jpg' });

  }, 10000);

  afterAll(() => browser.close());
});