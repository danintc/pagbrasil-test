import { expect, type Page } from '@playwright/test';

export class QuemSomosPage {
  constructor(public page: Page) {}

  readonly header = this.page.locator('header');
  readonly footer = this.page.locator('footer');

  async navegarPeloMenu(menuName: string, subMenuName: string) {
    await this.page.evaluate(() => {
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

    const menuParent = this.page.locator('.menu-item-has-children').filter({ hasText: menuName }).first();
    await menuParent.hover();

    const subMenu = menuParent.locator('ul').getByRole('link', { name: subMenuName, exact: true });
    await subMenu.waitFor({ state: 'visible', timeout: 5000 });

    await subMenu.dispatchEvent('click');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async validarIconeBusca() {
    const searchIcon = this.page.locator('header a[href="#popup-search"]:visible').first();
    await expect(searchIcon).toBeVisible();
  }

  async validarLinhaDoTempo() {
    const timeline = this.page.locator('.block-quem-somos-timeline, .timeline').first();
    await timeline.scrollIntoViewIfNeeded();
    await expect(timeline).toBeVisible();
  }

  async validarSeloGptw() {
    await this.footer.scrollIntoViewIfNeeded();
    const gptwBadge = this.footer
      .locator('a[href*="nossas-certificacoes"]')
      .filter({ has: this.page.locator('svg, img') })
      .first();
    await expect(gptwBadge).toBeVisible();
  }

  async validarCidadesRodape(cidades: string[]) {
    await this.footer.scrollIntoViewIfNeeded();
    for (const city of cidades) {
      await expect(this.footer.getByText(city, { exact: false }).first()).toBeVisible();
    }
  }
}
