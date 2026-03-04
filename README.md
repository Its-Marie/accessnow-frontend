💙 About AccessNow

This frontend for the AccessNow+ Mobility App. Goal: accessible navigation, personalized needs, and fast map-based orientation.

You are helping build a more inclusive world. 🌍💙

Frontend for the AccessNow+ Mobility App. Goal: accessible navigation, personalized needs, and fast map-based orientation.

**Features**
- React SPA with Vite
- Map view via Leaflet
- Route planning with POIs
- Registration, login, favorites
- i18n via i18next

**Tech Stack**
- React + Vite
- React Router
- Leaflet + React-Leaflet
- i18next

**Prerequisites**
- Node.js (LTS recommended)
- npm

**Setup**
1. Install dependencies

```bash
npm install
```

2. Environment variables

Create a `.env` in the project root (example):

```bash
VITE_API_BASE=http://127.0.0.1:5000
```

3. Start dev server

```bash
npm run dev
```

**Scripts**
- `npm run dev` starts the Vite dev server
- `npm run build` creates the production build
- `npm run preview` previews the build locally
- `npm run lint` runs ESLint

**Project Structure**
- `src/pages/` pages (auth, home, map, personalization)
- `src/components/` UI components
- `src/config/api.js` API base URL
- `src/i18n/` translations
