import { createBdd } from 'playwright-bdd';
import type { DataTable } from '@cucumber/cucumber';
import { FaleEspecialistaPage } from '../pages/fale-especialista.page';

const { When, Then } = createBdd();

When('clico no botão {string} no header', async ({ page }, buttonName: string) => {
  const faleEspecialista = new FaleEspecialistaPage(page);
  await faleEspecialista.clicarBotaoHeader(buttonName);
});

When('seleciono a opção {string}', async ({ page }, optionTitle: string) => {
  const faleEspecialista = new FaleEspecialistaPage(page);
  await faleEspecialista.selecionarOpcaoEspecialista(optionTitle);
});

When('marco o checkbox {string}', async ({ page }, checkboxText: string) => {
  const faleEspecialista = new FaleEspecialistaPage(page);
  await faleEspecialista.marcarWhatsAppESubmeter(checkboxText);
});

When('tento enviar o formulário deixando os campos em branco', async ({ page }) => {
  const faleEspecialista = new FaleEspecialistaPage(page);
  await faleEspecialista.submeterFormularioEmBranco();
});

Then('os seguintes campos devem exibir o aviso de {string}:', async ({ page }, aviso: string, dataTable: DataTable) => {
  const faleEspecialista = new FaleEspecialistaPage(page);
  await faleEspecialista.validarAvisosCamposObrigatorios(aviso, dataTable.raw().map(([campo]) => campo));
});
