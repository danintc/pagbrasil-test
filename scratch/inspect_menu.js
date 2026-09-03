const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://www.pagbrasil.com/?preferred_language=en');
  
  const headerLinks = await page.locator('#masthead').innerText();
  console.log('Header text:\n', headerLinks);
  
  await browser.close();
})();
