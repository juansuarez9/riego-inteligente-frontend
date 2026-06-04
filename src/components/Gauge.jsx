function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value ?? min));
}

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad),
  };
}

/** Media luna superior: izquierda (180°) → derecha (0°). */
function describeUpperSemicircle(cx, cy, radius) {
  const start = polarToCartesian(cx, cy, radius, 180);
  const end = polarToCartesian(cx, cy, radius, 0);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}

function describeUpperSegment(cx, cy, radius, endDeg) {
  const start = polarToCartesian(cx, cy, radius, 180);
  const end = polarToCartesian(cx, cy, radius, endDeg);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}

function fillColorForRatio(ratio, variant) {
  if (variant === "temperature") {
    const hue = 220 - ratio * 215;
    return `hsl(${hue}, 92%, ${48 + ratio * 14}%)`;
  }
  if (variant === "air") {
    const hue = 205 - ratio * 80;
    return `hsl(${hue}, 90%, ${50 + ratio * 12}%)`;
  }
  const hue = 8 + ratio * 118;
  return `hsl(${hue}, 88%, ${50 + ratio * 12}%)`;
}

function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = "",
  variant = "soil",
}) {
  const numeric = Number(value);
  const safe = Number.isFinite(numeric) ? numeric : min;
  const clamped = clamp(safe, min, max);
  const ratio = (clamped - min) / (max - min || 1);
  const activeColor = fillColorForRatio(ratio, variant);

  const cx = 100;
  const cy = 100;
  const radius = 84;
  const arcPath = describeUpperSemicircle(cx, cy, radius);
  const arcLength = Math.PI * radius;
  const filledLength = ratio * arcLength;
  // Mismo ángulo donde termina el relleno del arco (izq → der por arriba)
  const fillAngleDeg = 180 - ratio * 180;
  const wedgeEnd = fillAngleDeg;

  const wedgePath =
    ratio > 0.02
      ? describeUpperSegment(cx, cy, radius - 14, wedgeEnd)
      : null;

  const needleLen = radius - 18;
  const tip = polarToCartesian(cx, cy, needleLen, fillAngleDeg);
  const baseL = polarToCartesian(cx, cy, 9, fillAngleDeg + 90);
  const baseR = polarToCartesian(cx, cy, 9, fillAngleDeg - 90);

  const hubId = `hub-${variant}`;

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 120" className="gauge-svg" aria-hidden="true">
        <defs>
          <filter id={`glow-${variant}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={hubId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="55%" stopColor="rgba(200,210,220,0.9)" />
            <stop offset="100%" stopColor="rgba(80,90,100,0.95)" />
          </radialGradient>
        </defs>

        {wedgePath && (
          <path
            d={`${wedgePath} L ${cx} ${cy} Z`}
            fill={activeColor}
            fillOpacity={0.2}
            className="gauge-wedge"
          />
        )}

        <path
          d={arcPath}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {ratio > 0 && (
          <path
            d={arcPath}
            fill="none"
            stroke={activeColor}
            strokeWidth="22"
            strokeLinecap="round"
            className="gauge-arc-fill"
            filter={`url(#glow-${variant})`}
            style={{
              strokeDasharray: `${filledLength} ${arcLength}`,
            }}
          />
        )}

        <polygon
          points={`${baseL.x},${baseL.y} ${tip.x},${tip.y} ${baseR.x},${baseR.y}`}
          className="gauge-needle-shadow"
        />
        <polygon
          points={`${baseL.x},${baseL.y} ${tip.x},${tip.y} ${baseR.x},${baseR.y}`}
          className="gauge-needle-body"
          style={{ fill: activeColor, stroke: activeColor }}
        />
        <circle
          cx={tip.x}
          cy={tip.y}
          r="5"
          className="gauge-needle-tip"
          style={{ fill: activeColor }}
        />

        <circle
          cx={cx}
          cy={cy}
          r="11"
          fill={`url(#${hubId})`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
          className="gauge-needle-hub"
        />
        <circle cx={cx} cy={cy} r="4" fill="rgba(30,40,50,0.6)" />

        <text x="18" y="112" className="gauge-tick-label">
          {min}
        </text>
        <text x="172" y="112" className="gauge-tick-label">
          {max}
        </text>
      </svg>

      <p
        className="gauge-reading"
        style={{ color: Number.isFinite(numeric) ? activeColor : undefined }}
      >
        {Number.isFinite(numeric) ? clamped.toFixed(1) : "—"}
        {unit}
      </p>
      <p className="gauge-label">{label}</p>
    </div>
  );
}

export default Gauge;
