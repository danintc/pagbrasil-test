# Automação de Testes - PagBrasil (Teste Técnico)

Este repositório contém o projeto de automação E2E (End-to-End) desenvolvido como parte do teste técnico para a posição de **QA Pleno**. 

O projeto tem o objetivo de validar funcionalidades críticas do site oficial da [PagBrasil](https://www.pagbrasil.com/), garantindo a integridade da navegação, validação de formulários, internacionalização e a presença de componentes visuais chave.

---

## 🛠️ Tecnologias Utilizadas

- **[Playwright](https://playwright.dev/):** Framework principal para automação de interações no navegador (rápido, resiliente e com suporte a múltiplos motores).
- **[Cucumber (playwright-bdd)](https://github.com/vitalets/playwright-bdd):** Integração do BDD (Behavior Driven Development) com o ecossistema do Playwright, permitindo a escrita de testes legíveis focados em regras de negócio no formato Gherkin.
- **[TypeScript](https://www.typescriptlang.org/):** Linguagem utilizada para garantir tipagem estática, escalabilidade e manutenibilidade dos *Step Definitions*.
- **[Node.js](https://nodejs.org/):** Ambiente de execução.

---

## 🏗️ Estrutura do Projeto

```text
pagbrasil-test/
├── tests/
│   ├── features/              # Arquivos .feature escritos em Gherkin (Cenários de Teste)
│   │   ├── alteracao-idioma.feature
│   │   ├── fale-especialista.feature
│   │   ├── nossas-solucoes.feature
│   │   └── quem-somos.feature
│   └── steps/                 # Implementação dos passos (Step Definitions) em TypeScript
│       ├── alteracao-idioma.steps.ts
│       ├── fale-especialista.steps.ts
│       ├── nossas-solucoes.steps.ts
│       └── quem-somos.steps.ts
├── playwright.config.ts       # Configurações globais do Playwright (workers, navegadores, baseURL, etc.)
└── package.json               # Dependências do projeto e scripts npm
```

---

## 🚀 Como Instalar e Executar

### 1. Pré-requisitos
- Node.js instalado (v18 ou superior recomendado).
- Git.

### 2. Instalação
Clone este repositório e instale as dependências:
```bash
# Instala os pacotes mapeados no package.json
npm install

# Baixa os binários dos navegadores do Playwright (Chromium, Firefox, WebKit)
npx playwright install
```

### 3. Execução dos Testes
O projeto utiliza o pacote `playwright-bdd`, portanto é necessário gerar os arquivos de teste transpilados do Cucumber antes da execução:

```bash
# 1. Gera os arquivos de ponte entre Gherkin e Playwright
npx bddgen

# 2. Executa a suíte de testes (com interface gráfica)
npx playwright test --ui

# OU Executa em background (headless)
npx playwright test
```

> **Dica:** Caso modifique um arquivo `.feature` ou `.steps.ts`, lembre-se sempre de rodar o `npx bddgen` novamente antes de rodar o `test`.

### 4. Relatórios e Evidências de Falha
O projeto está configurado nativamente com o **HTML Reporter** do Playwright. 
Caso um teste **falhe**, o framework automaticamente:
1. Tira um **Screenshot** do exato momento da falha.
2. Salva o **Vídeo** da execução do cenário.
3. Grava o **Trace Viewer** (Rastreio completo de DOM, Network e Console).

Tudo isso é anexado automaticamente ao relatório final. Para visualizar o relatório das evidências após a execução, rode:
```bash
npx playwright show-report
```

### 5. Integração Contínua (CI/CD - GitHub Actions)
Como bônus, este projeto já está configurado para rodar na nuvem em qualquer repositório do **GitHub**.
Na pasta `.github/workflows/playwright.yml`, há uma pipeline (Actions) configurada para:
- Executar todos os cenários (Chromium, Firefox, WebKit) a cada *Push* ou *Pull Request* para a branch `main` ou `master`.
- Compilar o BDD dinamicamente via `npx bddgen` no runner (Ubuntu).
- Em caso de falha transitória na nuvem, o Playwright aplicará o *Retry* automático (2 tentativas).
- Gerar o HTML Report contendo Evidências de Falhas (Screenshots, Videos e Traces) e anexá-lo como um **Artifact** diretamente na aba "Actions" para download.

---

## 🧪 Cenários Cobertos

O teste abrange as 4 jornadas a seguir:

1. **Alteração de Idioma:** Valida se ao interagir com o rodapé e trocar o idioma para "En", a página recarrega corretamente em inglês e o menu reflete essa alteração (ex: exibindo "Our solutions").
2. **Menu "Nossas Soluções":** Assegura que o submenu exiba os produtos ativos (ex: *Pix Automático, PagBrasil Checkout*) e garanta a ausência de produtos descontinuados (ex: *PEC Flash, Transferência Bancária*).
3. **Página "Quem Somos":** Valida elementos fundamentais de presença da marca, como o Ícone de Busca no header, a renderização da Linha do Tempo da empresa, o selo GPTW (Great Place to Work) e a presença das filiais da empresa no rodapé.
4. **Fale com um Especialista (Formulários):** Valida a jornada de contato comercial, lidando com seleção de popups, navegação, preenchimento de checkboxes ocultos e garantindo que as validações de campos obrigatórios sejam acionadas corretamente pelo *Contact Form 7*.

---

## 🧠 Destaques Técnicos e Visão de Qualidade (QA)

Durante a automação, apliquei estratégias avançadas para garantir a **resiliência (anti-flakiness)** da suíte frente a algumas características técnicas do ambiente de produção da PagBrasil:

### 🛠️ Lidando com Lazy-Loading (NitroPack) e Limitações Visuais
O site utiliza o plugin de otimização *NitroPack*, que adia massivamente a execução do JavaScript até haver interação humana real (movimento contínuo de mouse ou scroll profundo). 
Isso frequentemente quebra automações (o Playwright é tão rápido que clica antes dos eventos JS serem ancorados). Para contornar, desenvolvemos as seguintes estratégias:
- **Acionamento Nativo do NitroPack:** Em vez de usar CSS para forçar a exibição de modais, simulamos movimentos reais de mouse (`page.mouse.move`) e scroll no viewport para "acordar" os *event listeners* atrasados antes de clicar em botões como o "Entrar em contato".
- **Gatilho de Scroll:** Utilizamos comandos como `scrollIntoViewIfNeeded()` para forçar o carregamento de componentes sob demanda no footer e body (ex: Linha do Tempo e Ícone GPTW).
- **Evidências Visuais (Trace Viewer):** Ferramentas como o Trace Viewer perdem o estado de pseudoclasses CSS (como `:hover`) ou são sobrepostas por banners fixos (como a Política de Cookies). Portanto, aplicamos injeções pontuais de CSS (`page.evaluate`) puramente com o propósito de garantir a legibilidade impecável das capturas fotográficas para a auditoria do teste.
- **Interações Realistas:** Substituímos disparos de DOM puramente JS por comandos nativos do Playwright (`.click({ force: true })` e `.check({ force: true })`) para garantir que os *Highlights (bolinhas vermelhas indicadoras de clique)* sejam gravados perfeitamente no Trace Viewer, validando a jornada visual da forma como o usuário experimentaria.

### 🔌 Testes de Backend e Status Code (Integração E2E + API)
Para cobrir o requisito técnico de testes de Backend e validação de Status Code de forma robusta e integrada, o projeto foi arquitetado para escutar o tráfego de rede nativamente:
- **Interceptação de API REST:** No **Cenário 4**, quando o formulário é submetido, o Playwright intercepta (via `waitForResponse`) a requisição POST (AJAX) disparada ao backend do *Contact Form 7*.
- **Validação E2E:** O teste não apenas checa as mensagens visuais no DOM, mas também valida o *HTTP Status Code (200)* retornado pela requisição de *feedback* e examina o JSON do Payload, assegurando que o atributo `status: "validation_failed"` seja devolvido pela API do backend em caso de campos vazios.

### 🧩 Validações BDD, Refinamento e Independência de Regras (O "Bug" do Cenário 4)
O requisito do Cenário 4 orientava a validação das mensagens de erro sob a premissa de que a marcação do checkbox ("Deseja receber comunicações por WhatsApp?") engatilhasse as obrigatoriedades dos campos.

**Observação de Qualidade:** Em análise técnica da plataforma, foi constatado que as validações de campos nativos (*Contact Form 7*) são acionadas exclusivamente pela ação de submissão (botão *Continuar*), e **independem** do checkbox de consentimento.

**Decisão e Abordagem:**
- O cenário original foi implementado exatamente como solicitado, garantindo o atendimento ao requisito estabelecido no teste e provando a viabilidade técnica da automação (fluxo feliz).
- **Proatividade (3 Amigos):** Foi adicionado à suite um *segundo cenário explícito* (`Validar campos obrigatórios sem marcar comunicações por WhatsApp`) que testa o mesmo envio em branco **sem** a marcação do checkbox. Esse teste extra comprova a independência da regra de negócio e sugere de forma propositiva um potencial refinamento no Critério de Aceite da estória original.
