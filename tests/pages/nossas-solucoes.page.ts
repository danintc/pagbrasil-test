import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object que encapsula a navegação inicial e a validação
 * das opções disponíveis no mega menu "Nossas Soluções".
 */
export class NossasSolucoesPage {
  readonly page: Page;
  readonly megaMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.megaMenu = page
      .locator('.main-navigation .menu-item-has-children')
      .filter({ has: page.getByRole('link', { name: /nossas soluções/i }) })
      .first();
  }

  /**
   * Navega para a página inicial da PagBrasil em português (/pt-br/).
   * Utiliza a resolução relativa baseada no baseURL configurado.
   */
  async navegar() {
    await this.page.goto('/pt-br/');
  }

  /**
   * Realiza hover sobre o menu superior para expandir os subitens.
   * Aplica uma injeção de CSS prévia para contornar a limitação do Trace Viewer
   * na persistência de pseudoclasses (:hover), garantindo evidências visuais perfeitas.
   * @param menuName Nome do menu pai a ser acessado (ex: "Nossas Soluções")
   */
  async acessarMenu(menuName: string) {
    const menuParent = this.page.locator('.main-navigation .menu-item-has-children').filter({ hasText: menuName }).first();
    await menuParent.hover();

    await menuParent.evaluate(el => {
      const ul = el.querySelector('ul');
      if (ul) {
        ul.style.display = 'block';
        ul.style.opacity = '1';
        ul.style.visibility = 'visible';
        ul.style.left = '0';
        ul.style.position = 'relative';
      }
    });

    await this.page.waitForTimeout(500);
  }

  /**
   * Valida se todos os itens esperados estão visíveis dentro do mega menu.
   * @param itens Lista de nomes dos produtos/soluções que devem estar visíveis
   */
  async validarItensMenu(itens: string[]) {
    for (const item of itens) {
      await expect(this.megaMenu.getByRole('link', { name: item, exact: true }).first()).toBeVisible();
    }
  }

  /**
   * Valida que os itens descontinuados NÃO estão presentes no menu.
   * @param itens Lista de nomes dos produtos que não devem existir no menu
   */
  async validarItensNaoExibidos(itens: string[]) {
    for (const item of itens) {
      await expect(this.megaMenu.getByRole('link', { name: item, exact: true })).toHaveCount(0);
    }
  }
}
