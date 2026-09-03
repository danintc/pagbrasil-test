import { expect, type Page } from '@playwright/test';

export class NossasSolucoesPage {
  constructor(public page: Page) {}

  readonly megaMenu = this.page.locator('#menu-item-48800');

  async navegar() {
    await this.page.goto('/pt-br/');
  }

  async acessarMenu(menuName: string) {
    // Injeção de CSS para contornar a limitação do Trace Viewer em capturar
    // pseudoclasses (:hover), garantindo que o menu seja renderizado nas evidências
    await this.page.evaluate(() => {
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

    const menuParent = this.page.locator('.menu-item-has-children').filter({ hasText: menuName }).first();
    await menuParent.hover();
    await this.page.waitForTimeout(500);
  }

  async validarItensMenu(itens: string[]) {
    for (const item of itens) {
      await expect(this.megaMenu.getByText(item, { exact: true }).first()).toBeVisible();
    }
  }

  async validarItensNaoExibidos(itens: string[]) {
    for (const item of itens) {
      await expect(this.megaMenu.getByText(item, { exact: true })).toHaveCount(0);
    }
  }
}
