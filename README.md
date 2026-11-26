# Boche Shkesbierre & Club

A premium single-page web application for **Boche Shkesbierre & Club**, showcasing a dual-concept venue:
1. **Artisan Brewery & Dining**: Small-batch craft beers, wood-fired gastronomy, copper kettle aesthetic, and relaxed social dining.
2. **High-Energy Night Club**: Concert acoustics, dynamic kinetic laser lighting, resident/guest DJs, and VIP lounge bottle service.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: JavaScript (`.jsx` / `.js`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Google Fonts (`Cinzel` for heritage serif, `Syne` for club display, `Outfit` for body)

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 2. Installation
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Build output will be bundled in the `dist/` directory.

---

## 📁 Project Structure

```
├── public/
│   └── images/               # High-resolution venue assets and placeholders
│       ├── brewery-hero.jpg  # Brewery craft dining imagery
│       ├── club-hero.jpg     # Nightclub lighting and DJ imagery
│       └── hero-split.jpg    # Dual-concept split background
├── src/
│   ├── assets/               # Logos and static design assets
│   ├── components/           # One component per section
│   │   ├── Logo.jsx          # Dual-concept emblem monogram & brand badge
│   │   ├── Navbar.jsx        # Sticky navigation, mobile drawer & Reserve CTA
│   │   └── Hero.jsx          # Full-screen dual interactive Hero experience
│   ├── data/                 # Content separated from presentation
│   │   ├── siteConfig.js     # Brand name, phone, email, address, opening hours
│   │   └── navigation.js     # Nav links, badges, and CTA configurations
│   ├── App.jsx               # Main single-page layout & section anchors
│   ├── index.css             # Tailwind v4 @theme design tokens & utilities
│   └── main.jsx              # React root entry point
├── index.html                # Google Fonts preconnect & meta SEO headers
└── vite.config.js            # Vite + React + Tailwind v4 plugin configuration
```

---

## 🎨 Where to Customize

### 1. Content & Text Placeholders (`src/data/siteConfig.ts` and `src/data/navigation.ts`)
- **Brand Name & Tagline**: Edit `siteConfig.brandName`, `siteConfig.tagline`, and `siteConfig.subTagline`.
- **Contact Details**: Update `siteConfig.contact.phone`, `siteConfig.contact.email`, and `siteConfig.contact.address`.
- **Opening Hours**: Modify `siteConfig.hours.brewery` and `siteConfig.hours.club`.
- **Social Links**: Set your official Instagram, Facebook, and Spotify profiles.

### 2. Colors & Design Tokens (`src/index.css`)
Inside `src/index.css`, customize the `@theme` variables:
- **Brewery Palette**: `--color-brewery-amber`, `--color-brewery-copper`, `--color-brewery-gold`.
- **Club Palette**: `--color-club-purple`, `--color-club-magenta`, `--color-club-cyan`.
- **Obsidian Dark Surface**: `--color-obsidian-950`, `--color-obsidian-900`, `--color-obsidian-850`.

### 3. Images (`public/images/`)
Replace the placeholder files in `public/images/` with your venue photography:
- `brewery-hero.jpg` — High-resolution photo of your brewery / bar / dining area.
- `club-hero.jpg` — High-resolution photo of your club dancefloor / DJ console / lighting.
- `hero-split.jpg` — Venue wide-angle visual.

---

## 📌 Sections Roadmap

- [x] **Project Setup**: Vite + React 19 + TypeScript + Tailwind CSS v4 + Design Tokens.
- [x] **Section 1: Sticky Navbar**: Logo, anchor links, "After Dark" club badge, quick Brewery/Club toggle pill, Reserve button, responsive mobile hamburger drawer.
- [x] **Section 2: Hero**: Full-screen dual-split interactive experience, typography, dual CTAs, features strip, scroll prompt.
- [ ] **Section 3: About**: Brand story and the dual concept.
- [ ] **Section 4: Brewery & Dining**: Signature craft brews, tasting flights, culinary highlights.
- [ ] **Section 5: Night Club**: Music philosophy, resident/guest DJs, VIP bottle & table booking.
- [ ] **Section 6: Events / What's On**: Weekly lineup and upcoming party calendar cards.
- [ ] **Section 7: Gallery**: Responsive image grid with category filters.
- [ ] **Section 8: Reservations & Contact**: Form, map embed placeholder, hours, and direct reachout.
- [ ] **Section 9: Footer**: Social links, quick links, copyright.
