import { chromium, expect } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.pagbrasil.com/pt-br/contato/'); // Go directly to contato page to save time
  
  console.log('Scrolling to wake up NitroPack...');
  await page.mouse.move(100, 100);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(2000); // Wait for lazy JS to load

  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.scrollIntoViewIfNeeded();
  
  console.log('Clicking "Entrar em contato"...');
  await link.click();
  
  console.log('Waiting for form to become visible natively...');
  const form = page.locator('.fale-com-um-especialistaem-pagamentos-parae-commerce form').first();
  
  try {
    await form.waitFor({ state: 'visible', timeout: 8000 });
    console.log('Form became visible natively!');
  } catch(e) {
    console.log('Form did NOT become visible.');
  }

  await browser.close();
})();
