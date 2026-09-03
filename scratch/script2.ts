import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  console.log('Suporte loaded');
  
  // Click on "Entrar em contato"
  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.click();
  await page.waitForTimeout(2000);
  
  // Dump the form HTML or check inputs
  const inputs = await page.locator('form input, form select, form textarea').all();
  for (const input of inputs) {
     const type = await input.getAttribute('type');
     const name = await input.getAttribute('name');
     const id = await input.getAttribute('id');
     console.log(`Input: type=${type}, name=${name}, id=${id}`);
  }
  
  const labels = await page.locator('form label').all();
  for (const label of labels) {
     const text = await label.innerText();
     console.log(`Label: text=${text}`);
  }
  
  await browser.close();
})();
