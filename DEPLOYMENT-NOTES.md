# SocMgt Deployment & SEO Operational Playbook

This document details all external setup steps, manual verifications, DNS configurations, and third-party registrations required outside the codebase.

---

## 1. Domain & DNS Configuration (www → non-www 301 Redirect)

The canonical domain for SocMgt is **`https://socmgt.com`** (non-www, HTTPS).

### Cloudflare / DNS Provider Setup:
1. **Root Domain (`@` / `socmgt.com`):** Point to your production web host (e.g. Azure Static Web Apps `ALIAS` or `CNAME`, or Cloudflare Pages).
2. **Subdomain (`www`):**
   - Add a CNAME record: `www` pointing to `socmgt.com`.
   - In Cloudflare (or DNS host), create a **Redirect Rule** or **Page Rule**:
     - **Match:** `http://www.socmgt.com/*` and `https://www.socmgt.com/*`
     - **Action:** Permanent Redirect (301) to `https://socmgt.com/$1`
3. **HTTP to HTTPS:** Enforce "Always Use HTTPS" and HSTS (Strict-Transport-Security).

### Web Server & Host Configuration Included in Repository:
- **Azure Static Web Apps:** [`staticwebapp.config.json`](file:///c:/ProjectSM/GitHubWeb/.github.io/staticwebapp.config.json) handles security headers, 404 rewrite, and route normalization.
- **Cloudflare Pages / Netlify:** [`_redirects`](file:///c:/ProjectSM/GitHubWeb/.github.io/_redirects) enforces 301 permanent redirect from `www.socmgt.com/*` to `https://socmgt.com/*` and [`_headers`](file:///c:/ProjectSM/GitHubWeb/.github.io/_headers) enforces 1-year immutable caching for static assets.
- **Vercel:** [`vercel.json`](file:///c:/ProjectSM/GitHubWeb/.github.io/vercel.json) specifies host redirects and security headers.

---

## 2. Google Search Console & Bing Webmaster Setup

1. **Google Search Console (GSC):**
   - Add a **Domain Property** for `socmgt.com` via DNS TXT verification. This automatically covers `socmgt.com`, `www.socmgt.com`, and all subdomains.
   - Submit Sitemap: `https://socmgt.com/sitemap.xml`.
   - Use the **URL Inspection** tool on `https://socmgt.com/` and the primary suite pages (`/visitors-security.html`, `/billing-finance.html`, `/pricing.html`, `/society-management-software-pune.html`) to request initial indexing.
2. **Bing Webmaster Tools:**
   - Import your verified profile directly from Google Search Console or verify via DNS TXT.
   - Submit `https://socmgt.com/sitemap.xml`.

---

## 3. Google Analytics 4 (GA4) Conversion Configuration

Measurement ID **`G-X2JFX4XG44`** is embedded across all pages.

### Steps to mark Key Events (Conversions):
1. Open [Google Analytics](https://analytics.google.com/) -> **Admin** -> **Data Display** -> **Events**.
2. Locate the following custom events once received, or pre-configure them under **Key Events**:
   - **`generate_lead`**: Mark as **Key Event (Conversion)**. (Triggered on successful walkthrough request submission, passing `role` and `units_range`).
   - **`cta_click`**: Track user engagement on primary demo buttons.
   - **`whatsapp_click`**: Track WhatsApp chat initiations.

---

## 4. Google Business Profile & Local Search Presence

1. Register a **Google Business Profile** under "SocMgt" (Software Company / Corporate Office).
2. Add website: `https://socmgt.com`.
3. Add service areas: India, Maharashtra (Pune, Mumbai), Karnataka (Bengaluru), Telangana (Hyderabad), Delhi NCR, Tamil Nadu (Chennai).
4. Add operating hours and primary contact email `info@socmgt.com`.

---

## 5. Directory Backlinks & Citation Strategy

To establish domain authority and E-E-A-T for housing society software in India, submit verified listings on:
- **Capterra India / Gartner Digital Markets**
- **G2 Crowd**
- **GetApp**
- **SoftwareSuggest India**
- **Techjockey**
- **TechnologyCounter**

---

## 6. Action Items & `TODO` Placeholders to Update

When official social handles, commercial telephone numbers, and legal counsel approvals are finalized, replace the marked `TODO` tags in the codebase:

| Item | Location | Placeholder in Code | Action Needed |
| :--- | :--- | :--- | :--- |
| **WhatsApp Number** | `index.html`, `request-walkthrough.html`, `thank-you.html` | `wa.me/919023064942` | Configured with live WhatsApp number `+91 90230 64942` |
| **Social Media Profiles** | All page footers & `index.html` JSON-LD | `linkedin.com/company/socmgt`, `twitter.com/socmgt`, etc. | Update with live company handles or remove uncreated networks |
| **Customer Testimonials** | `index.html` (`#testimonials`) | `TODO: add real testimonials with customer permission` | Replace quote placeholders with consented customer case studies and names |
| **Commercial Pricing** | `pricing.html` | `TODO: Add verified per-unit pricing upon commercial launch` | Update per-unit subscription numbers once pricing goes public |
| **Legal Review** | `privacy-policy.html`, `terms.html` | `Notice: Subject to final corporate legal counsel review` | Review terms with corporate attorney prior to commercial contracts |
| **Form Backend API** | `index.html`, `request-walkthrough.html` | Form `action` fallback | Connect form action URL to Netlify Forms, Formspree, or cloud serverless API |

---

## 7. Structured Data Testing Confirmation

Test URLs using [Google's Rich Results Test](https://search.google.com/test/rich-results) and [Schema.org Validator](https://validator.schema.org/):
- **Homepage:** Confirms `Organization`, `WebSite`, `SoftwareApplication`, and `FAQPage` (all 6 questions).
- **Inner Pages:** Confirms `BreadcrumbList`, `WebPage`, and `Service`.
- **Blog Articles:** Confirms `Article` schema with publisher logo and timestamps.
