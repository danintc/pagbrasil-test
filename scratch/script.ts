import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/');
  console.log('Home loaded');
  
  // click fale com um especialista
  await page.getByRole('link', { name: 'Fale com um especialista' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  console.log('URL after click: ' + page.url());
  
  // Look for text "Tenho um e-commerce"
  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.click();
  await page.waitForLoadState('domcontentloaded');
  console.log('URL after second click: ' + page.url());
  
  // Check the form
  await page.waitForSelector('form', { state: 'visible' });
  const formHtml = await page.locator('form').first().innerHTML();
  console.log('Form found, size: ', formHtml.length);
  
  await browser.close();
})();
