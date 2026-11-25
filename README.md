# Vivid Nutripharm

Version: 1.2.0 (see `VERSION`)

The static marketing website for **Vivid Nutripharm**, a nutraceutical manufacturing partner. It covers private label, white label and bulk-ingredient work. The site started as a mirror of the live WordPress build and has been extended by hand. It is plain HTML, CSS and JavaScript with no build step, and is set up for GitHub Pages.

## Repository layout

```text
.
├── index.html                       # Home
├── about-us.html                    # About Us
├── solutions.html                   # Solutions (private / white label paths)
├── contact.html                     # Contact + enquiry form
├── durt-cordyceps-range.html        # Cordyceps bulk range + benefits system map
├── chronic-disease-management.html  # Category page
├── mens-sexual-wellness.html        # Category page
├── women-wellness.html              # Category page
├── oral-sprays-2.html               # Category page
├── effervescent.html                # Category page
├── phytosomes.html                  # Category page
├── mushroom-tinctures.html          # Category page
├── single-extracts.html             # Category page ("Wellness essentials")
├── design-explorations/
│   └── cordyceps-benefits-variants.html  # Design sandbox: four alternative Cordyceps benefit layouts (not linked from the site)
├── assets/                          # Large images are WebP (converted from PNG, same dimensions)
│   ├── cert-orbit.css               # Styles for the certification badge orbit
│   ├── vivid-logo-trimmed.webp       # Header logo, cropped to the visible mark
│   ├── product-disc.webp, cordyceps-subject.webp, product-lifecycle.webp,
│   │   certification-badges-transparent.webp
│   ├── products/                    # Local product and hero images (sprays, tinctures, phytosomes, effervescents, Cordyceps)
│   └── wp/                          # Files copied from the original WordPress site
│       ├── uploads/2026/07, 08/     #   Product, category, process, team, facility and certification images
│       ├── themes/astra/            #   Astra theme CSS (main.min.css) and JS (frontend.min.js)
│       └── includes/js/             #   WordPress emoji scripts
├── VERSION
├── .nojekyll                        # Tells GitHub Pages to serve files as-is
└── .gitignore
```

## Pages

### Company pages

| Page | File | Notes |
|---|---|---|
| Home | `index.html` | Hero (proof stats + "Request a Quote"), capabilities grid, technology platforms, grouped product browser, inline quote strip, reviews, team, facilities, certifications, contact form, FAQ, mobile sticky quote bar |
| About Us | `about-us.html` | Company story, quality standards, integrated capabilities, approach |
| Solutions | `solutions.html` | Two solution paths, partner types, development journey, categories, delivery formats |
| Contact | `contact.html` | Contact details, map links, enquiry form |

### Product range pages

Each category page builds its product grid from a `products` array in an inline `<script>`. Each entry holds `id`, `name`, `img`, `specs`, `cardDesc`, `desc`, `meta` and `ingredients`. Clicking a card opens a detail modal, and **Request a quote** opens the enquiry modal.

| Page | File | Products |
|---|---|---|
| Cordyceps Range | `durt-cordyceps-range.html` | 6: Filaments (dried fruiting bodies), Double Extract Tincture (Cordy Amrit), Extract Powder (Cordy Maxx), Tablets/Capsules (Eucordy), Cordyceps + Green tea (Aarogya), Cordyceps + Coffee (Cordy Verve) |
| Chronic Disease Management | `chronic-disease-management.html` | 10: Pronefros, Diastat-V, Mobivive, Respran, Tarnil, Lipoblitz, Dozein, V-Sinura, Fix & Flexx, Vivacio |
| Men's Sexual Wellness | `mens-sexual-wellness.html` | 5: Naturise, Eternax, Gear Up, 'Y' Vibe, Axtro-T |
| Women Wellness | `women-wellness.html` | 4: Ovalush, Pristine-V, Ovabliss, Luminova |
| Oral Sprays | `oral-sprays-2.html` | 13: Vitamin D3K2, Multivitamin, Vitamin C, Iron, ZMA, Sleep, Mind Focus, ED, Testoboost, VO2 Maxx, Smoker's Cough, Dry Mouth, Biotin |
| Effervescent | `effervescent.html` | 4: Instant Sex Drive, Gut Health Probiotics, Weight Loss Probiotics, Molecular Hydrogen |
| Phytosomes | `phytosomes.html` | 3: Phytocurcumin, Phytoberine, Phytomarin |
| Mushroom Tinctures | `mushroom-tinctures.html` | 3: Cordyceps (Cordy Amrit), Lion's Mane, Reishi |
| Wellness essentials | `single-extracts.html` | 10: Ashwagandha, Cordy curcumin+, Punarnava, Vasaka, Hing, Triple Magnesium, Omega-3, Digestive Mints, Energy Booster, Revitacel |

