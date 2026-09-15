# Portfólio — Daniel Robson Alexandre Silva

Portfólio pessoal de página única, com identidade visual inspirada em terminal/editor de código — sem frameworks, sem ícones de biblioteca externa.

## Tecnologias

* **HTML5 & CSS3** — estrutura semântica, variáveis CSS para os temas claro/escuro.
* **JavaScript (vanilla)** — sem dependências externas.
* **Google Fonts** — Space Grotesk (títulos), IBM Plex Sans (texto) e IBM Plex Mono (elementos de terminal e dados).

## Estrutura do projeto

* **index.html** — página única com as seções:
  * *Hero*: apresentação com uma janela de terminal animada (efeito de digitação).
  * *Realizações*: destaques de projetos, consistência em código e formação.
  * *Projetos*: cards com links para os repositórios no GitHub (e o site publicado do projeto Qahal).
  * *Certificados*: listagem filtrável por categoria e pesquisável por nome/instituição, com estatísticas calculadas automaticamente (total de certificados e horas).
* **style.css** — tokens de cor/tipografia e estilos dos componentes.
* **script.js** — alternância de tema (persistida em `localStorage`), navegação com destaque de seção ativa, efeito de digitação do terminal, busca e filtro de certificados.

## Como publicar no GitHub Pages

1. Suba os arquivos (`index.html`, `style.css`, `script.js`) para um repositório no GitHub.
2. Em **Settings > Pages**, em **Build and deployment > Source**, selecione `Deploy from a branch`.
3. Selecione a branch `main` e a pasta `/ (root)`, depois **Save**.
4. Aguarde alguns minutos — o link ficará em `https://daniel-alex7.github.io/<nome-do-repositorio>/`.

## Melhorias futuras

* Formulário de contato com backend real (ex.: Formspree).
* Página de detalhes por certificado/projeto.

---
Desenvolvido por Daniel Robson Alexandre Silva.
