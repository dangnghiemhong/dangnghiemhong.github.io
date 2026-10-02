# dangnghiemhong.github.io

Personal site of **Dang Hong Nghiem**: MSc student in Data & AI at Institut Polytechnique de Paris.
Live at <https://dangnghiemhong.github.io>. Built with Jekyll and served by GitHub Pages' native builder:
**push to `main` and the site updates in about a minute**. There is no CI and nothing to install.

> What a good personal website needs, and how this one is checked against it: [`docs/PRINCIPLES.md`](docs/PRINCIPLES.md).

## Where things live

| You want to change… | Edit this |
|---|---|
| Name, bio, photo, contact emails, profile links, research-interest cards | [`_data/profile.yml`](_data/profile.yml) |
| Education, experience: home = titles, `/experience/` = + one-line `summary`, CV = + bullet `details` | [`_data/education.yml`](_data/education.yml), [`_data/experience.yml`](_data/experience.yml) |
| Honours & scholarships (`/experience/`, CV) | [`_data/awards.yml`](_data/awards.yml) |
| Skills: CV list, and the short home "Toolbox" (`home: true` on a group; keep it to one row) | [`_data/skills.yml`](_data/skills.yml) |
| Research tab / publications (the tab is always in the menu; entries appear as you add them) | [`_data/publications.yml`](_data/publications.yml) |
| News items on the home page | [`_data/news.yml`](_data/news.yml) |
| Talks (CV) | [`_data/talks.yml`](_data/talks.yml) |
| Blog posts | `_posts/` (template: [`_templates/post.md`](_templates/post.md)) |
| Projects | `_projects/` (template: [`_templates/project.md`](_templates/project.md)) |
| Menu items | [`_data/navigation.yml`](_data/navigation.yml) |
| Button labels/icons for links (PDF, Code, Demo …) | [`_data/link_types.yml`](_data/link_types.yml) |
| Colours, fonts, spacing | tokens at the top of [`assets/css/main.css`](assets/css/main.css) |
| Site title, URL, plugins | [`_config.yml`](_config.yml) |

**Sections hide themselves when empty.** The *Projects* menu item, and the News / Projects / Publications
blocks on the home page, appear automatically the moment you add the first entry. The one deliberate exception
is the **Research** tab: it is always in the menu, and until `_data/publications.yml` has its first entry the page
says that publications will be listed there and carries `noindex` so search engines skip it. Once you add an entry the
list appears and `noindex` disappears by itself (remove `sitemap: false` from `research/index.html` if you want the page
in the sitemap).

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

**Change or add an email address.** Edit the `contacts` list in `_data/profile.yml`. Each address is stored as
two fields, `user` (before the `@`) and `domain` (after it), **never as `name@domain`**. Visitors see the
address only after clicking *Contact me* / *Show email*; it is assembled in their browser, and clicks fired
by scripts are ignored. This stops the common harvesters that regex-scan pages and repositories for `x@y.z`.
It is not a guarantee: a human, or a bot that renders the page *and* performs a real click, can still read it.
It also cannot remove an address from places it already is (see the note on git history below). Do not
write the full address anywhere else in the repository (README, posts, YAML comments), or the protection is lost.

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

## Privacy note: old email addresses in git history

Git history is public and permanent. The previous site published a Gmail address in plain text, and some
commits made from a local machine carry the committer's email in their metadata. Rewriting history would
break forks and clones, so it was not done. To stop future leaks, in GitHub → *Settings → Emails* turn on
**Keep my email addresses private** and **Block command line pushes that expose my email**.

## Moving off Jekyll later

All content is plain Markdown and YAML, so it ports to Astro, Hugo or Quarto without rewriting. If your posts become
mostly executable notebooks, [Quarto](https://quarto.org) would then be the better tool (see `docs/PRINCIPLES.md`).
