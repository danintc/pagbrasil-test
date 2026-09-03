import { expect, type Page } from '@playwright/test';

/**
 * Page Object que encapsula o fluxo de contato com especialista,
 * gatilhos de lazy loading do NitroPack, submissão de formulários
 * e validação de requisições AJAX do Contact Form 7.
 */
export class FaleEspecialistaPage {
  constructor(public page: Page) {}

  readonly header = this.page.locator('header');
  readonly form = this.page.locator('.fale-com-um-especialistaem-pagamentos-parae-commerce form').first();

  /**
   * Clica no link do cabeçalho que leva à página ou seção de contato.
   * @param buttonName Texto do botão/link no header (ex: "Fale com um especialista")
   */
  async clicarBotaoHeader(buttonName: string) {
    const btn = this.header.getByRole('link', { name: buttonName, exact: true }).first();
    await btn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Dispara o lazy loading do NitroPack através de movimentos simulados de mouse e scroll,
   * localiza a opção desejada, clica no botão "Entrar em contato" e aguarda o formulário carregar no DOM.
   * @param optionTitle Título da opção/card (ex: "Tenho um e-commerce")
   */
  async selecionarOpcaoEspecialista(optionTitle: string) {
    // Simula interação humana contínua para "acordar" os event listeners atrasados pelo NitroPack
    await this.page.mouse.move(100, 100);
    await this.page.mouse.wheel(0, 500);
    await this.page.waitForTimeout(1500);

    const link = this.page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
    await link.scrollIntoViewIfNeeded();
    await link.click();

    await this.form.waitFor({ state: 'visible', timeout: 8000 });
  }

  /**
   * Método auxiliar privado para submeter o formulário e validar a comunicação com o backend:
   * 1. Intercepta a requisição AJAX POST do Contact Form 7 direcionada ao endpoint '/feedback'.
   * 2. Valida se o status code retornado pela API é 200 (OK).
   * 3. Valida se o payload retornado contém 'status: validation_failed'.
   */
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

  /**
   * Rola até o formulário, marca o checkbox de consentimento do WhatsApp e envia o formulário.
   * @param checkboxText Texto descritivo do checkbox (ex: "Deseja receber comunicações por WhatsApp?")
   */
  async marcarWhatsAppESubmeter(checkboxText: string) {
    await this.form.scrollIntoViewIfNeeded();
    const cb = this.form.locator('input[type="checkbox"][name="autorizacao-checkbox[]"]').first();
    await cb.check({ force: true });

    await this.submeterFormularioEValidarAjax();
  }

  /**
   * Rola até o formulário e tenta submetê-lo com todos os campos em branco.
   */
  async submeterFormularioEmBranco() {
    await this.form.scrollIntoViewIfNeeded();
    await this.submeterFormularioEValidarAjax();
  }

  /**
   * Valida se cada campo obrigatório informado exibe a respectiva mensagem de alerta de validação.
   * @param aviso Texto da mensagem de erro esperada (ex: "Campo obrigatório")
   * @param campos Lista com os rótulos dos campos que devem conter a mensagem
   */
  async validarAvisosCamposObrigatorios(aviso: string, campos: string[]) {
    for (const campo of campos) {
      const fieldWrapper = this.form.locator('.form-group').filter({ hasText: campo }).first();
      await expect(fieldWrapper.getByText(aviso)).toBeAttached();
    }
  }
}
