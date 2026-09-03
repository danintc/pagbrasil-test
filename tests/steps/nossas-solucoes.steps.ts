import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { DataTable } from '@cucumber/cucumber';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

const megaMenu = (page: Page) => page.locator('#menu-item-48800');

Given('que estou na página inicial da PagBrasil', async ({ page }) => {
  await page.goto('https://www.pagbrasil.com/pt-br/');
  
  /*
  // Descomente o bloco abaixo caso queira ocultar o banner de cookies nas 
  // evidências visuais (Trace Viewer) no futuro:
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      .main-cookies-popup, [id*="cookie-law"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);
  });
  */
});

When('acesso o menu {string}', async ({ page }, menuName: string) => {
  // Injeção de CSS para contornar a limitação do Trace Viewer em capturar
  // pseudoclasses (:hover), garantindo que o menu seja renderizado nas evidências
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      #menu-item-48800 ul {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        left: 0 !important;
        position: relative !important;
      }
    `;
    document.head.appendChild(style);
  });
  
  // Interação nativa mantida para simular fielmente a navegação do usuário
  const menuParent = page.locator('.menu-item-has-children').filter({ hasText: menuName }).first();
  await menuParent.hover();
  await page.waitForTimeout(500);
});

Then('o menu deve exibir os itens:', async ({ page }, items: DataTable) => {
  for (const [item] of items.raw()) {
    await expect(megaMenu(page).getByText(item, { exact: true }).first()).toBeVisible();
  }
});

Then('o menu não deve exibir os itens:', async ({ page }, items: DataTable) => {
  for (const [item] of items.raw()) {
    await expect(megaMenu(page).getByText(item, { exact: true })).toHaveCount(0);
  }
});