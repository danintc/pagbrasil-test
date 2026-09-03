# language: pt
Funcionalidade: Quem Somos
  Como um usuário do site PagBrasil
  Quero navegar até a página "Quem Somos"
  Para validar os elementos visuais da empresa e do site

  @pagbrasil @quem-somos @funcional
  Cenário: Validar elementos da página Quem Somos
    Dado que estou na página inicial da PagBrasil
    Quando navego pelo menu "Sobre" até "Quem somos"
    Então no header o ícone de busca deve ser exibido
    E a seção da linha do tempo da PagBrasil deve estar presente
    E no rodapé o ícone do GPTW deve ser exibido
    E no rodapé as seguintes cidades devem estar visíveis:
      | Porto Alegre |
      | São Paulo    |
      | Barcelona    |
      | Singapura    |
