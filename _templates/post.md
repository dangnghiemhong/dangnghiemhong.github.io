---
# HOW TO USE: GitHub → "Add file" → "Create new file" → name it  _posts/YYYY-MM-DD-short-slug.md
#   (the slug becomes the URL: /blog/short-slug/ , so choose it carefully), paste this, edit, commit.
# Delete the lines starting with "#" if you like; only title, date and tags matter.
title: "Post title"
description: "One sentence shown in lists and in link previews."
date: 2026-10-02            # YYYY-MM-DD. A future date keeps the post hidden until the next build after that day.
tags: [Machine learning]    # one to three tags; reuse existing ones so the tag filter stays useful
# last_modified_at: 2026-10-10     # shows an "Updated …" date
# series: "Series name"            # groups posts; also set series_order (1, 2, 3 …)
# series_order: 1
# toc: false                       # hide the auto-generated table of contents
# image: /assets/img/posts/short-slug/cover.jpg    # social preview image (1200×630 works best)
# redirect_from: [/old-url/]       # keep an old URL working if you rename a post
---

Start with the point of the post in one or two sentences.

## A section

Inline math: $$E = mc^2$$. Display math goes on its own lines:

$$
\mathcal{L}(\theta) = -\sum_i \log p_\theta(y_i \mid x_i)
$$

```python
def hello():
    return "code blocks get syntax highlighting and a copy button"
```

![Alt text describing the image](/assets/img/posts/short-slug/figure.png)

A footnote.[^1]

- [ ] Task lists work too

[^1]: The footnote text.
