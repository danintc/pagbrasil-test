import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.click();
  await page.waitForTimeout(2000); 
  
  const form = page.locator('form').filter({ state: 'visible' }).first();
  const cb = form.locator('input[type="checkbox"][name="autorizacao-checkbox[]"]').first();
  await cb.evaluate((node: HTMLInputElement) => node.click());
  
  const submitBtn = form.locator('input[type="submit"]').first();
  await submitBtn.evaluate((node: HTMLInputElement) => node.click());
  
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'd:/cursos/pagbrasil-test/scratch/screenshot.png', fullPage: true });
  console.log('Screenshot saved');
  await browser.close();
})();
