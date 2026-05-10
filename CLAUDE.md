# Biolab Quiz

Mentimeter-style kvíz pro workshop o biopsii a genetice. Prezentující promítá otázky s QR kódem, účastníci hlasují z mobilu, po každé otázce se ukáže rozložení odpovědí a na konci celkové vyhodnocení.

## Stack
- **Vite + React** (žádný router, jediná komponenta `src/App.jsx`)
- **Firebase Firestore** pro real-time sync hlasů a stavu hry
- **Firebase Auth** — anonymní přihlášení (každý hlasující dostane unikátní uid)
- **Tailwind CSS přes CDN** (žádný PostCSS / build setup pro CSS)
- **lucide-react** ikony

## Struktura
- `index.html` — entry, načítá Tailwind CDN
- `src/main.jsx` — React entry point
- `src/App.jsx` — celá aplikace (volba role, prezentující, hlasující, vyhodnocení)
- `src/firebase.js` — inicializace Firebase z env proměnných
- `src/questions.js` — data kvízu (otázky, správné odpovědi, vysvětlení)

## Stav hry (Firestore)
Jeden dokument `apps/{APP_ID}/state/current` s poli:
- `currentQuestion` — index aktuální otázky
- `status` — `waiting` | `voting` | `results` | `ended`

Hlasy v kolekci `apps/{APP_ID}/votes`, jeden dokument na hlas:
- `questionIndex`, `optionIndex`, `userId`, `timestamp`

Při restartu nebo startu prezentujícím se kolekce hlasů smaže.

## Lokální vývoj
```bash
npm install
cp .env.example .env   # doplň hodnoty z Firebase konzole
npm run dev
```

## Deploy (Netlify)
- `netlify.toml` říká `npm run build` → publish `dist`
- V Netlify dashboardu nastav všechny `VITE_FIREBASE_*` env proměnné
- SPA redirect je nakonfigurovaný

## Firebase setup (one-time)
1. Vytvořit projekt na console.firebase.google.com
2. Authentication → Sign-in method → povolit **Anonymous**
3. Firestore Database → Create database → start in **test mode** (workshop běží jednorázově, pak smazat / přepnout na produkční pravidla)
4. Project settings → Your apps → Web → zkopírovat config do `.env` a do Netlify env vars

## Úprava otázek
Edituj `src/questions.js`. Push do gitu → Netlify rebuild → nasazeno.

## Co nedělat
- Nepřidávat router, state management knihovny, ani nové frameworky — kvíz se vejde do jedné komponenty
- Nepřepisovat Tailwind na PostCSS, dokud k tomu nebude důvod (CDN je jen pro tento workshop dostatečný)
- Neměnit cesty ve Firestore za běhu workshopu — restart smaže hlasy
