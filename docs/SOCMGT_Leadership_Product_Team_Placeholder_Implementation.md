# SOCMGT Marketing Website – Leadership & Product Team Placeholder Implementation

## Purpose

Implement a polished **Leadership & Product Team** section on the SOCMGT marketing website using **temporary placeholder team profiles**.

These profiles are only for development/staging so that the layout can be completed now.

When the real team information is available, the names, photos, titles, bios and profile links must be replaceable without redesigning the section.

---

# Critical Rule

## Use Existing Code First

Before creating or changing anything:

1. Inspect the existing SOCMGT marketing website.
2. Find the current **Leadership & Product Team** section.
3. Reuse the existing HTML structure, CSS classes, Tailwind classes, spacing, typography, colors, border radius and responsive behavior wherever possible.
4. Do not redesign unrelated sections.
5. Do not introduce a new framework.
6. Do not create duplicate CSS if existing utilities/components can be reused.
7. Do not modify backend application projects.
8. Do not modify mobile application code.
9. Do not change APIs, databases or subscription logic.
10. Only change the marketing website section required for this task.

---

# Plan Before Implementation

Before changing any file, Antigravity IDE must first inspect the current implementation and show an implementation plan.

The plan must identify:

- Existing HTML file containing the section
- Existing CSS/Tailwind styles used
- Existing icons
- Existing responsive behavior
- Whether images/avatars are currently supported
- Exact files that need modification
- Any reusable team/profile card styles already in the website
- Any risks or layout issues
- How the new placeholder content will behave on mobile/tablet/desktop

After showing the implementation plan:

> **STOP. DO NOT MODIFY ANY FILE.**

Display:

> **Implementation plan completed. No files have been modified. Please confirm before implementation.**

Only proceed after explicit user confirmation.

---

# Section Heading

Keep the existing title:

## Leadership & Product Team

Replace the current supporting text with:

> Meet the people helping shape SOCMGT — from product engineering and community onboarding to security, infrastructure and customer success.

Do not use claims that imply these placeholder people are real employees.

---

# Important Placeholder Rule

Every temporary profile must be clearly marked in the source code with:

```html
<!-- PLACEHOLDER TEAM PROFILE - REPLACE BEFORE PRODUCTION -->
```

Do not display the word "placeholder" to website visitors unless this is a staging environment.

The source code comment is mandatory.

Before production launch, these placeholder profiles must be replaced with real approved information.

---

# Card 1 – Product Engineering

## Placeholder Name

**Aarav Mehta**

## Role

**Head of Product Engineering**

## Responsibility

**Architecture, Web, Mobile & Core Systems**

## Short Bio

> Leads the technical architecture and product development of SOCMGT across web, mobile, APIs and cloud services, with a focus on reliability, scalability and user experience.

## Skill Tags

- Platform Architecture
- Web & Mobile
- Cloud

## Category Label

**Product Engineering**

## Icon

Use the existing user/product/engineering icon if one already exists.

Do not add a new icon library.

## Optional Action

**View Profile**

Only show a View Profile or LinkedIn button if a valid real URL exists.

For placeholder profiles:

- Do not link to a fake LinkedIn account
- Do not use `href="#"` if it causes page jumping
- Prefer hiding the action until a real profile exists

---

# Card 2 – Community Onboarding

## Placeholder Name

**Priya Nair**

## Role

**Community Success & Onboarding Lead**

## Responsibility

**Migration, Setup & Training**

## Short Bio

> Helps communities move from spreadsheets and manual processes into SOCMGT through structured onboarding, data migration, administrator training and go-live support.

## Skill Tags

- Onboarding
- Data Migration
- Training

## Category Label

**Community Onboarding**

## Icon

Reuse the current onboarding/support icon.

---

# Card 3 – Security & Compliance

## Placeholder Name

**Rohan Shah**

## Role

**Security & Compliance Lead**

## Responsibility

**Data Protection, Governance & Infrastructure**

## Short Bio

> Oversees platform security, access controls, auditability and infrastructure practices to help protect community information and maintain reliable operations.

## Skill Tags

- Security
- Access Control
- Audit

## Category Label

**Security & Compliance**

## Icon

Reuse the current shield/security icon.

---

# Recommended Card Structure

Each card should contain, in this order:

1. Category/Icon area
2. Avatar or profile image placeholder
3. Name
4. Job title
5. Responsibility line
6. Short 2–3 line biography
7. Skill tags
8. Optional profile/social action only when a real URL exists

Example structure:

```text
[Category Icon]

[Avatar]

Aarav Mehta
Head of Product Engineering

Architecture, Web, Mobile & Core Systems

Leads the technical architecture and product development of SOCMGT...

[Platform Architecture] [Web & Mobile] [Cloud]
```

---

# Avatar / Image Handling

For now, use one of the following in this priority order:

1. Existing generic avatar component already used by the website
2. Initials inside a circular avatar
3. Existing local placeholder image already available in the project

Recommended initials:

- Aarav Mehta → **AM**
- Priya Nair → **PN**
- Rohan Shah → **RS**

Do not:

- Download random people's photographs
- Use copyrighted headshots
- Use real people's LinkedIn photos
- Create fake employee photographs without approval

The placeholder design should be easy to replace later with a real `<img>`.

---

# Improve the Current Large Colored Bar

The current screenshot uses very large colored horizontal strips.

Reduce their visual dominance.

Preferred approach:

- Small colored icon container
- Small category badge
- Thin accent line
- Subtle avatar ring

Do not use a large full-width colored band unless it is required by the existing design system.

The profile name and role should become the visual focus.

---

# Recommended Desktop Layout

Use a responsive 3-column card grid:

```text
Product Engineering | Community Onboarding | Security & Compliance
```

Cards should:

