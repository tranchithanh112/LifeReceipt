# LifeReceipt

> Where did your life go?

An itemised receipt for one human life. Answer nine questions about an average
day and LifeReceipt prints how many years you have already spent sleeping,
working, scrolling, commuting and gaming — and what those habits will cost by
the time you are 80.

Everything runs in the browser. No account, no database, no analytics, no
cookie banner.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
npm run lint
```

Node 20.9+ is required (Next.js 16).

## Deploying

Vercel needs no configuration: import the repository and it builds as-is.

The one thing worth knowing is the site URL, which feeds `metadataBase`, the
OG image, `robots.txt`, the sitemap, and the domain printed on the receipt and
both share cards. `next.config.ts` resolves it in this order:

1. `NEXT_PUBLIC_SITE_URL`, if you set it — use this once you have a real domain.
2. `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, injected automatically.
3. The canonical domain in `lib/site.ts`.

So a fresh Vercel import already points every link and every share card at
its own deployment; pointing a custom domain at it is one environment
variable.

## The flow

```
/            landing, with a live sample receipt in the hero
/calculate   nine steps: age, then eight activities
/results     reveal → receipt → shock stats → jokes → forecast + refund → share
```

Answers live in `localStorage` under `lifereceipt:answers:v1` and are read
through `useSyncExternalStore`, so the server renders empty answers and the
client swaps in whatever is on the device without a hydration mismatch.
`Start over` clears the key.

## How the numbers work

Every answer is normalised to an **effective hours per day**:

| Cadence   | Conversion              | Example              |
| --------- | ----------------------- | -------------------- |
| `daily`   | `h`                     | 2.5h scrolling → 2.5 |
| `weekday` | `h × 5 × 52 ÷ 365`      | 8h work → 5.70       |
| `weekly`  | `h × 52 ÷ 365`          | 3h exercise → 0.43   |

and then billed with one formula:

```
yearsSpent      = hoursPerDay × age             ÷ 24
yearsRemaining  = hoursPerDay × (lifeExpectancy − age) ÷ 24
yearsLifetime   = yearsSpent + yearsRemaining
```

Two modelling choices, both stated plainly in the product:

1. **Time is counted across your whole life so far.** A 28-year-old who works
   eight hours a weekday is billed ~6.6 years of work, not the years since
   they actually started. Every line is `rate × lifetime`, which keeps the
   receipt's arithmetic legible and makes the forward projection consistent
   with the backward one.
2. **Activities may overlap.** Scrolling on the commute is counted on both
   lines, because it costs you both times. The itemised subtotal can therefore
   exceed your age; the receipt prints the difference as `OVERLAP CREDIT`.

Life expectancy defaults to 80, is adjustable on the results page, and is
clamped above the user's age so no projection ever goes negative.

## Layout

```
src/
├── app/                     routes, metadata, OG image, robots, sitemap
├── components/
│   ├── receipt/             the receipt: torn edges, barcode, line items
│   ├── calculator/          the question flow
│   ├── results/             reveal, stats, forecast + refund, share
│   ├── share/               the two 1080×1920 share cards
│   ├── site/                wordmark, footer, VI/EN switch
│   └── ui/                  button, slider, number field
├── hooks/                   motion preferences, rAF progress, fit-to-container
├── lib/
│   ├── activities.ts        the activity catalogue (pure data)
│   ├── calc.ts              all arithmetic
│   ├── stats.ts             picks the 3–5 most interesting numbers
│   ├── humor.ts             rules-based one-liners, one per topic
│   ├── i18n/                vi + en copy, locale store, formatters
│   ├── storage.ts           localStorage, with input sanitising
│   ├── state.tsx            the external store behind useLifeReceipt()
│   └── share.ts             PNG export, Web Share, clipboard fallbacks
└── fonts/                   vendored woff2 (browser) + ttf (OG image)
```

`lib/` holds no React and no browser APIs except in `state.tsx`, `storage.ts`
and `share.ts`, so the maths is testable and reusable on a server.

## Design

Modern editorial layout crossed with a thermal receipt. Warm off-white paper,
near-black ink, one red used only as a stamp. Fraunces for display, Inter for
UI, JetBrains Mono for anything printed on the receipt.

Fraunces carries the display voice in both languages. Its `opsz` axis stays
live so headlines run high-contrast and small text stays readable, and because
the family ships no italic, the `WONK` axis supplies emphasis instead of a
browser-faked oblique. All three faces are subset to Latin plus Vietnamese —
Google's CSS API serves those as separate files, so they are vendored from the
upstream variable sources and subset here rather than fetched per script.

The torn receipt edge is an inline SVG triangle wave rather than a CSS mask,
because the share-card exporter rasterises the DOM through an SVG
`foreignObject` where masks are unreliable but child SVG always renders. The
paper's drop shadow uses `filter: drop-shadow` so it follows the teeth.

## Sharing

Two cards, both 1080×1920, rendered from live DOM with `html-to-image`
(dynamically imported, so it only downloads when someone actually exports):

- **The receipt** — the three biggest line items, the punchline, days lived
  and days left.
- **The excuse** — "I don't have time." against the one number that disproves it.

`navigator.share` with a file attachment where the browser supports it, a
download everywhere else, and a clipboard fallback under that. Fonts are
vendored and same-origin so the exporter can inline them.

## Built to extend

The MVP is deliberately backend-free, but the seams are already in place:

- **Result URLs** — `calculate()` is pure and `Answers` is small and
  serialisable; encode it into a query param or a short ID.
- **Accounts / persistence** — replace `lib/storage.ts` and the store in
  `lib/state.tsx`; nothing else reads localStorage.
- **Comparisons and leaderboards** — `LifeResult` already carries per-item
  lifetime totals and normalised daily rates, which is everything a comparison
  needs.
- **Analytics** — there is no tracking anywhere; add it at the route level.

## Verification

- Arithmetic, formatting, the stats picker and the humour engine were checked
  against a standalone assertion suite, including a 2,000-case fuzz run
  asserting no `NaN`/`Infinity` reaches the UI.
- The full flow was driven in Chromium at 320px, 375px, 390px and 1440px:
  zero console errors, no horizontal overflow, both share cards exported and
  inspected, OG image rendered, and the same checks repeated against a
  simulated Vercel deployment host.
- `axe-core` (WCAG 2.1 A/AA + best practice) reports zero violations on `/`,
  `/calculate` and `/results`.

## Languages

Vietnamese and English, Vietnamese by default. The toggle sits in the header on
the landing and results pages — not mid-questionnaire, where nothing should
compete with finishing.

All copy lives in `lib/i18n/{vi,en}.ts` behind one `Dict` interface, and the
static HTML ships in Vietnamese, so a first visit never flashes English. The
statistics and one-liners are functions rather than `{0}` templates: the two
languages order their clauses differently, and a template would force one into
the other's grammar. Numbers, durations and dates follow the locale too —
`10.227` and `9,4 năm` against `10,227` and `9.4 years`.

## Privacy

Your answers stay on your device. There is no server call, no cookie, no
third-party script. The only network requests are for the page itself.

## Licences

Fonts are vendored under the SIL Open Font License 1.1: Fraunces (Phaedra
Charles, Flavia Zimbardi), Inter (Rasmus Andersson), JetBrains Mono
(JetBrains).