### Deep links

A product's detail modal can be opened straight from a URL with `page.html#product-id`. The pages listen for `hashchange`, so the links work on load and while the page is open. For example:

- `chronic-disease-management.html#ckd`
- `oral-sprays-2.html#vitamin-d3k2`
- `single-extracts.html#hing`

The `id` values come from each page's `products` array (listed in the table above by name).

## Editing content

- **Product copy, specs and ingredients:** edit the `products` array near the bottom of the category page. The grid, modal and quote form all read from it.
- **FAQs:** category pages render their FAQ list from inline data into `#faq-list`.
- **Cordyceps benefits:** the interactive system map in `durt-cordyceps-range.html` is driven by an inline list of benefit entries (`title` and description). Alternative layouts are kept in `design-explorations/`.
- **Images:** put new local images under `assets/products/`. Use WebP for large images (quality 88–95 keeps them visually identical), and keep PNG only for favicons and small graphics. Images copied from WordPress are under `assets/wp/uploads/`. When you replace an image that browsers have already cached, add a cache-busting query (for example `?v=2`).
- **Primary action colour:** leaf green `#7cc242` with deep-green text is reserved for "Request a Quote" (header, hero, quote strip, form). Secondary actions are text links.
- **Shared header and footer:** these are duplicated in every HTML file. The header hides while scrolling down and returns on scroll up. A change to navigation, contact details or the footer has to be made in each page.

## External dependencies

All styles, scripts and images are stored in this repository. The original WordPress files live under `assets/wp/`, so the site no longer depends on the WordPress host. The only outside services are:

- **Google Fonts:** loaded from `fonts.googleapis.com` and `fonts.gstatic.com`.
- **Google Maps:** contact and footer address links open Google Maps.
- **Social links:** Facebook, Instagram, LinkedIn and X/Twitter.

## Forms

None of the forms send data yet:

- **Contact forms** (`index.html`, `contact.html`) validate input, show a success message and reset.
- **Request a quote** modals (all category pages) enforce minimum order quantities of **10 kg** for bulk units and **500 units** for finished units, then show a confirmation. The submit handlers contain a `TODO` to connect a WordPress form handler or AJAX endpoint.

Until a backend is connected, enquiries should go to `info@vividnutripharm.com` / `marketing@vividnutripharm.com` or the phone numbers on the Contact page.

## Local preview

Run a static server from the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a server rather than opening files with `file://`, so relative paths and hash deep links behave as they do in production.

## Deployment

The site is deployed with GitHub Pages from the repository root. `.nojekyll` stops Jekyll from processing the files. All internal links are relative, so the site also works from a project sub-path.

To release:

1. Update `VERSION` (and the version line at the top of this README) for notable changes.
2. Merge to the default branch. GitHub Pages republishes automatically.

## Known issues and cleanup opportunities

- Header and footer markup is copied into every page, so the pages can drift apart.
- `solutions.html` is about 1 MB because it embeds three base64 JPEG images. Moving them into `assets/` would make the page much lighter.
- The Cordyceps products section heading says "Seven forms", but the page now lists six products, since Dried Cordyceps Powder was removed.
- The footer **Privacy Policy** and **Terms & Conditions** links still point to the old WordPress host, and both pages return 404 there. They need real pages added to this repo.
- Forms are placeholders (see above).
