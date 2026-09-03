import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object que encapsula a navegação até a página "Quem Somos"
 * e a validação de seus componentes institucionais (linha do tempo, selos, cidades).
 */
export class QuemSomosPage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.footer = page.locator('footer');
  }

  /**
   * Realiza a navegação encadeada: abre o menu pai via hover e clica no submenu.
   * Injeta CSS no submenu para garantir renderização contínua nos relatórios do Trace Viewer.
   * @param menuName Nome do menu principal (ex: "Sobre")
   * @param subMenuName Nome do item interno a ser clicado (ex: "Quem somos")
   */
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

  /**
   * Valida a visibilidade do ícone de busca no cabeçalho.
   */
  async validarIconeBusca() {
    const searchIcon = this.page.locator('header a[href="#popup-search"]:visible').first();
    await expect(searchIcon).toBeVisible();
  }

  /**
   * Garante o disparo de lazy loading por scroll e valida a exibição da linha do tempo institucional.
   */
  async validarLinhaDoTempo() {
    const timeline = this.page.locator('.block-quem-somos-timeline, .timeline').first();
    await timeline.scrollIntoViewIfNeeded();
    await expect(timeline).toBeVisible();
  }

  /**
   * Rola até o rodapé e valida a presença do selo GPTW (Great Place to Work).
   */
  async validarSeloGptw() {
    await this.footer.scrollIntoViewIfNeeded();
    const gptwBadge = this.footer
      .locator('a[href*="nossas-certificacoes"]')
      .filter({ has: this.page.locator('svg, img') })
      .first();
    await expect(gptwBadge).toBeVisible();
  }

  /**
   * Rola até o rodapé e verifica a visibilidade de cada cidade informada.
   * @param cidades Lista com os nomes das filiais/escritórios
   */
  async validarCidadesRodape(cidades: string[]) {
    await this.footer.scrollIntoViewIfNeeded();
    for (const city of cidades) {
      await expect(this.footer.getByText(city, { exact: false }).first()).toBeVisible();
    }
  }
}
