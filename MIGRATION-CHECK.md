# ask4loan.ca: Next.js → Astro, check report

Branch: `astro-migration` (local only; not committed, not pushed, not deployed).
Date of check: 2026-11-15.

The site was moved the same way as 365loan.ca and e-loan.ca: the same Astro setup ("Next compatibility" layer), so the old pages, components and content stay as they were. Only this repo's own code and IDs are used (domain `https://ask4loan.ca`).

How the check was done:
- Old site: a Next.js production build of this repo's `main` (port 3104), in a separate copy outside the repo.
- New site: `npm run build` + `PORT=4326 npm run preview`.
- Crawl of every sitemap URL, files and test URLs; layout and behaviour in a real browser, both sites side by side. GA, Clarity and LeadScout were blocked in the test browser.

## Result in one line

All 263 pages, all files, all tracking and the behaviour match. Differences:
1. **Missing space fixed (owner, please look).** On 16 pages `/loans/by-amount/<amount>` the old site shows the amount glued to the next word, e.g. "**$1000Today**" in the heading and text. This came from a bug in Next's compiler (it drops a space before text that contains a special character). The new site shows it as the code is written: "**$1000 Today**". Same on `/resources/tools` ("need. It's" — old: "need.It's"). I kept the correct space (the code was always meant to have it). If you want it exactly like the old site, tell me.
2. Share images: tiny letter-edge pixel changes only (90 images, max 0.57% of pixels).
3. New page `/unsubscribe` (section 6).

## 1. Pages, head tags, text

| Check | Result |
|---|---|
| Sitemap pages | 263 old, 263 new + `/unsubscribe` |
| Head tags + body text | **247 identical**; the other 16 (`/loans/by-amount/…`) differ only by the space in point 1 |
| 404 pages (`/does-not-exist`, …) | same text, same tags |
| `/api/contact` | GET 405; POST handled by the same code (not sent) |

## 2. Files

robots, sitemaps, manifest, feeds, favicon, icon, share images (90), logos, partner logos, IndexNow key, Search Console file (`google211528508b1fc7e4.html`): **same content**. Only local-server header differences (`Cache-Control`, charset), as on the other sites.

## 3. Layout and behaviour

- **Layout:** 22 key pages × computer (1280) + phone (390): **40 of 44 identical** to the pixel. The 4 others are by-amount pages: only the space from point 1.
- **Scoped styles (`<style jsx>`):** this site uses Next's built-in scoped CSS. It is now compiled by the same tool Next uses, so class names and CSS are the same (8 style blocks on both).
- **Behaviour, same on both:** header menus, mobile menu, cookie banner, FAQ boxes, loan calculator sliders (same numbers), contact form (not sent), apply form: LeadScout starts with the same settings (checked with a fake LeadScout file; affiliate `4PrKYVa8`, sub1 `ask4loan`). No console errors on any tested page.

## 4. Tracking (this site's own IDs)

| Piece | ID | Result |
|---|---|---|
| Google Analytics 4 | `G-3FBX7QL507` | ✅ same as old, on every tested page (15) |
| Microsoft Clarity | `y1rl8dlvqz` | ✅ same |
| JSON-LD | site-wide + per page | ✅ same |
| LeadScout | affiliate `4PrKYVa8`, sub1 `ask4loan` | ✅ same options |
| IndexNow / Search Console | `public/indexnow-key.txt`, `public/google211528508b1fc7e4.html` | ✅ unchanged, served the same. No real IndexNow submission was made. |

## 5. Speed (JavaScript sent to the browser, gzip)

| Page | Old (Next) | New (Astro) |
|---|---|---|
| Home | 315 KB | 121 KB |
| Blog post | 337 KB | 101 KB |
| /contact | 334 KB | 103 KB |
| /resources/tools | 334 KB | 111 KB |

HTML is also smaller (home 22 → 17 KB gzip).

## 6. New page: /unsubscribe

Built from the Art Direction mockup (`LMS/design/brand-unsubscribe/ask4loan`). **Not reviewed by the owner yet.**
- Look: same page frame as /contact (soft green glow, breadcrumb "Home > Unsubscribe", round icon, title "Unsubscribe", short line), then the form card with the same fields and button as the contact form; emerald reason rows. Compared with the mockup in all 5 states, computer + phone: 8 of 10 identical; the other 2 differ only by the curly apostrophe in "You’re" (as on the other sites).
- **Choice (owner, please look):** the round icon at the top uses the same green colour and size as the /contact page icon. The mockup showed a smaller dark icon. I kept it like /contact so the page matches the rest of the site.
- Head: canonical `https://ask4loan.ca/unsubscribe`, title "Unsubscribe | Ask4Loan Canada"; added to `/sitemap/pages.xml`.
- Server route: sends `host: "ask4loan.ca"` to the LMS (checked with a fake LMS on this computer; nothing reached the real LMS). Bad email → 400, LMS error → "Something went wrong". Test mode without `LMS_URL` / `PROXY_SECRET`: nothing sent, 503. GET → 405.
- Not tested: the real LMS (needs `LMS_URL` and `PROXY_SECRET` on Vercel; owner only).

## 7. Not checked (needs a Vercel preview deploy, owner + DevOps)

Vercel image optimizer, cache headers, real contact email, the Vercel "Framework" setting (change only at launch, after the owner says yes).

## 8. What changed in the code

- Added (same as the other sites): `astro.config.mjs`, `integrations/`, `lib/compat/`, `src/`, `scripts/serve-local.mjs`.
- `lib/compat/site.ts`: this site's fonts, icons and share-image link (from its own Next build).
- `src/styled-jsx.d.ts`: types for `<style jsx>` (Next had them built in).
- `public/favicon.ico`, `public/icon.png`, `public/opengraph-image.png`: copies of the files in `app/` (served at the same URLs).
- `package.json` / lock (adds `@swc/core`, `@swc/plugin-styled-jsx`, `styled-jsx` for the scoped styles), `tsconfig.json` (`verbatimModuleSyntax: false`, as Next had), `.gitignore` (+ `/.swc/` cache).
- Unsubscribe: `app/unsubscribe/page.tsx`, `components/unsubscribe/unsubscribe-form.tsx`, `app/api/unsubscribe/route.ts`, `lib/unsubscribe.ts`, `src/pages/api/unsubscribe.ts`, one line + one date in `lib/sitemap.ts`.
- Removed: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`. All other source is unchanged. `npm run check`: 0 errors, 0 warnings.

Shared improvements made for this site (copied to all earlier sites, re-checked there: all pages unchanged):
- `<style jsx>` support (only active on sites that use it).
- `dynamic(() => import(...))` works like a normal import, as Next draws it on the server.
- Share-image rule: a page or layout that sets its own share image is not given the default file image, exactly like Next.

## How to open the new site locally

```bash
npm install
npm run build
PORT=4326 npm run preview
```

Then open http://localhost:4326.
