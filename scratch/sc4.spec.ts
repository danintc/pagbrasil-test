import { test, expect } from '@playwright/test';

test('Scenario 4 - Fale com um especialista', async ({ page }) => {
  await page.goto('https://www.pagbrasil.com/pt-br/');
  
  await page.getByRole('link', { name: 'Fale com um especialista', exact: true }).first().click();
  
  // click in the option "Tenho um e-commerce e quero falar com um especialista"
  // Actually, there's "Entrar em contato >" below it
  const contactLink = page.locator('.contact-boxes .box').filter({ hasText: 'Tenho um e-commerce' }).getByRole('link', { name: 'Entrar em contato' });
  await contactLink.click();
  
  // Wait for the form to appear
  // The form has inputs like "your-name", "company", "your-email", "phone"
  const form = page.locator('form').filter({ hasText: 'Nome *' }).first();
  await expect(form).toBeVisible();
  
  // Let's click the checkbox
  // In the DOM, it might be a checkbox input.
  const checkbox = form.locator('input[type="checkbox"][name="autorizacao-checkbox[]"]');
  // It's better to use getByLabel or just click it
  await checkbox.check({ force: true });
  
  // Now we should see the validation messages for the fields
  // Name, Company, E-mail corporativo, Telefone.
  // Wait, does checking the checkbox automatically trigger validation? Or do we need to submit or blur?
  // Usually, in WP Forms, checking it might trigger it or clicking submit does. Let's try to just check if the message appears.
  // Or maybe we click submit.
});
