import { expect, type Page } from '@playwright/test';

export class FaleEspecialistaPage {
  constructor(public page: Page) {}

  readonly header = this.page.locator('header');
  readonly form = this.page.locator('.fale-com-um-especialistaem-pagamentos-parae-commerce form').first();

  async clicarBotaoHeader(buttonName: string) {
    const btn = this.header.getByRole('link', { name: buttonName, exact: true }).first();
    await btn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selecionarOpcaoEspecialista(optionTitle: string) {
    // Movimento de mouse e scroll para disparar lazy loading nativamente (NitroPack)
    await this.page.mouse.move(100, 100);
    await this.page.mouse.wheel(0, 500);
    await this.page.waitForTimeout(1500);

    const link = this.page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
    await link.scrollIntoViewIfNeeded();
    await link.click();

    await this.form.waitFor({ state: 'visible', timeout: 8000 });
  }

  private async submeterFormularioEValidarAjax() {
    const submitBtn = this.form.locator('input[type="submit"]').first();

    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('feedback') && response.request().method() === 'POST'
    );

    await submitBtn.click({ force: true });

    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('validation_failed');
  }

  async marcarWhatsAppESubmeter(checkboxText: string) {
    await this.form.scrollIntoViewIfNeeded();
    const cb = this.form.locator('input[type="checkbox"][name="autorizacao-checkbox[]"]').first();
    await cb.check({ force: true });

    await this.submeterFormularioEValidarAjax();
  }

  async submeterFormularioEmBranco() {
    await this.form.scrollIntoViewIfNeeded();
    await this.submeterFormularioEValidarAjax();
  }

  async validarAvisosCamposObrigatorios(aviso: string, campos: string[]) {
    for (const campo of campos) {
      const fieldWrapper = this.form.locator('.form-group').filter({ hasText: campo }).first();
      await expect(fieldWrapper.getByText(aviso)).toBeAttached();
    }
  }
}
