import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('navego até o rodapé e seleciono o idioma {string}', async ({ page }, idioma: string) => {
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();

  const btnIdioma = footer.getByRole('link', { name: idioma, exact: true });
  await btnIdioma.click();

  await page.waitForLoadState('domcontentloaded');
});

Then('a página deve ser recarregada no idioma inglês', async ({ page }) => {
  const htmlTag = page.locator('html');
  await expect(htmlTag).toHaveAttribute('lang', 'en-US');
  await expect(page).not.toHaveURL(/.*pt-br.*/);
});

Then('o menu principal deve exibir a opção {string}', async ({ page }, opcaoMenu: string) => {
  const header = page.locator('#masthead');
  await expect(header.getByText(opcaoMenu, { exact: true }).first()).toBeVisible();
});
