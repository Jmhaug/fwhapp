# FWH Sjekkliste

En modern, mobil-vennlig sjekkliste-app for FWH sitt team. Håndter oppgaver, fakturaer, gjentakende fakturaer og få detaljert statistikk for alle tre divisjoner: FWH Eiendom, FWH Invest, og FWH Bemanning.

## Features

✅ **Oppgaver**
- Oppgave-tracking med progresjonsmåler
- Fullfør/ulluken status
- Slett oppgaver

💰 **Fakturaer**
- Faktura-tracking med automatisk summering
- Leverandør og beløp registrering
- Enkel oversikt over alle fakturaer

📋 **Gjentakende fakturaer**
- Pre-populert liste fra CSV-data
- Merk månedsgjeldende fakturaer som betalt
- Månedlig og kvartalsvis kostnader
- Progresjonsmåler for månedens betalinger

📊 **Dashboard & statistikk**
- Interaktive grafer over kostnader per divisjon
- Oppgave-fullføring oversikt
- Kostnadssammenlikning mellom divisjoner
- Visualisering av gjentakende fakturaer

🌓 **Mørk modus**
- Mørkemodusstøtte med knapp
- Automatisk lagring av preferanse

📱 **Responsiv design**
- Fullt responsiv for mobil, tablet og desktop
- Optimalisert brukeropplevelse på alle enheter

💾 **Datahåndtering**
- Automatisk lagring av data i nettleseren (localStorage)
- Supabase-integrasjon klar (valgfritt)

🎨 **Modern UI**
- Smooth animasjoner
- Gradient-design
- Norsk interface

## Installation

```bash
npm install
```

## Development

Start utviklingsserver:

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

### Supabase Setup (Valgfritt)

1. Gå til [supabase.com](https://supabase.com) og opprett en gratis konto
2. Opprett et nytt prosjekt
3. Kopier `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` fra instillingene
4. Lag en `.env.local` fil basert på `.env.example`:

```bash
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

5. Appen vil automatisk synkronisere data til Supabase når miljøvariablene er satt

## Build

For produksjon:

```bash
npm run build
```

Output blir i `dist/` mappen.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Grafer og visualiseringer
- **Lucide React** - Ikoner
- **Supabase** - Backend (valgfritt)

## Bruk

### Sjekkliste Tab
1. Velg divisjon ved å klikke på knappene øverst
2. Legg til oppgaver og marker dem som fullført
3. Legg til fakturaer med leverandørnavn og beløp

### Gjentakende fakturaer Tab
1. Se liste over gjentakende fakturaer for valgt divisjon
2. Klikk på faktura for å markere som betalt denne måneden
3. Se statistikk for månedlige og kvartalslige kostnader

### Dashboard Tab
1. Se samlede statistikker for alle divisjoner
2. Analyser kostnader og oppgaver med interaktive grafer
3. Sammenlign kostnader mellom divisjoner

### Mørkt modus
Klikk på sol/måne-ikonet øverst til høyre for å bytte tema

## CSV-analyse og gjentakende fakturaer

Appen er **automatisk analysert** fra 3 CSV-filer med 252+ fakturaer for å finne alle gjentakende leverandører.

### Resultater av analysen

**Total analyse-periode**: 01.01.2023 - 30.11.2025
**Totalt beløp**: 935,559 NOK
**Unike leverandører**: 15

**Se detaljert rapport**: Se `ANALYSIS_REPORT.md` for fullstendig analyse med alle detaljer.

#### FWH Eiendom (2 gjentakende)
- **Fwh Eiendom AS** - 7,612.50 NOK (bi-månedsvis, 16 fakturaer)
- **Bergen kommune** - 2,555.64 NOK (bi-månedsvis, 5 fakturaer)

#### FWH Invest (6 gjentakende)
- **Skatteetaten - Skatteinnkreving** - 36,038.55 NOK (kvartalsvis, 11 fakturaer)
- **Sameiet Fanatorget** - 6,829.67 NOK (bi-månedsvis, 6 fakturaer)
- **Accountor AS** - 4,974.27 NOK (månedlig, 48 fakturaer)
- **PowerOffice AS** - 707.99 NOK (månedlig, 47 fakturaer)
- **DNB Livsforsikring AS** - 1,365.44 NOK (bi-månedsvis, 17 fakturaer)
- **Accountor Credit AS** - 3,162.96 NOK (bi-månedsvis, 3 fakturaer)

#### FWH Bemanning (3 gjentakende)
- **Talkmore AS** - 571.29 NOK (månedlig, 26 fakturaer)
- **BKK AS** - 266.62 NOK (månedlig, 26 fakturaer)
- **Kraftriket AS** - 126.21 NOK (månedlig, 25 fakturaer)

### Kjøre analysen selv

```bash
python3 analyze_invoices.py
```

Dette vil:
1. Analysere alle CSV-filer
2. Identifisere gjentakende leverandører
3. Detektere mønstre (månedlig, kvartalsvis, etc.)
4. Generere `recurring_invoices.json`
5. Oppdatere `src/App.jsx` automatisk

### Analyse-metodologi

- **Datakilder**: 3 CSV-filer fra PowerOffice
- **Prøvestørrelse**: 252 unike fakturaer
- **Gjentakende definisjon**: ≥3 fakturaer med regelmessig mønster
- **Frekvensdeteksjon**: Analyserer dager mellom fakturaer
  - Månedlig: ~30 dager
  - Bi-månedsvis: 40-100 dager
  - Kvartalsvis: 100-150 dager

**Du kan redigere disse tallene i `src/App.jsx` ved behov.**
