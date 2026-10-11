# CivicLens 🗞️

CivicLens is a lightweight hyperlocal civic news discovery web application built with modern React, TypeScript, and an editorial design system. It helps residents discover local news and civic updates relevant to their selected municipal locality (e.g., Pune).

---

## 🎨 Visual Design Tokens

Built around a clean, trustworthy editorial aesthetic inspired by print newspapers redesigned for the modern web:

| Design Token | Hex Code | Description |
|---|---|---|
| **Main Background** | `#FBE5D6` | Soft peach background |
| **Card & Surfaces** | `#FFF9F4` | Warm light card and content surfaces |
| **Primary Text** | `#292923` | High-contrast dark slate body and headlines |
| **Primary Accent** | `#315B48` | Deep forest green for actions, active tabs, and tags |
| **Secondary Highlight** | `#D9A441` | Warm mustard gold for flashcards and key badges |
| **Warm Borders** | `#E5D3C2` | Subtle warm neutral borders |

---

## 🏛️ Phase 1 Architecture & Features

### 1. Main News Discovery Feed
- **Header & Locality Indicator**: Persistent selected locality (default: **Pune**) with one-click locality change modal.
- **Search & Filter Controls**:
  - Local topic and incident search.
  - Search button and instant refresh control.
  - Quick suggested queries: *"Pune traffic updates"*, *"Water supply interruptions"*, *"Road closures and construction"*, *"Local government announcements"*.
  - Category filters: *Politics/Government*, *Infrastructure/Roads*, *Utilities*, *Disasters/Emergencies*, *Traffic/Transport*, *Public Safety*, *Community/Other*.
- **Editorial News Cards**:
  - Headline and short factual description.
  - Verified source badge and publisher attribution.
  - Publication timestamp.
  - Category tag and thumbnail container with category-specific graphic fallback.
  - Direct **"Read Original Article"** link.
- **States & Responsible Messaging**:
  - Animated skeleton loading state.
  - Resilient error state with retry.
  - Fact-compliant empty state clarifying dataset boundaries (*absence of search results does not mean no civic incidents exist*).

### 2. Civic Flashcards
- **Interactive Browsing**:
  - **Card View**: Carousel presentation mode with Previous, Next, and keyboard arrow controls.
  - **Grid View**: Full overview of all generated cards.
  - **Category Filtering**: Instant category slice.
  - Direct link back to local news feed.
- **Deterministic Engine**: Sentence extraction and category-based impact rules without non-deterministic AI generation.

### 3. Profile & Locality Setup
- **Onboarding Modal**: Greets first-time visitors to set their locality, PIN code, and optional name.
- **Locality Settings**:
  - View and edit name, unverified phone number, locality, and PIN code.
  - One-time device geolocation permission request with graceful manual PIN fallback.
  - Clear disclosure that profile is stored in `localStorage` without cloud accounts or external databases.

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- Node.js `v18+` (tested on Node `v24.20.0`)
- npm `v9+` (tested on npm `v11.19.0`)

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build & Typecheck
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```
