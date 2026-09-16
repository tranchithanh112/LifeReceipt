import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { demoResult } from "@/lib/demo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { itemReceiptLabel } from "@/lib/i18n/labels";
import { SITE_DOMAIN } from "@/lib/site";

const t = getDictionary();

export const alt = `LifeReceipt — ${t.meta.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f2eee5";
const INK = "#16130f";
const FAINT = "#918a7d";
const RECEIPT = "#fdfcf9";
const STAMP = "#bf3419";

/** Satori cannot read woff2, so the OG image uses the vendored TTFs. */
function loadFont(file: string) {
  return readFile(join(process.cwd(), "src", "fonts", "ttf", file));
}

const SLIP_WIDTH = 376;
const TOOTH_HEIGHT = 8;

/** Torn receipt edge, sized in absolute units because satori has no percentages here. */
function teeth(side: "top" | "bottom") {
  const flip = side === "top";
  const count = 22;
  const step = SLIP_WIDTH / count;
  const baseline = flip ? TOOTH_HEIGHT : 0;
  const tip = flip ? 0 : TOOTH_HEIGHT;

  let d = `M0 ${baseline}`;
  for (let i = 0; i < count; i++) {
    d += ` L${(i * step + step / 2).toFixed(2)} ${tip} L${((i + 1) * step).toFixed(2)} ${baseline}`;
  }

  return (
    <svg
      width={SLIP_WIDTH}
      height={TOOTH_HEIGHT}
      viewBox={`0 0 ${SLIP_WIDTH} ${TOOTH_HEIGHT}`}
    >
      <path d={`${d} Z`} fill={RECEIPT} />
    </svg>
  );
}

export default async function OpenGraphImage() {
  const [mono, monoBold, serif] = await Promise.all([
    loadFont("JetBrainsMono-Regular.ttf"),
    loadFont("JetBrainsMono-Bold.ttf"),
    loadFont("Fraunces-Display.ttf"),
  ]);

  const sample = demoResult();
  const lines = sample.items.slice(0, 5);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: PAPER,
        color: INK,
        fontFamily: "JetBrains Mono",
        padding: "64px 72px",
      }}
    >
      {/* Left column: the promise */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          paddingRight: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          LifeReceipt
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            {t.meta.tagline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 25,
              lineHeight: 1.45,
              color: "#5b544b",
              maxWidth: 520,
            }}
          >
            {t.meta.description}
          </div>
        </div>

        {/*
          Wraps rather than nowraps: this line is dictionary copy, and the
          Vietnamese note is half again as long as the English one — pinned to
          a single line it slid out under the receipt.
        */}
        <div
          style={{
            display: "flex",
            fontSize: 17,
            lineHeight: 1.5,
            letterSpacing: 1.5,
            color: FAINT,
            textTransform: "uppercase",
            maxWidth: 520,
          }}
        >
          {SITE_DOMAIN} · {t.landing.ctaNote}
        </div>
      </div>

      {/* Right column: the artefact */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: SLIP_WIDTH,
          transform: "rotate(2deg)",
        }}
      >
        {teeth("top")}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: RECEIPT,
            padding: "30px 34px 26px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: 19,
              fontWeight: 700,
              // Tracking is budgeted for the longest title, not the English one.
              letterSpacing: 4,
            }}
          >
            {t.receipt.title}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 8,
              fontSize: 15,
              letterSpacing: 3,
              color: FAINT,
            }}
          >
            {t.share.ageLabel(sample.age)}
          </div>

          <div
            style={{
              display: "flex",
              height: 2,
              background: INK,
              marginTop: 20,
              marginBottom: 16,
            }}
          />

          {lines.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 21,
                padding: "7px 0",
              }}
            >
              <span style={{ textTransform: "uppercase", letterSpacing: 1 }}>
                {itemReceiptLabel(item, t)}
              </span>
              <span style={{ fontWeight: 700 }}>
                {t.fmt.duration(item.yearsSpent)}
              </span>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              height: 2,
              background: INK,
              marginTop: 16,
              marginBottom: 14,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              fontSize: 19,
              fontWeight: 700,
            }}
          >
            <span style={{ letterSpacing: 1 }}>{t.receipt.total}</span>
            <span>{t.receipt.oneLife}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: 5,
              color: STAMP,
            }}
          >
            {t.receipt.noRefunds}
          </div>
        </div>
        {teeth("bottom")}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
        {
          name: "JetBrains Mono",
          data: monoBold,
          weight: 700,
          style: "normal",
        },
        { name: "Fraunces", data: serif, weight: 400, style: "normal" },
      ],
    },
  );
}
