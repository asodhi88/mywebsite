# mywebsite

Personal site for Aman Sodhi — product work, résumé, and contact.

## What this is

A single self-contained `index.html` plus one serverless function. No build
step, no bundler, no dependencies. All CSS and JS are inline; the only external
requests are Google Fonts (Newsreader, Archivo, IBM Plex Mono).

```
index.html        the entire front end
api/contact.js    serverless handler for the footer contact form
.gitignore        local tooling + OS cruft
```

Open `index.html` in a browser to work on the markup and styles. The contact
form needs a server for its `POST /api/contact` call, so use `vercel dev` (or
any static server that routes `/api`) when testing that specific flow.

## Structure

The page is one scroll, with these sections in order:

| Section | Anchor     | Notes                                  |
| ------- | ---------- | -------------------------------------- |
| Hero    | `#top`     | Statement + photo slot                 |
| Work    | `#work`    | Three project rows, each linking out   |
| Résumé  | `#resume`  | Accordion — click a role to expand     |
| Contact | `#contact` | "Say hello." toggles the message panel |

Two things are worth knowing before editing the CSS:

- `.photo`, `.exif`, and `.slot-label` are shared by the hero. They look like
  generic image styles, but removing them breaks the hero image.
- The résumé accordion is driven by the `.open` class on `.job`, toggled by the
  script at the bottom. `.job-body` animates via `max-height`, currently capped
  at `400px` — a role with enough bullets to exceed that will clip.

Motion is disabled under `prefers-reduced-motion`.

## Contact form

"Say hello." expands a panel with Name / Email / Message (500-char cap) that
POSTs JSON to `/api/contact`. Only Message is required.

The endpoint always answers `200` with `{ delivered: boolean }`. `delivered:
false` means the message was accepted but email is not configured — the UI then
says so and offers a `mailto:` fallback rather than showing a false success.
Real failures return `4xx`/`5xx` and the form shows a retry message.

A hidden `website` field acts as a honeypot; submissions that fill it are
silently accepted and dropped.

### Required env vars

Set these in Vercel → Settings → Environment Variables. **Until all three
exist, the form will report "email isn't set up yet".**

| Variable         | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com)            |
| `CONTACT_FROM`   | Verified sender, e.g. `site@yourdomain.com`             |
| `CONTACT_TO`     | Where messages should land                              |

Resend only sends from a domain you have verified, so `CONTACT_FROM` cannot be
a free Hotmail/Gmail address. `CONTACT_TO` can be anything.

## Deploying

Hosted on Vercel. Import the repo with framework preset **Other** and no build
command — Vercel serves `index.html` directly and turns `api/*.js` into
functions automatically.

## Known gaps

These need real content, not code:

- **Open Graph tags point at a placeholder domain.** `og:url` and `og:image`
  still read `YOUR-DOMAIN-HERE.vercel.app`. Link previews on LinkedIn, Slack,
  and iMessage will not render until these carry the real deployed URL.
- **`og-image.jpg` does not exist.** The meta tag references it, but no such
  file is in the repo. A correct `og:url` alone won't produce a preview — the
  image has to exist too, at 1200×630.
- **Three links are still `href="#"`** — the résumé PDF download, Instagram,
  and LinkedIn. (Instagram is `https://www.instagram.com/asxstills/`, per the
  portfolio site, if you want it filled in.)
- **The hero image is a CSS placeholder**, not a photograph.
- **The Domicile link in Work is dead** — `domicile-rust.vercel.app` currently
  returns `DEPLOYMENT_NOT_FOUND`.
