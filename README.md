# Plataforma de Cursos Online - Vanilla JS SPA

## Visão Geral e Escopo do Projeto

Este projeto consiste no desenvolvimento integral da camada frontend de uma Plataforma de Cursos Online. O sistema foi concebido sob restrições técnicas rigorosas, com o impedimento total do uso de frameworks JavaScript reativos (como React, Angular ou Vue). Em seu lugar, a arquitetura foi fundamentada exclusivamente em JavaScript puro (Vanilla JS - ECMAScript 6+), HTML5 semântico e Bootstrap 5 para a camada de apresentação.

A aplicacao adota a abordagem de Single Page Application (SPA), garantindo navegacao assincrona e fluida por meio de manipulacao controlada do Document Object Model (DOM). Como o escopo restringe a integracao com uma API backend consolidada no momento, o projeto abstrai a camada de rede empregando o armazenamento persistente em tempo real no navegador do cliente (Local Storage), mantendo entidades orientadas a objeto perfeitamente consistentes.

## Instrucoes de Execucao

Dado seu carater estritamente mantido no Client-side, o sistema nao requer a instalacao de um runtime ou servidor pesado (como Node.js, Nginx ou Apache). A execucao pode ser procedida das seguintes formas:

1. Execucao de Arquivo Nativa: Va ate o diretorio raiz do projeto e de um duplo-clique sobre o arquivo `index.html`. Ele sera carregado no seu navegador padrao com todas as dependencias sendo resolvidas via relacoes relativas ou CDN.
2. Execucao via Servidor Local de Desenvolvimento (Recomendado): Em editores como Visual Studio Code, instale a extensao "Live Server". Abra o arquivo `index.html`, clique com o botao direito e selecione "Open with Live Server". Isso habilitara um servidor HTTP leve na porta padrao (5500), garantindo avaliacao coesa de modulos ES6, evitando diretrizes restritivas de politicas CORS do protocolo local `file://`.

O sistema auto-inicializa uma populacao substancial de entidades de dominio, nao dependendo da insercao manual pelo operador em seu primeiro carregamento.

## Arquitetura do Codigo

A base de codigo foi fracionada sob responsabilidades modulares e unicas, propiciando clean code e facilidade de manutencao:

- `index.html`: Arquivo raiz da apresentacao. Mantem a casca de toda a interface, contendo a navegacao central (Navbar) e delimitando blocos estruturais encapsulados pela classe especifica de view, os quais alternam seu estado visual em transicoes do usuario.
- `css/style.css`: Controla todas as especificidades relativas a estetica que fogem as determinacoes padrao do Bootstrap. Encarrega-se das constantes de cores do Dark Mode, transicoes (hover effects) e comportamentos visuais de micro-interacoes de forma global.
- `js/models.js`: Centraliza a declaracao obrigatoria de todas as classes das entidades arquitetadas (Usuario, Curso, Matricula, Pagamento). Assegura que toda representacao possua construtores coesos, geracao automatica de Primary Keys seguras (UUIDs) e provedores de desserializacao (`fromJSON`) para preservar a metadologia de polimorfismo ao reconstruir instancias serializadas na camada temporaria de banco.
- `js/data.js`: Abstracao do repositorio de persistencia. Contem o nucleo do Database Engine da aplicacao local. Este orquestrador intercepta requisicoes dos controladores da UI e as transcreve no `localStorage` por meio de mecanismos serializados, contendo toda arvore complexa de Foreign Keys de relacionamento. E responsavel pela criacao da massa de dados primarios via a funcao logica `initMockData()`.
- `js/ui.js`: Biblioteca de utilitarios visuais de negocio. Propoe metodos reutilizaveis globalmente, delegando a responsabilidade automatica de instanciar componentes complexos como a transformacao de modais e componentes flutuantes (Toasts) via o motor vanilla do proprio Bootstrap JS.
- `js/app.js`: Cerebro da aplicacao, consolida toda as partes. Orquestra a metralhadora de mapeamento Single Page (MapsTo), e o provedor nativo geral da captura de eventos no DOM atraves do padrao arquitetural universal de `Event Delegation`, minimizando assim fugas de memoria no contexto do cliente. Captura o envio de formularios com avaliacao sistemica rigorosa.
