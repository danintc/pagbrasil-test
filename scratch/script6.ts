import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.click();
  await page.waitForTimeout(2000); 
  
  // click the label itself
  await page.locator('.wpcf7-list-item-label').filter({ hasText: /WhatsApp/i }).first().click();
  
  await page.waitForTimeout(1000); 
  
  const spans = await page.locator('.wpcf7-not-valid-tip').all();
  for (const span of spans) {
    const text = await span.innerText();
    console.log(`Validation tip after click: ${text}`);
  }
  
  const html = await page.locator('form').first().innerHTML();
  if (html.includes('obrigat')) {
      console.log('Found obrigat in HTML');
  } else {
      console.log('No obrigat found in HTML');
  }
  
  await browser.close();
})();
