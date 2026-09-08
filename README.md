# Voce quer sair comigo?

Paginazinha em pixel art com tres telas: a pergunta, a comemoracao e o
fecho com os nomes. HTML/CSS/JS puro, sem build, sem dependencia.

## Rodar local

Precisa de um servidor (abrir o arquivo direto no navegador quebra o
carregamento dos scripts em alguns casos):

    python -m http.server 4173

Depois abra http://localhost:4173

## Trocar as imagens

Solte arquivos em `assets/` com estes nomes:

| arquivo           | onde aparece                          |
|-------------------|---------------------------------------|
| `pergunta.*`      | quadrinho da 1a tela                  |
| `triste.*`        | troca depois do 3o "Nao"              |
| `comemoracao.*`   | quadrinho da tela do EBAAA            |

Aceita `.gif`, `.png`, `.webp`, `.jpg`. Nao achando nada, usa o pixel art
que ja vem no projeto. O fundo do quadro fica claro quando tem imagem e
escuro quando usa o sprite.

Esses arquivos estao no `.gitignore` — veja o comentario la.

## Estrutura

    index.html
    css/style.css
    js/sprite-data.js    grids de pixel art em texto
    js/sprites.js        grid -> SVG
    js/scene.js          nuvens, predios, borboletas (tudo procedural)
    js/audio.js          blips 8-bit via WebAudio
    js/confetti.js       chuva de coracoes em canvas
    js/app.js            fluxo das telas e a escalada do "Nao"

## Publicar no GitHub Pages

1. Crie um repositorio vazio no GitHub (sem README, sem .gitignore).
2. Rode, trocando USUARIO e REPO:

       git remote add origin https://github.com/USUARIO/REPO.git
       git branch -M main
       git push -u origin main

3. No repositorio: **Settings -> Pages -> Source: Deploy from a branch**,
   branch `main`, pasta `/ (root)`, Save.
4. Em ~1 minuto sai em `https://USUARIO.github.io/REPO/`.

Todos os caminhos sao relativos, entao funciona em subpasta sem ajuste.