- Have equal height
- Align names and role sections
- Use consistent padding
- Use consistent border radius
- Use subtle borders/shadows matching the existing website
- Avoid excessive vertical whitespace

---

# Tablet Layout

Use either:

- 2 columns + 1 centered card

or

- 1 column if the existing breakpoints already work better

Do not introduce unnecessary custom breakpoints if Tailwind/current CSS already provides them.

---

# Mobile Layout

Use a single-column stack.

Requirements:

- No horizontal scrolling
- Full name must remain visible
- Titles should wrap naturally
- Bios should remain readable
- Tags should wrap
- Cards should not be excessively tall
- Maintain comfortable side margins

---

# Recommended Visual Style

Preserve the existing SOCMGT website design language.

Suggested accent mapping:

- Product Engineering → Blue
- Community Onboarding → Green
- Security & Compliance → Purple

Only use existing site colors/utilities where possible.

Do not introduce arbitrary colors that break brand consistency.

---

# Accessibility Requirements

Ensure:

- Proper heading hierarchy
- Sufficient text contrast
- Icons have accessible labels if necessary
- Decorative icons use appropriate `aria-hidden`
- Profile cards remain keyboard accessible if links/buttons exist
- No information is communicated by color alone
- Text remains readable at zoom
- Buttons have visible focus states

---

# Optional Future Expansion

The section should be designed so it can later grow from 3 profiles to 6 without redesigning the whole section.

Possible future roles:

1. Product Engineering
2. Community Onboarding
3. Security & Compliance
4. Customer Success
5. Finance & Billing
6. Business Development

Do not add these additional cards now unless requested.

---

# Content Integrity

Because these profiles are temporary:

Do not claim:

- years of experience
- previous employers
- certifications
- LinkedIn profiles
- customer achievements
- awards
- qualifications
- RWA positions
- security certifications

unless real verified information is provided later.

---

# Implementation Scope

Allowed:

- Update current Leadership & Product Team HTML
- Adjust local section-specific styling if genuinely required
- Reuse existing responsive utility classes
- Add source-code placeholder comments
- Add initials-based temporary avatars
- Add approved placeholder text

Not allowed:

- Redesign the entire About page
- Change site-wide fonts
- Change global navigation
- Change pricing
- Change footer
- Change contact forms
- Change analytics
- Change backend code
- Change application code
- Change databases
- Change APIs
- Add third-party libraries

---

# Testing After Implementation

After implementation, test:

## Desktop

- 3 cards aligned correctly
- Equal heights
- Bios readable
- Tags aligned
- No unnecessary oversized bars
- Section fits naturally with surrounding content

## Tablet

- Cards rearrange correctly
- No clipping
- No overflow
- Reasonable spacing

## Mobile

- Single-column layout
- No horizontal scrolling
- Name/title wrapping works
- Tags wrap correctly
- Avatar remains centered/aligned
- No button overflow

## Functional

- No broken links
- No fake LinkedIn URLs
- No `href="#"` page-jump behavior
- No console errors introduced

## Regression

Verify:

- Header still works
- Footer still works
- Navigation still works
- Other About page sections remain unchanged
- Existing CSS remains stable

---

# Post-Implementation Report

After implementation, Antigravity IDE must report:

1. Files changed
2. Exact section changed
3. Reused styles/components
4. Any new classes added
5. Responsive test results
6. Mobile test results
7. Console error results
8. Any remaining placeholder content
9. Confirmation that no unrelated project/module was changed

---

# Final Placeholder Content

## Aarav Mehta

**Head of Product Engineering**

Architecture, Web, Mobile & Core Systems

> Leads the technical architecture and product development of SOCMGT across web, mobile, APIs and cloud services, with a focus on reliability, scalability and user experience.

Tags:

`Platform Architecture` `Web & Mobile` `Cloud`

---

## Priya Nair

**Community Success & Onboarding Lead**

Migration, Setup & Training

> Helps communities move from spreadsheets and manual processes into SOCMGT through structured onboarding, data migration, administrator training and go-live support.

Tags:

`Onboarding` `Data Migration` `Training`

---

## Rohan Shah

**Security & Compliance Lead**

Data Protection, Governance & Infrastructure

> Oversees platform security, access controls, auditability and infrastructure practices to help protect community information and maintain reliable operations.

Tags:

`Security` `Access Control` `Audit`

---

# Exact Antigravity IDE Workflow

## Phase 1 – Inspect and Plan Only

Use this instruction:

> Inspect the existing SOCMGT marketing website and locate the current Leadership & Product Team section. Reuse the current design system and existing code first. Identify the exact HTML/CSS/JavaScript files involved, the current responsive behavior, existing icons/components, and the minimum changes required to replace the current department-only cards with the approved temporary profile cards. Do not modify any file. Show the complete implementation plan first.

Then display:

> **Implementation plan completed. No files have been modified. Please confirm before implementation.**

STOP.

---

## Phase 2 – Implement After Confirmation

After the user confirms:

> Implement the approved Leadership & Product Team placeholder section exactly as specified. Reuse existing code and styles first. Add the three temporary profiles, source-code placeholder comments, initials-based avatars if no existing avatar component is available, responsibilities, biographies and skill tags. Reduce the dominance of the large colored strips while preserving SOCMGT's existing visual design. Keep the layout responsive, do not modify unrelated sections, and perform desktop, tablet, mobile and regression testing.

---

# Production Replacement Reminder

Before the website goes live with real leadership information:

Replace:

- Aarav Mehta
- Priya Nair
- Rohan Shah

with approved real team details.

Also replace:

- Temporary initials/avatar
- Placeholder role wording
- Temporary bio
- Temporary skill tags

Only add real social/profile links after they have been verified.

The final production website must not represent fictional people as actual SOCMGT employees.
