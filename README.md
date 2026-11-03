# WELLWOOD Stabilizer — website clone

A pixel-faithful rebuild of the four supplied Wellwood Stabilizer screens, as a
static, dependency-free website.

## Pages

| File | Screen it reproduces |
|------|----------------------|
| `index.html` | Home / landing page (hero, stabilizer + TV LED carousels, about band, how it works, why choose us, before & after, reviews, contact CTA, footer) |
| `products.html` | Product showcase (TV LED hero slider, “Explore Our Range” band, filter sidebar + product grids, red feature bar, compact footer) |
| `about.html` | About page (hero with mission card, vision/values strip, animated stats band, contact CTA, footer) |
| `contact.html` | Contact page (hero + WhatsApp card, contact details, message form, “Visit Our Store” with map, footer) |

Open `index.html` in a browser — no server or build step required.

## Design fidelity

* **Colours** sampled from the mockups: brand red `#cf0117`, deep reds `#a80612 / #8c040d`,
  navy `#131e2a`, ink headings `#16202e`, soft pinks `#fdf6f6 / #fdeff1`,
  borders `#e8edf2`, page neutrals `#f7f9fb`.
* **Type**: Poppins (headings) + Inter (body), self-hosted and base64-embedded in
  `assets/css/fonts.css`, so the site renders identically offline.
* **Images**: every product photo, TV, hero photo, store front, map, review avatar
  and the logo were lifted from the supplied screenshots (cropped, upscaled and
  cleaned) — nothing was substituted with stock imagery. They live in `assets/img/`.
* Section order, copy, phone numbers, address, labels, iconography and layout
  proportions follow the mockups.

### Type scale (measured, at 1440 px)

Heading sizes were solved from the mockups by measuring the pixel width of each
heading in the supplied screens and dividing by the same string's width in the
real webfont (`canvas.measureText`), so they match the screens rather than the eye:

| Element | Size |
|---|---|
| Hero `h1` — landing / contact / about | 45 px / 61 px / 52 px |
| Section `h2` — small bands (how it works 24, reviews 21, before & after 29) | 21–29 px |
| Section `h2` — default | 29 px (`clamp(23px, 2.15vw, 29px)`) |
| “Our Contact Details” | 40 px |
| “Explore Our Range” (products) | 57 px |
| Body copy / lead paragraphs | 17 px (19 px in the products range band) |

Layout was then matched section-by-section against the screens. Every page is now
within a few pixels of its mockup at 1440 px:

| Page | Built | Mockup |
|---|---|---|
| index | 3477 px | 3495 px |
| products | 2149 px | 2160 px |
| contact | 1368 px | ~1370 px |
| about | (mockup is a viewport capture) | — |

Section heights on the landing page line up individually too: the red “why choose us”
band (294 px), before & after + reviews (541 px), the red contact CTA (289/299 px)
and the footer (186 px) all match the screen.


## Animations

Buttons (`.btn`, `.icon-btn`, social + WhatsApp cards):

* lift + coloured glow on hover, “sheen” sweep across the surface,
  arrow slides right, press-down state, and a click **ripple**.

Page-level motion:

* scroll-reveal with stagger, floating hero photo, pulsing “We’re Just a Call Away” pin,
  bobbing WhatsApp icon, card hover lift, animated star/stat counters (`5000+`, `10+`, `100%`),
  sticky header that shrinks and gains a shadow, mobile slide-in menu,
  product carousels (arrow scroll), auto-playing product-page hero slider,
  live filter checkboxes, form validation + “message sent” toast.
* Everything respects `prefers-reduced-motion`.

## Structure

```
wellwood/
├── index.html · about.html · products.html · contact.html · admin.html · 404.html
├── server.js         (lightweight zero-dependency dev server)
├── package.json      (scripts & metadata for npm / deployment)
├── .gitignore        (standard exclusions for git repos)
├── robots.txt        (search engine crawler rules)
├── sitemap.xml       (SEO sitemap)
└── assets/
    ├── css/fonts.css     (embedded woff2 fonts)
    ├── css/style.css     (all styling: tokens, components, responsive)
    ├── js/main.js        (interactions/animations)
    └── img/              (optimized image assets)
```

## Running Locally

```bash
# Option 1: Using Node
node server.js

# Option 2: Using npm
npm start
```
Then visit `http://localhost:3000`.

## Deployment & Hosting Guide

The project is completely static and dependency-free, making it 100% production-ready for any host:

* **GitHub Pages**:
  1. Push this repository to GitHub.
  2. In your repo, go to **Settings** > **Pages**.
  3. Under **Branch**, select `main` (or `master`) and `/ (root)`, then click **Save**.
  4. Your website will be live in minutes.
* **Netlify / Vercel / Cloudflare Pages**:
  - Connect your GitHub repository.
  - Build command: *(leave empty)*
  - Publish directory: `.` (root)
* **cPanel / Apache / Nginx**:
  - Upload all files directly to `public_html` or web root.

Responsive breakpoints: 1180 / 1024 (tablet, drawer nav, stacked layouts) and 720 (phone).

> Note: the site is a front-end build — the contact forms validate and show a
> success toast but do not post to a backend.
