/**
 * The torn edge of a thermal receipt, drawn as an inline SVG triangle wave.
 *
 * Inline SVG rather than a CSS mask on purpose: the share-card exporter
 * rasterises the DOM through an SVG foreignObject, where masks are unreliable
 * but child SVG elements always render.
 */
export function SerratedEdge({
  side,
  teeth = 26,
  height = 7,
  className,
  fill = "var(--color-receipt)",
}: {
  side: "top" | "bottom";
  teeth?: number;
  height?: number;
  className?: string;
  fill?: string;
}) {
  const flip = side === "top";
  const width = 100;
  const toothWidth = width / teeth;
  const baseline = flip ? height : 0;
  const tip = flip ? 0 : height;

  let d = `M0 ${baseline}`;
  for (let i = 0; i < teeth; i++) {
    const mid = (i * toothWidth + toothWidth / 2).toFixed(3);
    const end = ((i + 1) * toothWidth).toFixed(3);
    d += ` L${mid} ${tip} L${end} ${baseline}`;
  }
  d += " Z";

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path d={d} fill={fill} />
    </svg>
  );
}
