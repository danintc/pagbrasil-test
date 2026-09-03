# language: pt

@pagbrasil @nossas-solucoes
Funcionalidade: Navegação no menu Nossas Soluções
  Como visitante do site PagBrasil
  Quero consultar as soluções disponíveis no menu principal
  Para confirmar que a navegação apresenta apenas as opções válidas

  @funcional
  Cenário: Exibir as soluções esperadas e ocultar opções descontinuadas
    Dado que estou na página inicial da PagBrasil
    Quando acesso o menu "Nossas Soluções"
    Então o menu deve exibir os itens:
      | Gateway |
      | Pix Automático |
      | PagBrasil.JS |
      | PagBrasil Checkout |
    E o menu não deve exibir os itens:
      | PEC Flash |
      | Transferência Bancária |
