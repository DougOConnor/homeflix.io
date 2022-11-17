import puppeteer from "puppeteer";
import {
  SCREENSHOT_PATH,
  THEATER_NAME,
  HOMEFLIX_URL
} from '../TestConstants'

//jest.useRealTimers();
const SCREEN_WIDTH = process.env.SCREEN_WIDTH
const SCREEN_HEIGHT = process.env.SCREEN_HEIGHT


const getScreenshotName = (name) => {
  return `${SCREENSHOT_PATH}${name}-${SCREEN_WIDTH}x${SCREEN_HEIGHT}.jpg`;
}

describe("First Time Setup", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      defaultViewport: {
        width: parseInt(SCREEN_WIDTH),
        height: parseInt(SCREEN_HEIGHT)
      }
    });
    page = await browser.newPage();
    await page.goto(HOMEFLIX_URL);
  }, 10000);

  it("Admin Creation", async () => {
    await page.waitForSelector("#username");
    await page.waitForTimeout(2000)
    await page.screenshot({ path: getScreenshotName('first_time_login_admin_create') });

    // Enter Username
    await page.type('input[id=username]', 'MyUsername')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: getScreenshotName('first_time_login_admin_create_username') });

    // Enter Password
    await page.type('input[id=password]', 'password')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: getScreenshotName('first_time_login_admin_create_password')});

    // Enter Confirm Password (Incomplete)
    await page.type('input[id=confirm-password]', 'passwor')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: getScreenshotName('first_time_login_admin_create_confirm_password_incomplete')});

    // Enter Confirm Password (Complete)
    await page.type('input[id=confirm-password]', 'd')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: getScreenshotName('first_time_login_admin_create_confirm_password_complete')});

    await page.click('[id="create-admin-account-button"]')
  }, 18000);

  it("Theater Info", async () => {
    await page.waitForSelector("#theater-name");
    await page.screenshot({ path: getScreenshotName('first_time_login_theater_info') });

    await page.type('input[id=theater-name]', THEATER_NAME)
    await page.waitForTimeout(2000)
    await page.screenshot({ path: getScreenshotName('first_time_login_theater_info_theater_name') });
    await page.click('[id="save-theater-info"]')
  }, 10000);

  it("Theater Layout", async () => {
    await page.waitForTimeout(2000)
    await page.screenshot({ path: getScreenshotName('first_time_login_theater_layout_start') });

    await page.waitForSelector("#add-row");
    await page.screenshot({ path: getScreenshotName('first_time_login_theater_layout') });

    // Remove all Rows
    await page.click('[id="remove-row"]')
    await page.click('[id="remove-row"]')
    await page.screenshot({ path: getScreenshotName('first_time_login_theater_layout_no_rows') });

    // Add 2 Rows
    await page.click('[id="add-row"]')
    await page.click('[id="add-row"]')
    for (let i = 0; i < 5; i++) {
      await page.click('[id="decrease-seat-size"]')
    }
    await page.screenshot({ path: getScreenshotName('first_time_login_theater_layout_3_rows') });

    await page.click('[id="row-0-add-seat"]')
    await page.click('[id="row-0-add-seat"]')
    await page.click('[id="row-0-add-seat"]')

    await page.click('[id="A3-move-right"]')
    await page.click('[id="A3-move-right"]')
    await page.click('[id="A3-move-right"]')

    await page.screenshot({ path: getScreenshotName('first_time_login_theater_layout_add_move_seats') });
    await page.click('[id="save-layout"]')

    await page.waitForSelector("#no-movies-found");
    await page.screenshot({ path: getScreenshotName('empty_homepage') });

  }, 15000);

  afterAll(() => browser.close(), 10000);
});