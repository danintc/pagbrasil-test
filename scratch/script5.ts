import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.click();
  await page.waitForTimeout(2000); 
  
  const html = await page.locator('form').first().innerHTML();
  const fs = require('fs');
  fs.writeFileSync('form.html', html);
  console.log('Saved to form.html');
  
  await browser.close();
})();
