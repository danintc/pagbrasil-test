import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.pagbrasil.com/pt-br/');
  
  console.log('Hovering parent li...');
  // Find the menu item that contains the text
  const menuLi = page.locator('li.menu-item-has-children').filter({ hasText: 'Sobre' }).first();
  await menuLi.hover();
  
  console.log('Waiting for submenu to be visible...');
  const subMenuLink = menuLi.locator('ul').getByRole('link', { name: 'Quem somos', exact: true });
  
  try {
    await subMenuLink.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Visible! Clicking...');
    await subMenuLink.click();
    console.log('Clicked. URL:', page.url());
  } catch(e) {
    console.log('Failed to make visible natively via hover.');
  }
  
  await browser.close();
})();
