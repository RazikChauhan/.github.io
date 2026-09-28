# SocMgt SEO launch checklist

## Already implemented in this package

- Unique titles and descriptions for the homepage and all 14 topic pages, focused on each page's actual question or workflow.
- One H1 per page, descriptive H2 sections and readable FAQs visible in the HTML without JavaScript.
- Canonical URL, Open Graph/Twitter sharing metadata, meaningful image alt text, local image dimensions and a locally hosted CSS/font bundle.
- Organization and WebSite JSON-LD on the homepage, plus WebPage and BreadcrumbList data on each detail page. No invented reviews, prices or ratings.
- Working HTML footer links, breadcrumbs, related links, `robots.txt` and a 15-URL `sitemap.xml` matching the canonical host.
- Customer and performance figures are excluded because no verified production dataset was supplied.

## Complete when publishing to socmgt.com

1. Point `socmgt.com` to the real website, use HTTPS, and redirect the other hostname and any old URL to the canonical URL. If the canonical host differs, update every absolute URL in the page, sitemap and robots file.
2. Verify that the homepage, all 14 `.html` pages, `/robots.txt`, `/sitemap.xml` and all `images/`, `css/`, `fonts/` and `js/` URLs return 200 to unauthenticated visitors. Keep all URL paths and capitalization exact.
3. Verify the domain in Google Search Console, submit `https://socmgt.com/sitemap.xml`, inspect representative pages and request indexing. Use the Rich Results Test for JSON-LD and PageSpeed Insights/Core Web Vitals for performance.
4. Test the email draft on desktop and mobile; for dependable lead capture, add a consented form endpoint and privacy notice before replacing mailto behavior. Publish real privacy/terms pages after review; do not link placeholders.
5. Review module availability, app login URL, gateway provider, pricing and geographic coverage with the product team before adding claims. Do not publish certifications, reviews, customer counts, financial results or SLAs without evidence.
6. As the product launches, update each topic page with verified product screenshots and answers from real customer questions. Consolidate pages if their content becomes repetitive.
7. Monitor Search Console indexing, queries, pages and errors monthly; improve pages from genuine user questions and product changes. SEO cannot guarantee rankings or replace reliable hosting and useful content.
