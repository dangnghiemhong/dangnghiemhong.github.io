# What a good personal website needs

A personal website for an AI researcher / developer is a **landing page for people who already
have a question about you**: an admissions committee, a PI, a recruiter, a collaborator, or a
stranger who found one of your posts. It succeeds when it answers that question quickly, backs
the answer with evidence, and then gets out of the way.

Every requirement below has a **test**, so "good" can be checked instead of argued. Two
different kinds of claim are mixed here, and it is worth being honest about which is which:

- **Standards-backed** (accessibility, performance, SEO mechanics): measurable; failing them is a defect.
- **Judgement** (aesthetics, tone, information order): informed convention, not measured fact.
  Marked *(judgement)*.

## Who visits, and what they need

| Visitor | Question in their head | Time they give you | What settles it |
|---|---|---|---|
| Admissions committee / PI | Is this person a credible researcher in my area? | seconds, then minutes | Affiliation, interests, papers, projects with evidence, writing quality |
| Recruiter / hiring manager | Can this person build and ship? | seconds | Role, stack, shipped projects with code/demo links, CV |
| Collaborator / peer | What do they work on, how do I reach them? | a minute | Research focus, recent work, one clear contact route |
| Reader (blog) | Is this post correct and worth my time? | until bored | Substance, readable code/math, dates, a way to follow along |
| Search engines / link previews | What is this page, who is it by? | automated | Titles, descriptions, structured data, social cards |

## Requirements

### R1. Identity in five seconds
Name, current position and affiliation, research focus, and a way to contact you or get the CV
must be visible **without scrolling** on a laptop and a phone.
*Test:* open the home page at 1280×720 and 390×844; all four are on screen.

### R2. Evidence over adjectives
Claims link to artifacts: code, paper, demo, post. "Passionate about AI" is noise; a repository
with a README is signal. Skill bars and self-rated percentages are meaningless and are not used.
*Test:* every project and publication entry carries at least one outbound artifact link.

### R3. Honest completeness
No "coming soon", no empty sections, no placeholder text, no dead links. A section appears when
it has content and is invisible otherwise. An empty section reads as abandonment.
*Test:* the build renders no section with zero entries; `htmlproofer` (see the README) reports no broken internal links before you publish. There is no CI, so this is a manual step.

### R4. Fast and light
Static pages, no framework runtime, no third-party requests (fonts, scripts and icons are
self-hosted: faster, private, and no GDPR exposure from embedding third-party font hosts).
Google's published "good" thresholds apply: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
*Test:* home page works with JavaScript disabled; no request leaves the origin; Lighthouse
performance ≥ 95 on a throttled mobile profile.

### R5. Accessible and readable
WCAG 2.2 AA: text contrast ≥ 4.5:1 (3:1 for large text and UI components), full keyboard
operation with visible focus, semantic landmarks, a skip link, `prefers-reduced-motion`
respected, targets ≥ 24 px. Prose measure 60-75 characters. Works from 320 px wide. Light and
dark themes, following the system by default.
*Test:* contrast is computed for every colour token pair in both themes; no horizontal scroll
at 320 px; Tab reaches every control in a sensible order.

### R6. Findable and shareable
One unique title and description per page, canonical URLs, Open Graph / Twitter card with an
image, `Person` structured data with `sameAs` links to your other profiles, sitemap, RSS feed.
Use the same name spelling everywhere, so profiles can be matched to you.
*Test:* view-source on the home page and a post shows each of these.

### R7. Cheap to change (the maintainability requirement)
Content is separated from presentation. Adding a post, project, publication or news item means
adding **one file or one YAML block**, never editing a template. It must work from GitHub's web
editor with no local toolchain, build on GitHub Pages' native builder with only its allowed
plugins, and keep working untouched for years.
*Test:* each content type has a copy-paste template, and adding one takes under two minutes.

### R8. A real home for writing
For a technical blog: Markdown, syntax-highlighted code with copy button, LaTeX math, figures,
footnotes, tables, auto table of contents, reading time, tags, series, previous/next, RSS,
drafts, and in-page filtering. Posts show their date and update date, so readers can judge
freshness.
*Test:* one post exercising every feature renders correctly in both themes.

### R9. Trust hygiene
A real photo, a real contact route, honest titles (a student is a student), dated content, no
more personal data than needed (no phone number, no home address), consistent links.
Tracking is off by default; a site without trackers needs no cookie banner.

### R10. Longevity and ownership
Plain text in git (Markdown + YAML), no database, no lock-in, no CDN dependency. **URLs never
break:** a moved page leaves a redirect behind (Tim Berners-Lee, "Cool URIs don't change").
A custom domain, if ever bought, makes the address independent of the hosting provider.
*Test:* every old URL listed in `redirect_from` still resolves.

### R11. Restraint *(judgement)*
One accent colour, a clear type hierarchy, generous whitespace, content first. Motion only where
it explains something. The failure mode for AI-themed sites is stock robot imagery, particle
backgrounds, purple gradients, and emoji used as icons; they signal template, not substance.

## Anti-patterns this rebuild removes

| Found in the previous site | Why it fails | Replacement |
|---|---|---|
| "Coming soon..." cards (Knowledge, Blog) | R3 | Sections render only with content |
| `CV-Filename.pdf` link to a file that does not exist | R3 | CV page generated from data; PDF button appears only if the file exists |
| Emoji as icons | R11, R5 | Inline SVG icon sprite |
| One-colour gradient glass panels | R11 | Paper/ink palette, single accent |
| Content tied to layout HTML | R7 | `_data/`, `_posts/`, `_projects/` |
| Writing pages with no dates, tags or feed | R8 | Real blog with RSS, tags, series |

## Stack decision

GitHub Pages' **native Jekyll builder** (Jekyll 3.10, whitelisted plugins only) was chosen
because the repository history shows all edits are made in GitHub's web UI. Native build means:
push to `main` and the site updates, with no CI and no settings change.

| | Jekyll on native Pages (chosen) | Astro / Hugo / Quarto via Actions |
|---|---|---|
| Edit from browser, no toolchain | Yes | Yes (but a broken build is harder to read) |
| Needs Pages source switched to "GitHub Actions" | No | Yes |
| Plugin / templating power | Limited (Liquid 4, ~20 plugins) | Much higher |
| Jupyter / executable posts | Manual (`nbconvert`) | Quarto handles it natively |

If posts become mostly executable notebooks, Quarto is the better tool; the content here
(Markdown + YAML front matter) ports over directly.
