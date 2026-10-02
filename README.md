# dangnghiemhong.github.io

Personal site of **Dang Hong Nghiem**: MSc student in Data & AI at Institut Polytechnique de Paris.
Live at <https://dangnghiemhong.github.io>. Built with Jekyll and served by GitHub Pages' native builder:
**push to `main` and the site updates in about a minute**. There is no CI and nothing to install.

> What a good personal website needs, and how this one is checked against it: [`docs/PRINCIPLES.md`](docs/PRINCIPLES.md).

## Where things live

| You want to change… | Edit this |
|---|---|
| Name, bio, photo, email, profile links, research-interest cards | [`_data/profile.yml`](_data/profile.yml) |
| Education / experience | [`_data/education.yml`](_data/education.yml), [`_data/experience.yml`](_data/experience.yml) |
| Publications (page + home section appear on first entry) | [`_data/publications.yml`](_data/publications.yml) |
| News items on the home page | [`_data/news.yml`](_data/news.yml) |
| CV extras: skills, awards, talks | [`_data/skills.yml`](_data/skills.yml), [`awards.yml`](_data/awards.yml), [`talks.yml`](_data/talks.yml) |
| Blog posts | `_posts/` (template: [`_templates/post.md`](_templates/post.md)) |
| Projects | `_projects/` (template: [`_templates/project.md`](_templates/project.md)) |
| Menu items | [`_data/navigation.yml`](_data/navigation.yml) |
| Button labels/icons for links (PDF, Code, Demo …) | [`_data/link_types.yml`](_data/link_types.yml) |
| Colours, fonts, spacing | tokens at the top of [`assets/css/main.css`](assets/css/main.css) |
| Site title, URL, plugins | [`_config.yml`](_config.yml) |

**Sections hide themselves when empty.** The *Publications* and *Projects* menu items, and the News /
Projects / Publications blocks on the home page, appear automatically the moment you add the first entry.
There are no "coming soon" placeholders by design.

## Everyday tasks (all doable in GitHub's web editor)

**Write a post.** *Add file → Create new file* → `_posts/2026-11-03-my-title.md` → paste
[`_templates/post.md`](_templates/post.md) → edit → *Commit to main*. The file name's slug becomes the URL
(`/blog/my-title/`), so pick it carefully; if you rename later, add `redirect_from: [/blog/old-slug/]`.
Posts support Markdown, syntax-highlighted code with copy button, LaTeX math (`$$…$$`), tables, footnotes,
task lists, figures, an automatic table of contents, tags with a filter, series, reading time, RSS (`/feed.xml`).
Put images in `assets/img/posts/<slug>/` and reference them as `/assets/img/posts/<slug>/file.png`.
Unfinished work: keep it in a `_drafts/` folder (not published) or add `published: false`.

**Add a project.** New file `_projects/my-project.md` from [`_templates/project.md`](_templates/project.md).

**Add a publication.** Copy the commented example in `_data/publications.yml`, remove the leading `# `.
Newest first. Your name (and the variants listed in `profile.yml`) is highlighted in author lists.
For every link type, use a key from `_data/link_types.yml`; to support a new one, add a line there.

**Upload a CV.** Add the file as `assets/files/cv.pdf`; a *Download PDF* button appears on `/cv/` automatically.
The CV page itself is generated from your data files, and prints cleanly (Ctrl/Cmd+P).

**Add a profile link** (LinkedIn, Google Scholar, ORCID, Hugging Face …): uncomment the matching block in
`_data/profile.yml`. It appears in the hero, the footer and the search-engine metadata.

**Add a page.** Create `my-page/index.html` (or `.md`) with front matter `layout: page`, `title:` and
`permalink: /my-page/`, then add it to `_data/navigation.yml`.

## If a push doesn't show up

Open the repository's **Actions** tab → the latest *pages build and deployment* run → read the error.
By far the most common cause is a YAML mistake in a front matter block or a `_data/*.yml` file:
an unquoted value containing `: `, a tab instead of spaces, or an unclosed quote. Quote any value that has a colon.
The site keeps serving the last good version until the build is fixed.

## Preview locally (optional)

```bash
bundle install
bundle exec jekyll serve --livereload      # http://localhost:4000   (add --drafts to see _drafts/)
```

Check for broken internal links before publishing:

```bash
bundle exec jekyll build
bundle exec htmlproofer ./_site --disable-external
```

## Things worth knowing (they have bitten before)

- **GitHub Pages runs Jekyll 3.10 with a fixed plugin allow-list**, whatever your local setup. This site uses only
  `jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-redirect-from`. Adding other plugins silently does nothing on GitHub.
- `_config.yml` **pins** `future`, `theme`, and `kramdown.math_engine` because GitHub Pages applies its own defaults
  that a local build does not; pinning keeps preview and production identical. Don't remove those lines.
- Liquid here is the old 4.x: no `{% render %}`, and no nested lookups like `a[b[0]]` (assign to a variable first).
- Math needs no flag: any post containing `$$…$$` loads KaTeX automatically (self-hosted, no CDN).
- Data lists (`publications.yml` etc.) keep their file order. Write newest first.
- Fonts (Inter, Source Serif 4, JetBrains Mono), KaTeX and icons are self-hosted in `assets/`; the site makes
  **no third-party requests**. Icons come from [Simple Icons](https://simpleicons.org) (CC0) and [Lucide](https://lucide.dev) (ISC); to add one,
  append a `<symbol id="i-name">` to `assets/img/icons.svg`.

## Moving off Jekyll later

All content is plain Markdown and YAML, so it ports to Astro, Hugo or Quarto without rewriting. If your posts become
mostly executable notebooks, [Quarto](https://quarto.org) would then be the better tool (see `docs/PRINCIPLES.md`).
