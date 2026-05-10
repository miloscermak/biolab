# Biolab Quiz

Mentimeter-style kvíz pro workshop. Prezentující promítá otázky a QR kód, účastníci hlasují z mobilu, po každé otázce výsledky, na konci celkové vyhodnocení.

## Rychlý start

### 1. Firebase projekt (jednou)
1. Jdi na [console.firebase.google.com](https://console.firebase.google.com), vytvoř nový projekt
2. **Authentication** → **Sign-in method** → povol **Anonymous**
3. **Firestore Database** → **Create database** → vyber **test mode** (pro workshop stačí)
4. **Project settings** (ozubené kolečko) → **General** → scrolluj dolů → **Your apps** → klikni `</>` (Web)
5. Zaregistruj appku, zkopíruj hodnoty z `firebaseConfig`

### 2. Lokálně
```bash
npm install
cp .env.example .env
# vlož hodnoty z Firebase do .env
npm run dev
```

### 3. Deploy na Netlify
1. Push tento repo na GitHub
2. Na [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Vyber repo, build command i publish dir si Netlify načte z `netlify.toml`
4. Před prvním buildem: **Site settings** → **Environment variables** → přidej všech 6 `VITE_FIREBASE_*` proměnných (stejné jako v `.env`)
5. Trigger deploy

## Použití

- Prezentující otevře URL na notebooku → klikne **Prezentující**
- Účastníci načtou QR kód z plátna na mobilu → klikne **Hlasující**
- Prezentující řídí postup tlačítkem vpravo nahoře (ukončit hlasování → další otázka)
- Po poslední otázce se zobrazí celkové vyhodnocení
