import type { DataTable } from '@cucumber/cucumber';
import { createBdd } from 'playwright-bdd';
import { NossasSolucoesPage } from '../pages/nossas-solucoes.page';

const { Given, When, Then } = createBdd();

Given('que estou na página inicial da PagBrasil', async ({ page }) => {
  const nossasSolucoes = new NossasSolucoesPage(page);
  await nossasSolucoes.navegar();
});

When('acesso o menu {string}', async ({ page }, menuName: string) => {
  const nossasSolucoes = new NossasSolucoesPage(page);
  await nossasSolucoes.acessarMenu(menuName);
});

Then('o menu deve exibir os itens:', async ({ page }, items: DataTable) => {
  const nossasSolucoes = new NossasSolucoesPage(page);
  await nossasSolucoes.validarItensMenu(items.raw().map(([item]) => item));
});

Then('o menu não deve exibir os itens:', async ({ page }, items: DataTable) => {
  const nossasSolucoes = new NossasSolucoesPage(page);
  await nossasSolucoes.validarItensNaoExibidos(items.raw().map(([item]) => item));
});