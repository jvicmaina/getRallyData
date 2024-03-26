const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.wrc.com/teams-and-drivers?menu=WRC&tab=drivers');

  // Wait for the content to load
  await page.waitForSelector('.renderIfVisible');

  const items = await page.$$('.renderIfVisible');

  if (items.length > 0) {
    for (const item of items) {
      // Extract desired information from each item
      const textContent = await item.evaluate(node => node.textContent.trim());
      console.log(textContent);
    }
  } else {
    console.log('No items found with class name "renderIfVisible".');
  }

  await browser.close();
})();
