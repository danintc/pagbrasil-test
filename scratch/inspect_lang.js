const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/');
  
  const footer = page.locator('footer');
  const btnIdioma = footer.getByRole('link', { name: 'En', exact: true });
  await btnIdioma.click();
  await page.waitForLoadState('domcontentloaded');
  
  console.log('URL:', page.url());
  const htmlLang = await page.getAttribute('html', 'lang');
  console.log('Lang:', htmlLang);
  
  await browser.close();
})();
