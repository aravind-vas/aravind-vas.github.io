# aravindvas.com

The personal site for **aravindvas.com** — a two-tab bio, plain paper, no build step.

- `?view=personal` (default) — who I am outside of work
- `?view=pro` — what I do professionally

Deployed to Cloudflare Pages (project `aravindvas`), which serves the apex and `www`.

## Why the tabs

Borrowed from [thariq.io](https://www.thariq.io/?mode=professional), which carries a
professional/personal split on one page. It's a good pattern: a recruiter gets the work
view in two seconds, and a friend asking "so what do you actually do" gets the other one.

## Previous version — preserved

This repo previously held a fork of **[alanagoyal/notes](https://github.com/alanagoyal/alanagoyal)**,
an Apple Notes–inspired site (Next.js + Supabase) that was live at `www.aravind.app`. That
domain has expired.

The fork is **not deleted**. It lives on the branch:

```
archive/alanagoyal-notes-fork
```

To bring it back:

```bash
git fetch origin
git checkout archive/alanagoyal-notes-fork
```

Original upstream source: <https://github.com/alanagoyal/alanagoyal>
