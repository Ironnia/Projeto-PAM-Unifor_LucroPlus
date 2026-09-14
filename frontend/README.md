# LucroPlus — Frontend

App do protótipo **LucroPlus** (gestão inteligente de restaurante) reconstruído a
partir do protótipo HTML original, agora em **React + TypeScript + Vite**.

É **multiplataforma**: o mesmo código roda como **web** (navegador, inclusive
mobile) e é empacotado com **Capacitor** para gerar um **app Android instalável
(APK)** — sem necessidade de publicar em loja.

## Stack

- **React 19 + TypeScript** — UI e tipagem.
- **Vite** — dev server e build.
- **@phosphor-icons/react** — ícones (mesma família do protótipo).
- **@fontsource** — fontes Inter e Space Grotesk (offline, sem CDN).
- **Capacitor** — empacota a build web como app nativo Android/iOS.

## Estrutura

```
src/
  data.ts            # dados mocados (portados do js/data.js do protótipo)
  types.ts           # tipos do domínio
  AppContext.tsx     # estado global + ações (portado do js/app.js)
  App.tsx            # moldura + troca de telas + overlays
  main.tsx           # entrada (fontes + CSS + render)
  styles/design.css  # design tokens + componentes (copiado do protótipo)
  components/         # Icon, TabBar, BottomNav, Toast, SheetPrato
  screens/           # Login, Inicio, Lotes, Cardapio, Alertas, Config
legacy-js/           # app React (JavaScript) anterior, arquivado
```

## Rodando na web

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check (tsc) + build de produção em dist/
npm run preview  # serve a build de produção
```

## Gerando o app Android (instalável, sem loja)

Pré-requisitos: **Android Studio** (traz o Android SDK) e **JDK 17**.

```bash
npm run build           # gera dist/
npx cap sync android    # copia a build para o projeto nativo
npx cap open android    # abre no Android Studio
```

No Android Studio: **Build > Build APK(s)**. O APK gerado
(`android/app/build/outputs/apk/debug/app-debug.apk`) pode ser instalado
direto no celular (ativando "Fontes desconhecidas"), sem passar pela Play Store.

> iOS é possível com `npx cap add ios` (requer macOS + Xcode).
