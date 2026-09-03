import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  await page.evaluate(() => {
    const b = document.querySelector('.main-cookies-popup');
    if(b) b.remove();
  });
  
  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await link.click();
  
  await page.waitForTimeout(2000);
  
  const isVisible = await page.locator('form:visible').count();
  console.log(`Visible forms: ${isVisible}`);
  
  await browser.close();
})();
