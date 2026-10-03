# Prompt for Antigravity IDE — SocMgt SEO & Performance Improvements

Copy everything below the line into Antigravity.

---

You are working on the codebase for **SocMgt** (https://socmgt.com), a housing society management software website for India. It sells to committees, treasurers, estate managers, residents and guards. Its main goal is getting demo requests ("Request a Product Walkthrough" / "Book a Demo").

An SEO audit found the problems below. Fix **all** of them. Work through them in order and don't change the site's visual design, brand, or existing copy unless a task asks you to.

## Step 0: Understand the project first
1. Look at the project structure. Work out whether it's plain static HTML or uses a framework or build step, and find the hosting setup (Netlify, Vercel, Cloudflare Pages, Firebase, Apache `.htaccess`, Nginx, etc.).
2. List every HTML page. The sitemap includes: `/`, `visitors-security.html`, `billing-finance.html`, `help-desk-maintenance.html`, `resident-experience.html`, `committee-records.html`, `community-setup.html`, `billing-rules.html`, `visitor-management.html`, `committee-governance.html`, `request-walkthrough.html`, `community-planner.html`, `contact.html`, `features.html`, and possibly more.
3. Share a short plan before you start editing. Apply every fix site-wide (all pages), not only the homepage.

## Task 1: Fix the www vs non-www mismatch (high priority)
- The site loads at `https://www.socmgt.com/`, but the canonical tag, `og:url`, the sitemap and robots.txt all use `https://socmgt.com/`.
- Use **`https://socmgt.com`** (non-www, HTTPS) as the one main domain.
- Add a **301 permanent redirect** from `www.socmgt.com/*` to `https://socmgt.com/*`, keeping the path, plus HTTP → HTTPS. Use the right config for the host you found (`_redirects`, `netlify.toml`, `vercel.json`, `.htaccess`, nginx config, etc.). If DNS or hosting-panel changes are needed, write them in a `DEPLOYMENT-NOTES.md`.
- Check that every page has a **self-referencing canonical** (for example, `billing-finance.html` should point to `https://socmgt.com/billing-finance.html`, not the homepage).
- Check that `og:url` matches the canonical on every page.
- Make internal links consistent: use relative links or the non-www absolute URL, never `www.`.

## Task 2: Page speed and Core Web Vitals (high priority)
The homepage currently downloads about **4.9 MB** and takes about **9.5 s** to finish loading. Target: under 1.5 MB total and a Lighthouse mobile Performance score of 90+.
- Convert all PNG/JPG images in `/images/` to **WebP** (and AVIF where it helps). Keep the originals as fallbacks using `<picture>`.
- Resize images to the size they're actually shown at, with `srcset`/`sizes` for responsive versions. Specifically:
  - `logo.png` is 1024 px wide but shown small. Make a correctly sized version (or an SVG) under 10 KB.
  - `dashboard-web-mobile.png` (1672 px), `hero-community.jpg` (1376 px), `ecosystem-diagram.png` (1376 px), plus `architecture-setup.png`, `billing-meters.png`, `governance-vault.png`, and every `showcase-*.jpg`.
- The logo loads **twice** on the page (header and footer). Use one optimized file so it's cached.
- **Hero image (LCP):** don't lazy-load it. Add `fetchpriority="high"`, a `<link rel="preload" as="image">` in `<head>`, and explicit `width`/`height`.
- Put `loading="lazy"` and `decoding="async"` on every image below the fold, and set explicit `width`/`height` on **all** images to prevent layout shift (CLS).
- Fonts: if you use Google Fonts or Material Symbols, add `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`, use `display=swap`, and subset Material Symbols to **only the icons actually used** (the `icon_names=` parameter), or swap them for inline SVGs.
- Minify CSS and JS, defer non-critical JS (`defer`), and inline critical above-the-fold CSS if it's practical.
- Load Google Analytics (`G-X2JFX4XG44`) with `async`, and keep it.
- Add long-lived cache headers for static assets (`/images`, `/css`, `/js`) in the hosting config.

## Task 3: Hide icon-font text from search engines and screen readers
Material icon ligature names ("electric_meter", "shield", "payments", "qr_code_scanner", "calendar_month", "arrow_forward", etc.) show up as plain text in the page content, and Google indexes them as junk words.
- Add `aria-hidden="true"` to **every** icon element (for example `<span class="material-symbols-outlined" aria-hidden="true">`), on all pages.
- If an icon is the only content of a button or link, give that button or link an `aria-label`.

## Task 4: Strengthen headings and keywords
- Change the homepage **H1** from "One Platform to Run Your Entire Community." to something that includes the main keyword and keeps the brand voice, for example: **"Housing Society Management Software for Apartments, Gated Communities & RWAs"**. The old line can stay as a tagline or subheading.
- Each page needs **exactly one H1** containing that page's main keyword (for example "Society Maintenance Billing Software", "Visitor Management System for Housing Societies").
- Each page needs a **unique `<title>`** (50–60 characters, format `Primary Keyword | SocMgt`) and a **unique meta description** (140–160 characters, with a call to action). No duplicates across pages.
- Work target keywords naturally into H2s and body text: "society management software", "apartment management app", "RWA management software", "society maintenance billing", "visitor management system", "gated community software", "housing society accounting software India". Don't stuff keywords.
- Check that heading levels go in order (H1 → H2 → H3, none skipped) on every page.

## Task 5: Structured data (schema.org JSON-LD)
Keep the existing Organization + WebSite graph and extend it:
- **Organization:** add `sameAs` (placeholders for LinkedIn, Facebook, Instagram, YouTube, X, marked with `TODO` comments), `contactPoint` (email `info@socmgt.com`, `areaServed: "IN"`, `availableLanguage: ["en","hi"]`), and `address` if one is available.
- **SoftwareApplication** on the homepage and features page: `name`, `applicationCategory: "BusinessApplication"`, `operatingSystem: "Web, Android, iOS"`, `offers` (placeholder or "Contact for pricing"), `description`, `url`, `image`.
- **FAQPage** schema on the homepage, built from the existing "Questions from community teams" FAQ (all 6 questions). The answers must match the text on the page exactly.
- **BreadcrumbList** on every page except the homepage.
- **WebPage/Service** schema on each feature page.
- Test all JSON-LD for valid syntax, and tell me to confirm it with Google's Rich Results Test.

## Task 6: Replace the mailto lead form with a real form (conversion-critical)
The "Request a walkthrough" form currently opens the visitor's email app ("Open email to request a walkthrough"). Many visitors drop off here and GA4 can't track it.
- Change it to a proper form submission with the same fields: Full Name, Mobile/WhatsApp, Role, Total Society Units, Society/Apartment Name, City & State, and an optional Email field.
- Use whatever fits the hosting: Netlify Forms, a Vercel/Cloudflare serverless function, Formspree, or Google Apps Script → Google Sheet. **Never put API keys or secrets in front-end code.** Use environment variables and document them in `DEPLOYMENT-NOTES.md`.
- Add client-side validation (10-digit Indian mobile number, allowing an optional +91), a honeypot field for spam, a loading state, and clear success and error messages. Optionally redirect to `/thank-you.html` with `noindex`.
- Fire a GA4 event `generate_lead` on successful submit, with parameters `role` and `units_range`.
- Add a **WhatsApp click-to-chat** button (a `wa.me` link, number left as a `TODO` placeholder) as a second contact option, and track it with a GA4 event `whatsapp_click`.
- Track clicks on "Book a Demo" / "Request a Product Walkthrough" as a GA4 event `cta_click`.

## Task 7: New pages for rankings and trust
Create these pages with the same design system, header, footer, meta tags, canonical, OG tags and schema as the rest of the site:
1. **`/pricing.html`:** plans or a per-unit pricing structure. If prices aren't decided yet, use "Contact for pricing" with a plan comparison table and `TODO` placeholders.
2. **`/about.html`:** company story, mission, team placeholder, contact details (builds trust / E-E-A-T).
3. **`/blog/`:** a blog index page plus 3 starter article templates targeting long-tail keywords, with full outlines and draft intro paragraphs:
   - "How to Choose Society Management Software in India (2026 Guide)"
   - "Housing Society Maintenance Charges: How to Calculate & Collect Them"
   - "Visitor Management for Gated Communities: A Complete Guide for RWAs"
   Each gets `Article` schema, author, publish date, and internal links to the relevant feature pages.
4. **City landing-page template:** `/society-management-software-pune.html` as a model (then Mumbai, Bengaluru, Hyderabad, Delhi NCR, Chennai). Each city page needs genuinely unique local content (local RWA or co-operative society rules, for example the Maharashtra Co-operative Societies Act for Pune/Mumbai), not copy-paste. Build Pune fully and leave the others as clearly marked outlines.
5. **`/privacy-policy.html`** and **`/terms.html`** if they don't exist (needed for trust and for app-store and ad compliance). Use placeholder legal text marked for legal review.
6. **Testimonials / social proof section:** add a section structure on the homepage **with placeholders only**. Don't invent customer names, reviews or ratings. Mark it `TODO: add real testimonials`, and don't add Review/AggregateRating schema until real reviews exist.
7. A custom **`404.html`** page with links back to the main sections.

## Task 8: Internal linking, navigation and footer
- Nav items (Ecosystem, Suites, Security, Finance, Infrastructure, Resident Life, Governance, Planner) should link to real, crawlable feature pages (`<a href>`), not only JS-driven tabs or anchors.
- Add a full **footer** on every page: links to all feature pages, pricing, about, blog, contact, privacy, terms, and social icons (placeholders).
- Add breadcrumbs (visible plus schema) on inner pages.
- Link each feature page to 2–3 related feature pages and to the demo form.
- Use descriptive anchor text, never "click here".

## Task 9: Sitemap, robots and technical hygiene
- Update `sitemap.xml` with **all** pages (new ones included), each with `<lastmod>`, using only `https://socmgt.com` URLs. If the site grows, consider a sitemap index.
- Keep `robots.txt` as `Allow: /` with the sitemap line, and block only non-public paths if any exist (for example `/thank-you.html` via a meta `noindex`).
- Make sure every page has: `<html lang="en-IN">`, the viewport meta, charset, favicon set (favicon.ico, 32px PNG, apple-touch-icon 180px, `site.webmanifest`), and `theme-color`.
- Add `hreflang="en-IN"` and `x-default` alternates (self-referencing) on every page.
- Twitter card: check that `twitter:card=summary_large_image` and `twitter:image` are set on every page.
- OG image: make a proper **1200×630** social share image (WebP/JPG under 300 KB) with the brand and tagline, and use it site-wide. Pages can have their own image where it makes sense.
- Every image needs meaningful, keyword-aware alt text (keep what's already good), and decorative images get `alt=""`.
- Add security headers in the hosting config: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, and a sensible `Content-Security-Policy` that still allows GA4 and the fonts.

## Task 10: Accessibility and mobile checks
- Color contrast meets WCAG AA, every form input has a `<label>`, and focus states are visible.
- Tap targets are at least 44 px on mobile, and nothing scrolls horizontally at 360 px width.
- Target a Lighthouse Accessibility score of 95+.

## Task 11: Verify and report
When you're done:
1. Run Lighthouse (mobile and desktop) on the homepage and 2 inner pages, and report before/after scores for Performance, Accessibility, Best Practices and SEO.
2. Report total page weight and number of requests before and after.
3. Validate the HTML and all JSON-LD.
4. Confirm there are no broken internal links (run a link checker).
5. Write a **`SEO-CHANGELOG.md`** that lists every change by file, and a **`DEPLOYMENT-NOTES.md`** listing everything I must do by hand outside the code:
   - Set up the www → non-www redirect in DNS/hosting if it isn't handled in code.
   - Verify **both** `socmgt.com` and `www.socmgt.com` in **Google Search Console** (a Domain property), submit `sitemap.xml`, and request indexing for key pages.
   - Set up **Bing Webmaster Tools**.
   - Create and verify a **Google Business Profile**.
   - List SocMgt on software directories for backlinks: Capterra, G2, GetApp, TechnologyCounter, SoftwareSuggest, Techjockey.
   - Mark GA4 `generate_lead` as a key event (conversion).
   - Fill in every `TODO` placeholder (social links, WhatsApp number, pricing, testimonials, legal text).

**Rules:** Don't invent facts, customers, prices, reviews, ratings or statistics. Use clearly marked `TODO` placeholders instead. Don't remove existing content or features. Don't commit secrets. Keep the current look and branding.
