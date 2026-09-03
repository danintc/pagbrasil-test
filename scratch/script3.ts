import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  // click "Entrar em contato"
  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.click();
  await page.waitForTimeout(2000); // Wait for animations
  
  // check the checkbox
  await page.evaluate(() => {
    const cb = document.querySelector('input[type="checkbox"][name="autorizacao-checkbox[]"]');
    if (cb) { cb.click(); }
  });
  
  await page.waitForTimeout(1000); // Wait for validation to show up
  
  // dump all texts inside the form
  const spans = await page.locator('.wpcf7-not-valid-tip').all();
  for (const span of spans) {
    const text = await span.innerText();
    console.log(`Validation tip: ${text}`);
  }
  
  // If no validation tips found, maybe it's some other class
  const html = await page.locator('form').first().innerHTML();
  console.log('Form HTML snapshot size: ', html.length);
  // check if 'Campo obrigatório' or 'O campo é obrigatório.' exists in HTML
  if (html.includes('obrigat')) {
      console.log('Found obrigat in HTML');
  } else {
      console.log('No obrigat found in HTML');
  }
  
  await browser.close();
})();
