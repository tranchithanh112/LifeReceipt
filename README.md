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

Set `NEXT_PUBLIC_SITE_URL` when deploying somewhere other than the canonical
domain — it feeds `metadataBase`, the sitemap and the share links.

## The flow

```
/            landing, with a live sample receipt in the hero
/calculate   ten steps: age, eight activities, optional custom activities
/results     reveal → receipt → shock stats → jokes → projection → refund → share
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
│   ├── results/             reveal, stats, projection, refund, share, viral loop
│   ├── share/               the two 1080×1920 share cards
│   ├── site/                wordmark, footer
│   └── ui/                  button, slider, number field
├── hooks/                   motion preferences, rAF progress, fit-to-container
├── lib/
│   ├── activities.ts        the activity catalogue (pure data)
│   ├── calc.ts              all arithmetic
│   ├── stats.ts             picks the 3–5 most interesting numbers
│   ├── humor.ts             rules-based one-liners, one per topic
│   ├── format.ts            durations → "9y 4m"
│   ├── storage.ts           localStorage, with input sanitising
│   ├── state.tsx            the external store behind useLifeReceipt()
│   └── share.ts             PNG export, Web Share, clipboard fallbacks
└── fonts/                   vendored woff2 (browser) + ttf (OG image)
```

`lib/` holds no React and no browser APIs except in `state.tsx`, `storage.ts`
and `share.ts`, so the maths is testable and reusable on a server.

## Design

Modern editorial layout crossed with a thermal receipt. Warm off-white paper,
near-black ink, one red used only as a stamp. Instrument Serif for display,
Inter for UI, JetBrains Mono for anything printed on the receipt.

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
- The full flow was driven in Chromium at 320px, 390px and 1440px: zero
  console errors, no horizontal overflow, both share cards exported and
  inspected, OG image rendered.
- `axe-core` (WCAG 2.1 A/AA + best practice) reports zero violations on `/`,
  `/calculate` and `/results`.

## Privacy

Your answers stay on your device. There is no server call, no cookie, no
third-party script. The only network requests are for the page itself.

## Licences

Fonts are vendored under the SIL Open Font License 1.1: Instrument Serif
(Rodrigo Fuenzalida, Iannis Zannos), Inter (Rasmus Andersson), JetBrains Mono
(JetBrains).
