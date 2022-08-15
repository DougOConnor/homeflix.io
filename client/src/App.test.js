import puppeteer from "puppeteer";

describe("App.js", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it("Theater Name Displays", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#theater-name");
    const text = await page.$eval("#theater-name", (e) => e.textContent);
    expect(text).toContain("dougflix theater");
    await page.screenshot({ path: './screenshots/homescreen.jpg', type: 'jpeg' });
  });

  afterAll(() => browser.close());
});