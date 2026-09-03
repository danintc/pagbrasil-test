import { expect, type Page } from '@playwright/test';

export class AlteracaoIdiomaPage {
  constructor(public page: Page) {}

  readonly footer = this.page.locator('footer');
  readonly masthead = this.page.locator('#masthead');

  async selecionarIdiomaRodape(idioma: string) {
    await this.footer.scrollIntoViewIfNeeded();
    const btnIdioma = this.footer.getByRole('link', { name: idioma, exact: true });
    await btnIdioma.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async validarIdiomaIngles() {
    const htmlTag = this.page.locator('html');
    await expect(htmlTag).toHaveAttribute('lang', 'en-US');
    await expect(this.page).not.toHaveURL(/.*pt-br.*/);
  }

  async validarOpcaoMenuHeader(opcaoMenu: string) {
    await expect(this.masthead.getByText(opcaoMenu, { exact: true }).first()).toBeVisible();
  }
}
