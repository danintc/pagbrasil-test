import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.pagbrasil.com/pt-br/sobre-nos/', { waitUntil: 'networkidle' });

  const footerElements = await page.evaluate(() => {
    const footer = document.querySelector('footer, .site-footer');
    if (!footer) return 'No footer found';
    
    // Procura por selos, certificações no rodapé
    const allImgs = footer.querySelectorAll('img');
    const imgsInfo = Array.from(allImgs).map(img => ({
      alt: img.alt,
      src: img.src,
      class: img.className
    }));

    // Cidades
    const textElements = Array.from(footer.querySelectorAll('li, p, span, div')).filter(el => {
      const text = el.textContent || '';
      return text.includes('Porto Alegre') || text.includes('Barcelona');
    }).map(el => el.textContent?.trim());

    return { imgs: imgsInfo, cities: textElements.slice(0, 3) };
  });

  console.log(JSON.stringify(footerElements, null, 2));

  await browser.close();
})();
