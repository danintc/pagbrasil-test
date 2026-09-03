import type { DataTable } from '@cucumber/cucumber';
import { createBdd } from 'playwright-bdd';
import { QuemSomosPage } from '../pages/quem-somos.page';

const { When, Then } = createBdd();

When('navego pelo menu {string} até {string}', async ({ page }, menuName: string, subMenuName: string) => {
  const quemSomos = new QuemSomosPage(page);
  await quemSomos.navegarPeloMenu(menuName, subMenuName);
});

Then('no header o ícone de busca deve ser exibido', async ({ page }) => {
  const quemSomos = new QuemSomosPage(page);
  await quemSomos.validarIconeBusca();
});

Then('a seção da linha do tempo da PagBrasil deve estar presente', async ({ page }) => {
  const quemSomos = new QuemSomosPage(page);
  await quemSomos.validarLinhaDoTempo();
});

Then('no rodapé o ícone do GPTW deve ser exibido', async ({ page }) => {
  const quemSomos = new QuemSomosPage(page);
  await quemSomos.validarSeloGptw();
});

Then('no rodapé as seguintes cidades devem estar visíveis:', async ({ page }, dataTable: DataTable) => {
  const quemSomos = new QuemSomosPage(page);
  await quemSomos.validarCidadesRodape(dataTable.raw().map(([city]) => city));
});