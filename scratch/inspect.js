const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/');
  
  const footerHtml = await page.innerHTML('footer');
  console.log(footerHtml.substring(0, 1000));
  
  const langLinks = await page.locator('footer a').allInnerTexts();
  console.log('Footer links:', langLinks);
  
  await browser.close();
})();
