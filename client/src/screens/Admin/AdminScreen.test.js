import puppeteer from "puppeteer";

describe("Admin Screen", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/admin");
  });

  it("Admin Schreenshot", async () => {
    await page.screenshot({ path: './screenshots/admin.jpg', type: 'jpeg' });
  });

  afterAll(() => browser.close());
});