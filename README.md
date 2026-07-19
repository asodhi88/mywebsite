# mywebsite

Personal site for Aman Sodhi — product work, résumé, and photography.

## What this is

A single self-contained `index.html`. No build step, no dependencies, no
framework. All CSS and JS are inline; the only external requests are Google
Fonts (Newsreader, Archivo, IBM Plex Mono).

To work on it, open `index.html` in a browser. That's the whole workflow.

```
index.html    the entire site
.gitignore    local tooling + OS cruft
```

## Structure

The page is one scroll, with these sections in order:

| Section  | Anchor     | Notes                                        |
| -------- | ---------- | -------------------------------------------- |
| Hero     | `#top`     | Statement + photo slot                       |
| Work     | `#work`    | Three project rows, each linking out         |
| Résumé   | `#resume`  | Accordion — click a role to expand           |
| Contact  | `#contact` | Email + social links                         |

Two things are worth knowing before editing the CSS:

- `.photo`, `.exif`, and `.slot-label` are shared by the hero. They look like
  generic image styles, but removing them breaks the hero image.
- The résumé accordion is driven by the `.open` class on `.job`, toggled by the
  script at the bottom. `.job-body` animates via `max-height`, currently capped
  at `400px` — a role with enough bullets to exceed that will clip.

Motion is disabled under `prefers-reduced-motion`.

## Deploying

Hosted on Vercel. Since there's no build step, import the repo and deploy with
framework preset "Other" and no build command — Vercel serves `index.html`
directly.

## Known gaps

These are unfinished on purpose and need real content, not code:

- **Open Graph tags point at a placeholder domain.** `og:url` and `og:image`
  still read `YOUR-DOMAIN-HERE.vercel.app`. Link previews on LinkedIn, Slack,
  and iMessage will not render until these carry the real deployed URL.
- **`og-image.jpg` does not exist.** The meta tag references it, but no such
  file is in the repo. A correct `og:url` alone won't produce a preview — the
  image has to exist too, at 1200×630.
- **Three links are still `href="#"`** — the résumé PDF download, Instagram, and
  LinkedIn. They're live on the public page in that state.
- **The hero image is a CSS placeholder**, not a photograph.
