# Vivid Nutripharm

Version: 1.1.0

A static marketing website for Vivid Nutripharm, based on the live WordPress site and prepared for GitHub Pages hosting.

## Project purpose

This repository contains a front-end mirror of the public Vivid Nutripharm website. The pages are static HTML files that preserve the original product structure, category layout, and content flow while making the site easier to host and maintain.

## Included pages

| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about-us.html` |
| Solutions | `solutions.html` |
| Contact | `contact.html` |
| Cordyceps Range | `durt-cordyceps-range.html` |
| Mushroom Tinctures | `mushroom-tinctures.html` |
| Oral Sprays | `oral-sprays-2.html` |
| Phytosomes | `phytosomes.html` |
| Chronic Disease Management | `chronic-disease-management.html` |
| Men's Sexual Wellness | `mens-sexual-wellness.html` |
| Women Wellness | `women-wellness.html` |
| Effervescent | `effervescent.html` |
| Wellness essentials | `single-extracts.html` |

The product catalog spans multiple category pages, with product detail panels triggered from the listing views. Product tiles can deep-link directly to a specific item using the pattern `page.html#product-id`.

Recent content updates standardize the public product branding across the homepage and category pages, including the chronic disease brands Pronefros, Diastat-V, Mobivive, Respran, Tarnil, Lipoblitz, Dozein, V-Sinura, Fix & Flexx, and Vivacio. The men’s and women’s wellness ranges also include their updated branded product names and formulation copy.

## Design notes

- The homepage process graphic and the Cordyceps benefits illustration are rebuilt as inline SVG rather than flattened images.
- These vector graphics remain crisp at any zoom level and are much lighter than the original raster assets.
- Supporting images used in the design are stored under `assets/`.

## Dependencies and hosting

Most CSS, JavaScript, and image assets are loaded from the live WordPress site at `skyblue-echidna-752271.hostingersite.com`. That means the static pages depend on the external site for non-local styling and scripts.

A few local assets are included in this repo, such as:

- `assets/product-disc.png`
- `assets/cordyceps-subject.png`

The site also includes the updated “Wellness essentials” range, Cordyceps products named Cordyceps extract + Green tea (Aarogya) and Cordyceps extract + Coffee (Cordy Verve), and homepage review content.

## Local preview

To preview the site locally, run a simple static server from the project root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Known limitations

- Contact, home page and product quote forms send enquiries to info@vividnutripharm.com through FormSubmit (`assets/forms.js`). The first submission triggers a one-time activation email to that inbox; enquiries are only delivered after the link in it is clicked.
- For direct contact, use the published phone numbers or the email address `info@vividnutripharm.com`.

## Deployment

This repo is intended for GitHub Pages deployment as a static site. For production hosting, make sure the site is configured to serve the root folder and preserve relative paths for assets and pages.
