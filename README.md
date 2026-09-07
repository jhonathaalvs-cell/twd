# The Walking Dead Universe RPG — Fichas Online

Projeto inicial de uma ficha digital online baseada nas 4 páginas da ficha enviada:

1. Ficha do personagem
2. Ficha de refúgio
3. Ficha de desafios
4. Registro de viagem

## Estrutura

```text
twd-rpg-firebase/
├── index.html                 # Login / cadastro
├── dashboard.html             # Lista de fichas
├── pages/
│   ├── ficha.html             # Personagem
│   ├── refugio.html           # Refúgio
│   ├── desafios.html          # Desafios
│   └── viagem.html            # Registro de viagem
├── css/
│   └── style.css
├── js/
│   ├── firebase-config.js     # COLOQUE A CONFIGURAÇÃO DO SEU FIREBASE
│   ├── auth.js
│   ├── firestore.js
│   ├── dashboard.js
│   ├── ficha.js
│   ├── refugio.js
│   ├── desafios.js
│   └── viagem.js
└── firebase/
    └── firestore.rules
```

## Como ligar ao Firebase

1. Crie um projeto no Firebase.
2. Ative Authentication > Sign-in method > Email/Password.
3. Crie o Firestore Database.
4. Em `js/firebase-config.js`, substitua os valores de exemplo pela configuração Web do seu projeto.
5. Publique as regras de `firebase/firestore.rules`.
6. Abra o `index.html` por um servidor local ou hospede em Firebase Hosting/GitHub Pages.

> Para o Firebase funcionar corretamente, não abra o projeto usando `file://`. Use um servidor local, por exemplo a extensão Live Server do VS Code.

## Modelo de dados

Cada usuário possui documentos em:

`users/{uid}/fichas/{fichaId}`

E cada ficha possui subcoleções:

- `refugio`
- `desafios`
- `viagem`

A ficha é salva automaticamente no Firestore depois de alterações, com debounce para evitar gravações excessivas.

## Observação

Os nomes dos campos foram baseados na ficha enviada. A página 1 contém Nome, Arquétipo, Descrição, Motivação, Peculiaridades, Âncoras, Anotações, Vigor, Agilidade, Perspicácia, Empatia, perícias, Talentos, Vida, Estresse, Experiência, Espaços de Sobrecarga, Equipamento, Armas, Armadura, Equipamento Armazenado e Itens Minúsculos. As páginas seguintes acrescentam Refúgio, PNJs Sobreviventes, Desafios, Facções, Rumores, Relógios e Registro de Viagem.
