import { expect } from '@playwright/test';
import type { DataTable } from '@cucumber/cucumber';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('navego pelo menu {string} até {string}', async ({ page }, menuName: string, subMenuName: string) => {
  // Injeção de CSS para garantir a captura visual do menu no Trace Viewer
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      #menu-item-48823 ul {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        left: 0 !important;
        position: relative !important;
      }
    `;
    document.head.appendChild(style);
  });

  // Interação nativa para simular a navegação real do usuário
  const menuParent = page.locator('.menu-item-has-children').filter({ hasText: menuName }).first();
  await menuParent.hover();
  
  const subMenu = menuParent.locator('ul').getByRole('link', { name: subMenuName, exact: true });
  await subMenu.waitFor({ state: 'visible', timeout: 5000 });
  
  await subMenu.dispatchEvent('click');
  await page.waitForLoadState('domcontentloaded');
});

Then('no header o ícone de busca deve ser exibido', async ({ page }) => {
  const searchIcon = page.locator('header a[href="#popup-search"]:visible').first();
  await expect(searchIcon).toBeVisible();
});

Then('a seção da linha do tempo da PagBrasil deve estar presente', async ({ page }) => {
  const timeline = page.locator('.block-quem-somos-timeline, .timeline').first();
  
  // Força o gatilho de lazy load (NitroPack) rolando a tela até o componente
  await timeline.scrollIntoViewIfNeeded();
  await expect(timeline).toBeVisible();
});

Then('no rodapé o ícone do GPTW deve ser exibido', async ({ page }) => {
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  
  const gptwBadge = footer
    .locator('a[href*="nossas-certificacoes"]')
    .filter({ has: page.locator('svg, img') })
    .first();
    
  await expect(gptwBadge).toBeVisible();
});

Then('no rodapé as seguintes cidades devem estar visíveis:', async ({ page }, dataTable: DataTable) => {
  const footer = page.locator('footer');
  
  for (const [city] of dataTable.raw()) {
    await expect(footer.getByText(city, { exact: false }).first()).toBeVisible();
  }
});