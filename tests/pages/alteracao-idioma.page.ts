import { expect, type Page } from '@playwright/test';

/**
 * Page Object que encapsula as interações e validações do fluxo de
 * alteração de idioma no rodapé do site PagBrasil.
 */
export class AlteracaoIdiomaPage {
  constructor(public page: Page) {}

  readonly footer = this.page.locator('footer');
  readonly masthead = this.page.locator('#masthead');

  /**
   * Rola até o rodapé e clica no botão com o idioma desejado (ex: "En", "Pt").
   * @param idioma Texto exato do link do idioma
   */
  async selecionarIdiomaRodape(idioma: string) {
    await this.footer.scrollIntoViewIfNeeded();
    const btnIdioma = this.footer.getByRole('link', { name: idioma, exact: true });
    await btnIdioma.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Valida se a página foi recarregada em inglês:
   * 1. Verifica se a tag <html lang="en-US"> está presente.
   * 2. Garante que a URL não contém mais o fragmento "pt-br".
   */
  async validarIdiomaIngles() {
    const htmlTag = this.page.locator('html');
    await expect(htmlTag).toHaveAttribute('lang', 'en-US');
    await expect(this.page).not.toHaveURL(/.*pt-br.*/);
  }

  /**
   * Valida se o menu principal no header exibe o texto da opção no novo idioma.
   * @param opcaoMenu Nome esperado do menu (ex: "Our solutions")
   */
  async validarOpcaoMenuHeader(opcaoMenu: string) {
    await expect(this.masthead.getByText(opcaoMenu, { exact: true }).first()).toBeVisible();
  }
}
