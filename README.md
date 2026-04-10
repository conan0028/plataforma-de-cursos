# Plataforma de Cursos Online - Vanilla JS SPA

## Visão Geral e Escopo do Projeto

Este projeto consiste no desenvolvimento integral da camada frontend de uma Plataforma de Cursos Online. O sistema foi concebido sob restrições técnicas rigorosas, com o impedimento total do uso de frameworks JavaScript reativos (como React, Angular ou Vue). Em seu lugar, a arquitetura foi fundamentada exclusivamente em JavaScript puro (Vanilla JS - ECMAScript 6+), HTML5 semântico e Bootstrap 5 para a camada de apresentação.

A aplicação adota a abordagem de Single Page Application (SPA), garantindo navegação assíncrona e fluida por meio de manipulação controlada do Document Object Model (DOM). Como o escopo restringe a integração com uma API backend consolidada no momento, o projeto abstrai a camada de rede empregando o armazenamento persistente em tempo real no navegador do cliente (Local Storage), mantendo entidades orientadas a objeto perfeitamente consistentes.

## Instruções de Execução

Dado seu caráter estritamente mantido no Client-side, o sistema não requer a instalação de um runtime ou servidor pesado (como Node.js, Nginx ou Apache). A execução pode ser procedida das seguintes formas:

1. Execução de Arquivo Nativa: Vá até o diretório raiz do projeto e dê um duplo-clique sobre o arquivo `index.html`. Ele será carregado no seu navegador padrão com todas as dependências sendo resolvidas via relações relativas ou CDN.
2. Execução via Servidor Local de Desenvolvimento (Recomendado): Em editores como Visual Studio Code, instale a extensão "Live Server". Abra o arquivo `index.html`, clique com o botão direito e selecione "Open with Live Server". Isso habilitará um servidor HTTP leve na porta padrão (5500), garantindo avaliação coesa de módulos ES6, evitando diretrizes restritivas de políticas CORS do protocolo local `file://`.

O sistema auto-inicializa uma população substancial de entidades de domínio, não dependendo da inserção manual pelo operador em seu primeiro carregamento.

## Arquitetura do Código

A base de código foi fracionada sob responsabilidades modulares e únicas, propiciando clean code e facilidade de manutenção:

- `index.html`: Arquivo raiz da apresentação. Mantém a casca de toda a interface, contendo a navegação central (Navbar) e delimitando blocos estruturais encapsulados pela classe específica de view, os quais alternam seu estado visual em transições do usuário.
- `css/style.css`: Controla todas as especificidades relativas à estética que fogem às determinações padrão do Bootstrap. Encarrega-se das constantes de cores do Dark Mode, transições (hover effects) e comportamentos visuais de micro-interações de forma global.
- `js/models.js`: Centraliza a declaração obrigatória de todas as classes das entidades arquitetadas (Usuario, Curso, Matricula, Pagamento). Assegura que toda representação possua construtores coesos, geração automática de Primary Keys seguras (UUIDs) e provedores de desserialização (`fromJSON`) para preservar a metodologia de polimorfismo ao reconstruir instâncias serializadas na camada temporária de banco.
- `js/data.js`: Abstração do repositório de persistência. Contém o núcleo do Database Engine da aplicação local. Este orquestrador intercepta requisições dos controladores da UI e as transcreve no `localStorage` por meio de mecanismos serializados, contendo toda árvore complexa de Foreign Keys de relacionamento. É responsável pela criação da massa de dados primários via a função lógica `initMockData()`.
- `js/ui.js`: Biblioteca de utilitários visuais de negócio. Propõe métodos reutilizáveis globalmente, delegando a responsabilidade automática de instanciar componentes complexos como a transformação de modais e componentes flutuantes (Toasts) via o motor vanilla do próprio Bootstrap JS.
- `js/app.js`: Cérebro da aplicação, consolida todas as partes. Orquestra a metralhadora de mapeamento Single Page (MapsTo), e o provedor nativo geral da captura de eventos no DOM através do padrão arquitetural universal de `Event Delegation`, minimizando assim fugas de memória no contexto do cliente. Captura o envio de formulários com avaliação sistêmica rigorosa.
- ---
