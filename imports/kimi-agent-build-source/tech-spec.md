# No-Code Reviews - Technical Specification

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "gsap": "^3.12.5",
    "@gsap/react": "^2.1.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "three": "^0.160.0",
    "@types/three": "^0.160.0",
    "lenis": "^1.1.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0",
    "zustand": "^4.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

## Component Inventory

### Layout Components
- **Navbar** - Sticky navigation with logo, links, CTA, mobile hamburger
- **Footer** - 4-column footer with links, social, copyright
- **RightRail** - Fixed progress indicator with depth markers
- **PageLayout** - Wrapper for all pages

### Shared Components
- **ToolCard** - White card with logo, name, tagline, rating, badges
- **ComparisonCard** - Side-by-side tool comparison preview
- **ArticleCard** - Blog article preview card
- **VideoCard** - Tutorial video thumbnail card
- **StarRating** - SVG star rating display
- **CategoryChip** - Category badge
- **SponsoredBadge** - Sponsored indicator
- **AffiliateButton** - CTA button with tracking
- **SectionMarker** - Large depth number (01, 02, etc.)
- **NewsletterSignup** - Email subscription form

### Page Sections
- **HeroSection** - Floating nodes, scramble text
- **ReviewsSection** - Split layout with sticky image + review cards
- **GuidesSection** - Horizontal scrolling guide cards
- **Compare3DSection** - R3F 3D scene
- **TutorialsSection** - Video grid
- **PlatformerSection** - Canvas pixel art
- **EmailSignupSection** - Newsletter CTA section
- **LatestArticlesSection** - Article grid

### Admin Components
- **AdminLayout** - Sidebar + content area
- **StatCard** - Dashboard metric card
- **ChartWidget** - Recharts chart wrapper
- **DataTable** - Sortable/filterable table
- **TabPanel** - Tabbed interface
- **StatusBadge** - Status indicator

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| Smooth scroll | Lenis | Global wrapper, sync with GSAP | Low |
| Text scramble | GSAP | Custom splitText + random char resolve | Medium |
| Horizontal scroll | GSAP ScrollTrigger | Pin section, scrub translateX | Medium |
| 3D floating scene | R3F | useFrame for floating, mouse parallax | High |
| Staggered card reveal | GSAP ScrollTrigger | Batch stagger on scroll | Low |
| Parallax images | GSAP ScrollTrigger | yPercent transform | Low |
| Node repulsion | Custom JS | Vector math on mousemove | Low |
| Magnetic buttons | Framer Motion | useMotionValue + spring | Medium |
| Star rating pop | Framer Motion | Scale spring animation | Low |
| Platformer sprite | Canvas API | requestAnimationFrame sprite sheet | Medium |
| Scroll snap | GSAP ScrollTrigger | snap function on global trigger | Medium |

## State Management (Zustand)

### UI Store
- theme (light/dark)
- mobileMenuOpen
- activeSection
- scrollProgress

### Data Store
- tools[]
- articles[]
- comparisons[]
- subscribers[]
- admin auth state

### Admin Store
- activeTab
- selectedSection
- filters
- modals

## Project Structure

```
src/
  components/
    ui/              # shadcn components
    layout/          # Navbar, Footer, AdminLayout
    shared/          # ToolCard, ArticleCard, StarRating, etc.
    sections/        # Homepage sections
    admin/           # Admin dashboard components
  pages/             # Route pages
  hooks/             # Custom hooks
  stores/            # Zustand stores
  data/              # Mock data
  lib/               # Utils
  types/             # TypeScript types
  App.tsx
  main.tsx
```

## Color Implementation

```css
:root {
  --color-ink: #012A38;
  --color-ink-2: #1a4454;
  --color-ink-3: #4a6b7a;
  --color-cream: #faf8f4;
  --color-mid: #f3ede4;
  --color-border: #e8e4dc;
  --color-accent: #C8FF2F;
  --color-accent-2: #a8df0f;
  --color-white: #ffffff;
  --color-success: #166534;
  --color-success-bg: #f0fdf4;
  --color-error: #dc2626;
  --color-code-bg: #1e1e2e;
  --color-code-fg: #cdd6f4;
}
```

## Key Implementation Notes

1. **React Router** with HashRouter for static deployment
2. **GSAP ScrollTrigger** for all scroll-driven animations
3. **Lenis** for smooth scroll (single instance, global)
4. **R3F** wrapped in Suspense with fallback UI
5. **Zustand** stores for cross-component state
6. **Mock data** in src/data/ representing full Supabase schema
7. **Admin routes** protected by simple auth check
8. **Responsive** mobile-first with Tailwind breakpoints
9. **Performance** lazy load heavy components (3D, charts)
10. **Accessibility** proper ARIA labels, keyboard nav, reduced motion support
