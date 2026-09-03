# language: pt
Funcionalidade: Fale com um especialista
  Como um usuário que tem um e-commerce
  Quero falar com um especialista
  Para garantir que os campos obrigatórios sejam validados

  @pagbrasil @fale-especialista @funcional
  Cenário: Validar campos obrigatórios ao marcar comunicações por WhatsApp
    Dado que estou na página inicial da PagBrasil
    Quando clico no botão "Fale com um especialista" no header
    E seleciono a opção "Tenho um e-commerce"
    E marco o checkbox "Deseja receber comunicações por WhatsApp?"
    Então os seguintes campos devem exibir o aviso de "Campo obrigatório":
      | Nome               |
      | Empresa            |
      | E-mail corporativo |
      | Telefone           |

  @pagbrasil @fale-especialista @funcional
  Cenário: Validar campos obrigatórios sem marcar comunicações por WhatsApp
    Dado que estou na página inicial da PagBrasil
    Quando clico no botão "Fale com um especialista" no header
    E seleciono a opção "Tenho um e-commerce"
    E tento enviar o formulário deixando os campos em branco
    Então os seguintes campos devem exibir o aviso de "Campo obrigatório":
      | Nome               |
      | Empresa            |
      | E-mail corporativo |
      | Telefone           |
