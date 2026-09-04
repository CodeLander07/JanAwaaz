# CivicPulse BRICS — Frontend Specification

> Last updated: 2026-09-04 (Agent Iteration #2)

## Overview

The frontend is a Next.js 16 (App Router) application built with TypeScript, React 19, and Tailwind CSS v4. It features a high-contrast monochrome landing page with dark/light mode support and a full-viewport Deck.gl H3 hexagonal hotspot map dashboard.

---

## Architecture

### App Router Structure

```
client/
├── app/
│   ├── layout.tsx             # Root layout (ThemeProvider, fonts, metadata)
│   ├── globals.css            # Tailwind v4 + dark mode + Mapbox overrides
│   ├── page.tsx               # Landing page (server component composition)
│   └── dashboard/
│       └── page.tsx           # H3HotspotMap dashboard
├── components/
│   ├── providers/
│   │   └── ThemeProvider.tsx  # next-themes wrapper
│   ├── landing/
│   │   ├── Navbar.tsx         # Sticky nav with glassmorphism
│   │   ├── HeroSection.tsx    # Hero with animated terminal
│   │   ├── ProblemBento.tsx   # Problem bento grid
│   │   ├── ArchitecturePipeline.tsx  # 4-step pipeline
│   │   ├── InteractiveScoring.tsx    # Formula + sliders
│   │   ├── DemoTeaser.tsx     # Hex grid preview
│   │   ├── Footer.tsx         # Minimalist footer
│   │   └── ThemeToggle.tsx    # Sun/Moon animated toggle
│   └── map/
│       ├── H3HotspotMap.tsx   # Main map component
│       ├── MapControls.tsx    # Overlay control panel
│       └── MapTooltip.tsx     # Hover tooltip
├── lib/
│   ├── map-utils.ts           # Color scale, formatting utilities
│   └── mock-h3-data.ts        # Mock data generator
└── types/
    └── h3.ts                  # TypeScript interfaces
```

### Client-Side Rendering Strategy

Deck.gl requires WebGL, which is browser-only. The `H3HotspotMap` component is imported via `next/dynamic` with `ssr: false`:

```tsx
const H3HotspotMap = dynamic(
  () => import('@/components/map/H3HotspotMap'),
  { ssr: false, loading: () => <MapLoadingSpinner /> }
);
```

---

## H3HotspotMap Component API

### Props

| Prop              | Type                           | Default                  | Description                          |
| ----------------- | ------------------------------ | ------------------------ | ------------------------------------ |
| `data`            | `H3HexData[]`                  | (required)               | Array of H3 hex cells to render      |
| `initialViewState`| `ViewState`                    | Delhi NCR center         | Camera position                      |
| `onSelectHex`     | `(hex: H3HexData) => void`    | —                        | Click callback                       |
| `colorMetric`     | `ColorMetricKey`               | `'compositePriority'`    | Color encoding metric                |
| `elevationScale`  | `number`                       | `50`                     | Elevation multiplier                 |
| `mapboxToken`     | `string`                       | `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox access token               |

### Visual Encoding

| Channel    | Data Field          | Encoding                                   |
| ---------- | ------------------- | ------------------------------------------ |
| Fill Color | `colorMetric` value | 5-stop gradient: green → yellow → orange → red |
| Elevation  | `complaintCount`    | Linear scale × `elevationScale`             |
| Opacity    | —                   | Fixed at 0.85                               |
| DPI Tint   | `isCoveredByDPI`    | Blue shift overlay on covered cells          |
| Selection  | Click               | White wireframe ring                         |

### Transitions

- **Color**: 500ms interpolation on metric change
- **Elevation**: 800ms spring animation on toggle
- **Elevation Scale**: 600ms interpolation

---

## Deck.gl Integration

### Layer Stack

1. **H3HexagonLayer** (`h3-hotspot-layer`): Primary visualization
2. **H3HexagonLayer** (`h3-selection-ring`): Selected hex highlight (wireframe)

### Update Triggers

```typescript
updateTriggers: {
  getFillColor: [currentMetric],
  getElevation: [elevationEnabled],
  elevationScale: [elevationEnabled, elevationScale],
}
```

---

## State Management

Current approach uses local `useState` hooks:

| State             | Type            | Purpose                            |
| ----------------- | --------------- | ---------------------------------- |
| `viewState`       | `ViewState`     | Camera position (deck.gl controlled) |
| `activeMetric`    | `ColorMetricKey`| Currently active color metric       |
| `elevationEnabled`| `boolean`       | 3D extrusion toggle                 |
| `selectedHex`     | `H3HexData | null` | Currently selected hex cell     |
| `hoverInfo`       | `HoverInfo | null`  | Hover position and hex data     |

### Future State Architecture

For production with real backend data, migrate to:
- **React Query / TanStack Query** for server-state caching
- **Zustand** for cross-component map state (if needed)
- **URL search params** for shareable map views

---

## Styling

- **Tailwind CSS v4** with `@import "tailwindcss"` syntax
- **Dark-only theme** (map visualization requires dark basemap)
- **Glassmorphism** panels: `bg-gray-900/80 backdrop-blur-xl border border-white/15`
- **Inter** font from Google Fonts
- **lucide-react** for all icons

---

## Dependencies

| Package              | Version | Purpose                        |
| -------------------- | ------- | ------------------------------ |
| `deck.gl`            | ^9      | Core visualization library     |
| `@deck.gl/react`     | ^9      | React bindings                 |
| `@deck.gl/geo-layers`| ^9      | H3HexagonLayer                 |
| `@deck.gl/layers`    | ^9      | Base layer types               |
| `react-map-gl`       | ^7      | Mapbox GL React wrapper        |
| `mapbox-gl`          | ^3      | Mapbox GL JS                   |
| `h3-js`              | ^4      | H3 spatial index utilities     |
| `lucide-react`       | latest  | Icon library                   |
