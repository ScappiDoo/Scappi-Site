// scenes.jsx — ScappiTrade cinematic showcase
// 15-second video, 1920×1080, 60fps target
//
// Timeline:
//  0.0 – 3.0  ACT I  Macro close-up on hexagon logo + wordmark reveal
//  3.0 – 6.5  ACT II Dolly out, sign-in card with floating ambient UI
//  6.5 – 10.5 ACT III Dashboard scroll: stat cards float in 3D
//  10.5 – 13.0 ACT IV World map orbit, caravan trail glow
//  13.0 – 15.0 ACT V Wide hero: all panels in floating glass stack

// ── Brand tokens ────────────────────────────────────────────────────────────
const BRAND = {
  bg: '#08070a',
  bgPanel: '#100e13',
  bgCard: '#171419',
  border: 'rgba(212, 168, 73, 0.22)',
  borderSoft: 'rgba(212, 168, 73, 0.10)',
  gold: '#d4a849',
  goldBright: '#f5d27a',
  goldDim: 'rgba(212, 168, 73, 0.55)',
  text: '#f4ede0',
  textDim: 'rgba(244, 237, 224, 0.55)',
  textFaint: 'rgba(244, 237, 224, 0.32)',
  green: '#5ab47a',
  red: '#d05757',
  serif: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

// ── Cinematic atmosphere — rim lights + vignette behind everything ──────────
function Atmosphere({ intensity = 1, showGrain = true } = {}) {
  const t = useTime();
  // Slow drift on rim light positions for "studio lighting" feel
  const driftA = Math.sin(t * 0.4) * 40;
  const driftB = Math.cos(t * 0.3) * 30;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Base gradient floor */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 110%, rgba(212, 168, 73, ${0.08 * intensity}), transparent 60%)`,
      }} />
      {/* Blue rim light, top-left */}
      <div style={{
        position: 'absolute',
        left: -200 + driftA, top: -200,
        width: 900, height: 900,
        background: `radial-gradient(circle, rgba(80, 120, 220, ${0.18 * intensity}), transparent 60%)`,
        filter: 'blur(40px)',
      }} />
      {/* Purple rim light, bottom-right */}
      <div style={{
        position: 'absolute',
        right: -250 + driftB, bottom: -200,
        width: 1000, height: 1000,
        background: `radial-gradient(circle, rgba(140, 90, 200, ${0.16 * intensity}), transparent 60%)`,
        filter: 'blur(40px)',
      }} />
      {/* Subtle gold center */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        width: 1400, height: 1400,
        marginLeft: -700, marginTop: -700,
        background: `radial-gradient(circle, rgba(212, 168, 73, ${0.06 * intensity}), transparent 55%)`,
      }} />
      {/* Grain */}
      {showGrain && <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.08,
        mixBlendMode: 'overlay',
        background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.6'/></svg>")`,
      }} />}
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: 'inset 0 0 240px 60px rgba(0,0,0,0.7)',
      }} />
    </div>
  );
}

// ── The hexagon logo (original mark — outer hex, inner circle dot) ─────────
function HexagonLogo({ size = 80, glow = 0, stroke = 1.5 }) {
  const s = size;
  const c = s / 2;
  const r = c - stroke;
  // Hex points (flat-top hexagon rotated 30deg = pointy-top)
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${c + r * Math.cos(a)},${c + r * Math.sin(a)}`);
  }
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{
      filter: glow > 0 ? `drop-shadow(0 0 ${12 * glow}px rgba(212, 168, 73, ${0.7 * glow}))` : 'none',
      overflow: 'visible',
    }}>
      <polygon points={pts.join(' ')} fill="none" stroke={BRAND.gold} strokeWidth={stroke} />
      <circle cx={c} cy={c} r={s * 0.11} fill="none" stroke={BRAND.gold} strokeWidth={stroke} />
      <circle cx={c} cy={c} r={s * 0.035} fill={BRAND.gold} />
    </svg>
  );
}

// ── Reusable stat card (used in dashboard scenes) ──────────────────────────
function StatCard({ label, value, sub, valueColor = BRAND.text, width = 280 }) {
  return (
    <div style={{
      width,
      padding: '18px 22px',
      background: 'linear-gradient(180deg, rgba(23,20,25,0.92), rgba(16,14,19,0.92))',
      border: `1px solid ${BRAND.border}`,
      borderRadius: 8,
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      <div style={{
        fontFamily: BRAND.sans, fontSize: 11, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: BRAND.textDim, marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: BRAND.serif, fontSize: 38, fontWeight: 600,
        color: valueColor, lineHeight: 1, marginBottom: 6,
      }}>{value}</div>
      <div style={{
        fontFamily: BRAND.serif, fontSize: 13, fontStyle: 'italic',
        color: BRAND.textFaint,
      }}>{sub}</div>
    </div>
  );
}

// ── Cursor sprite — moves with natural easing ───────────────────────────────
function Cursor({ path }) {
  const t = useTime();
  // path = [{t: time, x, y}], interpolated
  const xs = path.map(p => p.x);
  const ys = path.map(p => p.y);
  const ts = path.map(p => p.t);
  const x = interpolate(ts, xs, Easing.easeInOutCubic)(t);
  const y = interpolate(ts, ys, Easing.easeInOutCubic)(t);
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width: 22, height: 22,
      transform: 'translate(-2px, -2px)',
      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))',
      zIndex: 100,
      pointerEvents: 'none',
    }}>
      <svg width="22" height="22" viewBox="0 0 22 22">
        <path d="M2 2 L2 16 L6 12.5 L9 19 L11.5 18 L8.5 11.5 L14 11 Z"
          fill="#fff" stroke="#0a0a0a" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

window.BRAND = BRAND;
window.Atmosphere = Atmosphere;
window.HexagonLogo = HexagonLogo;
window.StatCard = StatCard;
window.Cursor = Cursor;
