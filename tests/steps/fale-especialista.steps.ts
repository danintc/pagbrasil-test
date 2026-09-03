import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import type { DataTable } from '@cucumber/cucumber';

const { When, Then } = createBdd();

When('clico no botão {string} no header', async ({ page }, buttonName: string) => {
  const btn = page.locator('header').getByRole('link', { name: buttonName, exact: true }).first();
  await btn.click();
  await page.waitForLoadState('domcontentloaded');
});

When('seleciono a opção {string}', async ({ page }, optionTitle: string) => {
  // Movimento de mouse e scroll simulados para disparar o lazy load de JS (NitroPack) nativamente
  await page.mouse.move(100, 100);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1500);

  const link = page.locator('a').filter({ hasText: 'Entrar em contato' }).first();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  
  // Aguarda a exibição nativa do formulário injetado pelo DOM
  const form = page.locator('.fale-com-um-especialistaem-pagamentos-parae-commerce form').first();
  await form.waitFor({ state: 'visible', timeout: 8000 });
});

When('marco o checkbox {string}', async ({ page }, checkboxText: string) => {
  const form = page.locator('.fale-com-um-especialistaem-pagamentos-parae-commerce form').first();
  await form.scrollIntoViewIfNeeded();
  
  const cb = form.locator('input[type="checkbox"][name="autorizacao-checkbox[]"]').first();
  await cb.check({ force: true });
  
  const submitBtn = form.locator('input[type="submit"]').first();
  
  // Intercepta e valida a requisição AJAX do Contact Form 7
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('feedback') && response.request().method() === 'POST'
  );
  
  await submitBtn.click({ force: true });
  
  // Requisito de Backend: Validação do HTTP Status Code e Response Payload
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.status).toBe('validation_failed');
});

When('tento enviar o formulário deixando os campos em branco', async ({ page }) => {
  const form = page.locator('.fale-com-um-especialistaem-pagamentos-parae-commerce form').first();
  await form.scrollIntoViewIfNeeded();
  
  const submitBtn = form.locator('input[type="submit"]').first();
  
  // Intercepta e valida a requisição AJAX do Contact Form 7
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('feedback') && response.request().method() === 'POST'
  );
  
  await submitBtn.click({ force: true });
  
  // Requisito de Backend: Validação do HTTP Status Code e Response Payload
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.status).toBe('validation_failed');
});

Then('os seguintes campos devem exibir o aviso de {string}:', async ({ page }, aviso: string, dataTable: DataTable) => {
  const form = page.locator('.fale-com-um-especialistaem-pagamentos-parae-commerce form').first();
  
  for (const [campo] of dataTable.raw()) {
    const fieldWrapper = form.locator('.form-group').filter({ hasText: campo }).first();
    await expect(fieldWrapper.getByText(aviso)).toBeAttached();
  }
});
