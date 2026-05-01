# Sudoku React (Vite + React + Tailwind)

This is a starter scaffold for a production-ready React app using Vite and Tailwind CSS.

Quick commands

- Install dependencies:

```bash
npm install
```

- Run dev server:

```bash
npm run dev
```

- Build for production:

```bash
npm run build
```

Notes

- I created a minimal scaffold. To finish setup, run `npm install` in the workspace root to fetch packages declared in `package.json`.
- Firebase is configured through Vite environment variables. Copy [.env.example](.env.example) to `.env` and fill in your project values.
- If you prefer to bootstrap via the Vite initializer, you can run:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

Tailwind installation (alternative command flow)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Files & folders added

- [package.json](package.json)
- [vite.config.js](vite.config.js)
- [tailwind.config.cjs](tailwind.config.cjs)
- [postcss.config.cjs](postcss.config.cjs)
- [index.html](index.html)
- [src/main.jsx](src/main.jsx)
- [src/App.jsx](src/App.jsx)
- [src/index.css](src/index.css)
- [src/components/Layout.jsx](src/components/Layout.jsx)
- [src/components/Header.jsx](src/components/Header.jsx)
- [src/pages/Home.jsx](src/pages/Home.jsx)
- Folder READMEs under `src/` for: `hooks`, `context`, `services`, `utils`, `models`, `firebase`
- [src/firebase/config.js](src/firebase/config.js)
- [src/services/authService.js](src/services/authService.js)
- [.env.example](.env.example)

Firebase project setup

- Create a Firebase project in the Firebase console.
- Enable Authentication providers for Anonymous and Google sign-in.
- Copy the web app config values into `.env` using the names in [.env.example](.env.example).
