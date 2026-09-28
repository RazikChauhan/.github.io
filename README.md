# SocMgt marketing website — offline and launch package

## Run offline

Unzip and open `index.html`. The homepage and 14 linked topic pages, including the planner and walkthrough request, use local files. The layout, images, CSS, fonts, calculator and interactive walkthroughs work without an internet connection. The folder layout must remain intact. The demo request opens a draft addressed to `info@socmgt.com`; the visitor must send that email from their own email app. The page does **not** save leads or send email itself.

## Public content and evidence

The copy describes SocMgt's product scope in plain language. Photos, diagrams and selectable scenarios are concept illustrations, not customer screenshots, live metrics, benchmark results or proof of deployed integrations. The former sample society, revenue, uptime, ratings, tax/compliance certification, gateway settlement, gate-speed and service-latency claims have been removed. Some visual diagrams still depict possible capabilities such as e-voting or automated utility dispatch; each is captioned as a concept illustration. Community-owned online payment connections and QR registration are described as rollout items, not generally available promises. Confirm each feature's actual availability during a walkthrough.

This package does not contain private production usage data. If SocMgt later collects consented, verified case studies, add them with source, date, customer permission and measurement method.

## Included files

- `index.html`: same Stitch-based page structure and visual styling, updated copy, metadata, schema and footer links.
- 14 root-level HTML pages: dedicated details for every link in the footer's Explore SocMgt, Learn More and Company columns. Every page follows the approved Visitors & Security layout, uses a compact hero image, and has unique metadata, a breadcrumb, module details and FAQs.
- `css/`, `fonts/`, `images/`: all local styles, fonts and original imagery. The offline Tailwind CSS bundle was regenerated from all 15 HTML pages so their utility classes render consistently.
- `js/app.js`: scenario widgets, planning calculator and email draft behavior.
- `robots.txt`, `sitemap.xml`: deployment files for the public root of `https://socmgt.com/`, with all 15 URLs listed in the sitemap.
- `SEO-LAUNCH.md`: deployment and search setup checklist.
- `docs/`: supplied design reference and asset inventory. The old HTML with invented claims was removed to prevent accidental publication.

## Deployment

Copy the contents of this folder to the public root of the canonical host. If the site is hosted at a different final URL, change the canonical, Open Graph URL/image, JSON-LD URLs, sitemap URL and robots Sitemap line together. Do not publish the public marketing page behind login or `noindex`. An offline `file://` page cannot be indexed by a search engine.
