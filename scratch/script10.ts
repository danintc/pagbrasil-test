import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  // Find the form
  const form = page.locator('form').filter({ has: page.locator('input[name="autorizacao-checkbox[]"]') }).first();
  
  // get outer HTML of the popup wrapper (like 5 levels up)
  const wrapperHtml = await form.evaluate(el => {
    let p = el;
    for(let i=0; i<6; i++) {
        if(p.parentElement) p = p.parentElement;
    }
    return p.outerHTML;
  });
  
  const fs = require('fs');
  fs.writeFileSync('d:/cursos/pagbrasil-test/scratch/wrapper.html', wrapperHtml);
  
  await browser.close();
})();
