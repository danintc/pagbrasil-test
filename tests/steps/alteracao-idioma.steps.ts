import { createBdd } from 'playwright-bdd';
import { AlteracaoIdiomaPage } from '../pages/alteracao-idioma.page';

const { When, Then } = createBdd();

When('navego até o rodapé e seleciono o idioma {string}', async ({ page }, idioma: string) => {
  const alteracaoIdioma = new AlteracaoIdiomaPage(page);
  await alteracaoIdioma.selecionarIdiomaRodape(idioma);
});

Then('a página deve ser recarregada no idioma inglês', async ({ page }) => {
  const alteracaoIdioma = new AlteracaoIdiomaPage(page);
  await alteracaoIdioma.validarIdiomaIngles();
});

Then('o menu principal deve exibir a opção {string}', async ({ page }, opcaoMenu: string) => {
  const alteracaoIdioma = new AlteracaoIdiomaPage(page);
  await alteracaoIdioma.validarOpcaoMenuHeader(opcaoMenu);
});
