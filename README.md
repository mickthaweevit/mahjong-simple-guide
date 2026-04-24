# 🀄 Mahjong Simple Guide

An interactive web guide for Hong Kong-style Mahjong rules, built with Vue 3. Covers everything from game setup to hand scoring, with a built-in hand simulator to practice calculating fan.

🌐 **Live site:** [mickthaweevit.github.io/mahjong-simple-guide](https://mickthaweevit.github.io/mahjong-simple-guide/)

## Features

- Step-by-step rules guide in learning progression order
- Hand scoring calculator / simulator
- Searchable scoring reference
- Bilingual support (Thai / English)
- Responsive layout for mobile and desktop

## Sections covered

- Game setup & tile introduction
- Game rotation & gameplay flow
- Winning structure (standard, seven pairs, thirteen orphans)
- Hand scoring & fan counting
- Flowers, seasons & "biting" (kud) rule
- Payout with exponential formula
- Bao penalty (full liability)
- Special rules

## Tech stack

- [Vue 3](https://vuejs.org/) with Composition API
- [Vite](https://vite.dev/) for build tooling
- [vue-i18n](https://vue-i18n.intlify.dev/) for internationalization
- [Vitest](https://vitest.dev/) for testing
- TypeScript

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |

## License

MIT
