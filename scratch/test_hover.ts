import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.pagbrasil.com/pt-br/');
  
  console.log('Hovering over "Sobre"...');
  await page.locator('header').getByRole('link', { name: 'Sobre', exact: true }).first().hover();
  
  console.log('Clicking "Quem somos"...');
  await page.locator('header').getByRole('link', { name: 'Quem somos', exact: true }).first().click();
  
  console.log('URL after click:', page.url());
  await browser.close();
})();
