import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.pagbrasil.com/pt-br/suporte/');
  
  // wait for response
  page.on('response', async (res) => {
    if (res.url().includes('contact-forms') || res.url().includes('wp-json')) {
      console.log(`API URL: ${res.url()}`);
      console.log(`Status: ${res.status()}`);
      console.log(`Body: ${await res.text()}`);
    }
  });

  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      .suporte-options-form,
      .form.fale-com-um-especialistaem-pagamentos-parae-commerce {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        height: auto !important;
        position: relative !important;
        z-index: 999999 !important;
        background: white !important;
      }
    `;
    document.head.appendChild(style);
  });
  
  await page.waitForTimeout(500);
  
  const form = page.locator('.fale-com-um-especialistaem-pagamentos-parae-commerce form').first();
  const submitBtn = form.locator('input[type="submit"]').first();
  
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('contact-forms') || response.url().includes('feedback')
  );
  
  await submitBtn.click({ force: true });
  await responsePromise;
  
  await browser.close();
})();
