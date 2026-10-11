# CivicLens 🗞️

CivicLens is a vibrant, modern, Gen Z-oriented hyperlocal civic news discovery web application. It transforms local municipal updates, transit notices, and civic announcements into an immersive visual digital publication.

---

## 🎨 Creative Direction & Visual Identity

Built with an energetic, bold, and media-forward aesthetic:

- **Primary Background**: Rich, unapologetic electric orange (`#FA541C` / `#E03E0B`).
- **High-Contrast Surfaces**: Deep obsidian black (`#121212`) and crisp white (`#FFFFFF`) with 2px borders and punchy hard drop shadows (`shadow-[0_8px_0_0_#121212]`).
- **Accent Pops**: Electric Lime (`#D4FF00`) for top story alerts, verified notice tags, and progress indicators.
- **Typography**: High-fashion editorial display font (**Syne**) for headlines and mastheads, paired with **Plus Jakarta Sans** for body text.
- **Cinematic Scrims**: Smooth multi-stop dark gradients layered over photography to ensure white text remains legible across all lighting conditions.

---

## 🌟 Key Features

### 1. Featured News Carousel (Main Page)
- Prominent top carousel showcasing top local civic stories.
- Full-bleed immersive photography with overlaid text and dark gradient scrims.
- Includes category tag, bold headline, factual description, verified publisher, and direct original article link.
- Previous / Next arrow controls and `1 / 6` slide pip indicator.

### 2. Full-Bleed Image Flashcards
- Full-bleed photographic background with overlaid text.
- Multi-modal navigation synchronized across all input methods:
  - **Touch Swipe**: Swipe left (Next) / Swipe right (Previous).
  - **Mouse Wheel / Trackpad**: Scroll down (Next) / Scroll up (Previous) with smooth 450ms debounce lockout to prevent accidental skips.
  - **Visible Arrow Buttons**: Previous & Next buttons.
  - **Keyboard**: Left and Right arrow keys.
  - **Position Progress**: Real-time progress bar and counter (`Card X of Y`).
  - **Grid View Toggle**: Switch between deck view and full grid view.
  - **Category Filter**: Instant category filtering.

### 3. Local Civic Feed & Search
- Local search bar with topic chips (*Pune traffic updates*, *Water supply interruptions*, etc.).
- Category pill filters with distinct high-contrast color codes.
- Deterministic empty state and error boundary with retry.

### 4. Demo Profile & Locality Setup
- Onboarding flow with one-time device location permission request and manual PIN code fallback.
- Locally persisted in `localStorage` without cloud tracking.

---

## 🚀 Running Locally

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```
