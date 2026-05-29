# No-Code Affiliate Site — Value-Add Tools
## Integration Guide for Lovable

All 8 tools are self-contained React components. Drop each `.jsx` file into your Lovable project.

---

## Files Included

| File | Tool | Best Page Placement |
|------|------|---------------------|
| `NoCodeRecommendationWizard.jsx` | Interactive quiz → personalized tool match | Homepage, sidebar, dedicated /quiz page |
| `ComparisonMatrix.jsx` | Select & compare 2–6 tools side-by-side | /compare page, tool category pages |
| `TCOCalculator.jsx` | 12-month true cost calculator with breakdown | Individual tool review pages, /calculators |
| `ProjectPlanner.jsx` | Feature selector → time + cost estimate | /plan or /tools/project-planner |
| `PricingTracker.jsx` | Pricing cards with deals + recent changes | /pricing or sidebar on all tool pages |
| `TemplateLibrary.jsx` | Filterable starter template cards | /templates page |
| `SuccessStoryDatabase.jsx` | Case studies with ROI metrics | /success-stories or homepage social proof |
| `MicrotoolDirectory.jsx` | Hub for all tools above | /tools landing page |

---

## How to Use in Lovable

### 1. Import a component
In any Lovable page file:
```jsx
import NoCodeRecommendationWizard from "./components/NoCodeRecommendationWizard";

export default function HomePage() {
  return (
    <div>
      <h1>Find Your Perfect No-Code Tool</h1>
      <NoCodeRecommendationWizard />
    </div>
  );
}
```

### 2. All components are self-contained
- No props required
- No external API calls (all data is bundled)
- Just import and render — they work immediately

### 3. Adding your affiliate links
Each tool has affiliate link fields in the data arrays at the top of each file.
Search for `affiliate:` or `cloneUrl:` and replace with your tracked links.

Example in `NoCodeRecommendationWizard.jsx`:
```js
{
  name: "Bubble",
  affiliate: "https://bubble.io?via=YOUR-ID",  // ← put your affiliate link here
  ...
}
```

### 4. Styling
All components use CSS variables from your site's design system.
They will automatically adapt to your Lovable theme (light/dark mode included).

---

## Recommended Site Architecture

```
/ (homepage)
  └── NoCodeRecommendationWizard (hero section)
  └── SuccessStoryDatabase (social proof section)

/tools (hub page)
  └── MicrotoolDirectory (links to all tools)

/compare
  └── ComparisonMatrix

/calculators
  └── TCOCalculator
  └── ProjectPlanner

/pricing
  └── PricingTracker

/templates
  └── TemplateLibrary

/success-stories
  └── SuccessStoryDatabase
```

---

## Updating Data

All tool data lives at the top of each file in plain JS arrays.
No database needed — just edit the arrays to add/update tools.

Example: Add a new tool to ComparisonMatrix:
```js
const ALL_TOOLS = [
  // ...existing tools...
  {
    name: "Xano",
    category: "Backend",
    pricing: "$0–$99/mo",
    freeplan: true,
    aiFeatures: false,
    // ...fill in rest of fields
  }
];
```

---

## SEO Tips for Each Tool
- Add `<title>` and `<meta description>` to each tool's page
- The Recommendation Wizard results are great for dynamic OG images
- Embed tools inside long-form review articles to increase time-on-page
- Add schema markup (FAQ, HowTo) around the calculators

---

## Coming Soon (stub components in MicrotoolDirectory)
- Stack Compatibility Checker
- No-Code vs Custom Dev Calculator  
- Migration Cost Estimator
- AI Prompt Library
- Feature Prioritizer

These are listed as "Coming soon" in the Directory automatically.
Build them as separate `.jsx` files using the same pattern and swap `comingSoon: true` to `false`.
