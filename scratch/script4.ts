import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.click();
  await page.waitForTimeout(2000); 
  
  await page.evaluate(() => {
    const cb = document.querySelector('input[type="checkbox"][name="autorizacao-checkbox[]"]');
    if (cb) { cb.click(); }
  });
  
  await page.waitForTimeout(500); 
  
  // Click submit
  await page.evaluate(() => {
      // Find the submit button inside the currently visible form
      const submits = Array.from(document.querySelectorAll('input[type="submit"]'));
      // get the visible one
      for (const btn of submits) {
          if (btn.offsetWidth > 0 && btn.offsetHeight > 0) {
              btn.click();
              break;
          }
      }
  });
  
  await page.waitForTimeout(3000); // Wait for CF7 AJAX response
  
  const spans = await page.locator('.wpcf7-not-valid-tip').all();
  for (const span of spans) {
    const text = await span.innerText();
    console.log(`Validation tip: ${text}`);
  }
  
  await browser.close();
})();
