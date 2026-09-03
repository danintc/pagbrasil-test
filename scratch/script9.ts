import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  const links = await page.locator('a').filter({ hasText: 'Entrar em contato' }).all();
  console.log(`Found ${links.length} links`);
  for (let i = 0; i < links.length; i++) {
    const isVisible = await links[i].isVisible();
    const html = await links[i].evaluate(el => el.outerHTML);
    console.log(`Link ${i}: visible=${isVisible}, html=${html}`);
  }
  
  await browser.close();
})();
