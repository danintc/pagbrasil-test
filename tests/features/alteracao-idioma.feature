# language: pt
Funcionalidade: Alteração de Idioma
  Como visitante do site PagBrasil
  Quero alterar o idioma no rodapé do site
  Para validar que a página é carregada no idioma selecionado

  @pagbrasil @idioma @funcional
  Cenário: Alterar idioma para o Inglês (En)
    Dado que estou na página inicial da PagBrasil
    Quando navego até o rodapé e seleciono o idioma "En"
    Então a página deve ser recarregada no idioma inglês
    E o menu principal deve exibir a opção "Our solutions"
