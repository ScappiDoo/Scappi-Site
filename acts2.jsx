// acts2.jsx — final acts (IV: world map orbit, V: hero composition)

// ═══════════════════════════════════════════════════════════════════════════
// ACT IV (10.6 – 13.0s)  World map with animated caravan trail
// ═══════════════════════════════════════════════════════════════════════════
function ActFour() {
  // Stylized fantasy map — abstract polygon continent, NOT pixel-art Minecraft style
  // (original artwork; evokes the world map screen without copying the game tiles)
  const continentPath = "M 200 380 C 180 340 200 280 260 250 C 280 210 340 200 400 220 C 460 200 540 220 600 200 C 680 180 760 220 800 270 C 860 280 900 340 880 400 C 920 440 920 510 870 550 C 880 610 820 660 760 650 C 700 690 620 680 560 660 C 480 690 380 680 320 640 C 240 660 180 600 200 540 C 150 500 150 420 200 380 Z";

  return (
    <Sprite start={10.6} end={13.2}>
      {({ localTime }) => {
        const enter = clamp(localTime / 0.5, 0, 1);
        const exit = clamp((localTime - 2.0) / 0.4, 0, 1);
        const opacity = enter * (1 - exit);
        // Orbit / pull-back across the map
        const orbit = interpolate([0, 2.4], [0, -25], Easing.easeInOutCubic)(localTime);
        const zoom = interpolate([0, 2.4], [1.3, 1.0], Easing.easeOutCubic)(localTime);
        const ty = interpolate([0, 2.4], [120, -20])(localTime);

        // Caravan trail draws in 0.4–2.0s
        const trailProgress = clamp((localTime - 0.4) / 1.6, 0, 1);
        // Caravan dot travels along trail
        const dotT = clamp((localTime - 0.7) / 1.3, 0, 1);

        // Trail points (approximate path across the continent)
        const trail = [
          { x: 320, y: 460 }, { x: 380, y: 420 }, { x: 460, y: 410 },
          { x: 540, y: 380 }, { x: 620, y: 360 }, { x: 700, y: 380 },
          { x: 760, y: 440 },
        ];
        // Build SVG path
        const trailD = trail.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        // Caravan position along trail
        const idx = dotT * (trail.length - 1);
        const i0 = Math.floor(idx), i1 = Math.min(trail.length - 1, i0 + 1);
        const lerp = idx - i0;
        const carX = trail[i0].x + (trail[i1].x - trail[i0].x) * lerp;
        const carY = trail[i0].y + (trail[i1].y - trail[i0].y) * lerp;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: 2400,
            opacity,
          }}>
            <div style={{
              transform: `perspective(2400px) rotateX(${orbit}deg) rotateZ(-2deg) scale(${zoom}) translateY(${ty}px)`,
              transformStyle: 'preserve-3d',
              width: 1500,
              padding: 36,
              background: 'linear-gradient(180deg, rgba(16,14,19,0.85), rgba(8,7,10,0.85))',
              border: `1px solid ${BRAND.border}`,
              borderRadius: 12,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
            }}>
              {/* Header strip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                marginBottom: 24,
              }}>
                <div style={{
                  fontFamily: BRAND.serif, fontSize: 22, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: BRAND.gold,
                }}>World Map</div>
                {[
                  { color: BRAND.green, label: 'Travelling' },
                  { color: BRAND.red, label: 'In Danger' },
                  { color: BRAND.textFaint, label: 'Paused' },
                ].map(l => (
                  <div key={l.label} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: BRAND.serif, fontStyle: 'italic',
                    fontSize: 14, color: BRAND.textDim,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: l.color }} />
                    {l.label}
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 3, background: BRAND.green, borderRadius: 2 }} />
                  <div style={{ fontFamily: BRAND.serif, fontStyle: 'italic', fontSize: 14, color: BRAND.textDim }}>
                    Active Route
                  </div>
                </div>
              </div>

              {/* Map SVG */}
              <div style={{ position: 'relative' }}>
                <svg width="1000" height="560" viewBox="0 0 1000 700" style={{ display: 'block' }}>
                  {/* Ocean grid backdrop */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(80, 120, 220, 0.07)" strokeWidth="1" />
                    </pattern>
                    <radialGradient id="continent" cx="50%" cy="40%">
                      <stop offset="0%" stopColor="#3a2e1f" />
                      <stop offset="60%" stopColor="#2a2418" />
                      <stop offset="100%" stopColor="#1a1612" />
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" />
                    </filter>
                  </defs>
                  <rect width="1000" height="700" fill="url(#grid)" />

                  {/* Continent */}
                  <path d={continentPath} fill="url(#continent)" stroke={BRAND.goldDim} strokeWidth="1.2" />
                  {/* Inner gold trace */}
                  <path d={continentPath} fill="none" stroke={BRAND.gold} strokeWidth="0.6" opacity="0.4"
                    transform="translate(0, -2)" />

                  {/* Cities */}
                  {[
                    { x: 320, y: 460, name: 'Goldhaven' },
                    { x: 540, y: 380, name: 'Silverbrook' },
                    { x: 760, y: 440, name: 'Highmoor' },
                    { x: 460, y: 580, name: 'Redforge' },
                    { x: 700, y: 290, name: 'Ashenvale' },
                  ].map((c, i) => (
                    <g key={i}>
                      <circle cx={c.x} cy={c.y} r="6" fill={BRAND.gold} />
                      <circle cx={c.x} cy={c.y} r="12" fill="none" stroke={BRAND.gold} strokeWidth="1" opacity="0.5" />
                      <text x={c.x + 16} y={c.y + 5} fontFamily={BRAND.serif} fontSize="16"
                        fontStyle="italic" fill={BRAND.text}>{c.name}</text>
                    </g>
                  ))}

                  {/* Trail — drawn with dasharray */}
                  <path d={trailD} fill="none" stroke={BRAND.gold} strokeWidth="2.5"
                    strokeDasharray="2000"
                    strokeDashoffset={2000 * (1 - trailProgress)}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    opacity="0.9" />
                  <path d={trailD} fill="none" stroke={BRAND.goldBright} strokeWidth="1"
                    strokeDasharray="2000"
                    strokeDashoffset={2000 * (1 - trailProgress)}
                    strokeLinecap="round" />

                  {/* Caravan marker */}
                  {dotT > 0 && (
                    <g transform={`translate(${carX}, ${carY})`}>
                      <circle r="18" fill={BRAND.green} opacity="0.18" />
                      <circle r="10" fill={BRAND.green} opacity="0.35" />
                      <circle r="5" fill={BRAND.green} />
                      <circle r="5" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.7" />
                    </g>
                  )}
                </svg>

                {/* Side panel: Live Analytics */}
                <div style={{
                  position: 'absolute', top: 0, right: -360,
                  width: 320,
                  padding: '20px 24px',
                  background: 'rgba(8,7,10,0.6)',
                  border: `1px solid ${BRAND.borderSoft}`,
                  borderRadius: 8,
                  backdropFilter: 'blur(20px)',
                }}>
                  <div style={{
                    fontFamily: BRAND.serif, fontSize: 18, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: BRAND.gold, marginBottom: 18,
                  }}>Live Analytics</div>
                  {[
                    { label: 'Active Connections', val: '12' },
                    { label: 'Active Sessions', val: '47' },
                    { label: 'Routes Tracked', val: '8' },
                  ].map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: `1px solid ${BRAND.borderSoft}`,
                      fontFamily: BRAND.serif, fontSize: 14,
                    }}>
                      <span style={{ color: BRAND.textDim, fontStyle: 'italic' }}>{r.label}</span>
                      <span style={{ color: BRAND.gold, fontFamily: BRAND.mono }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{
                    marginTop: 16,
                    fontFamily: BRAND.serif, fontStyle: 'italic', fontSize: 13,
                    color: BRAND.textFaint, textAlign: 'center',
                  }}>
                    {trailProgress > 0.3 ? 'Caravan en route to Highmoor' : 'No caravans on the road'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACT V (12.8 – 15.0s)  Wide hero — floating glass stack
// ═══════════════════════════════════════════════════════════════════════════
function ActFive({ start = 12.8, end = 15.0 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const enter = clamp(localTime / 0.6, 0, 1);
        const e = Easing.easeOutCubic(enter);
        // Camera pulls back & rotates slightly
        const camScale = interpolate([0, 2.2], [1.05, 0.95], Easing.easeOutCubic)(localTime);

        // Three floating panel layers
        const panels = [
          { dx: -380, dy: -120, dz: -240, rot: -12, delay: 0 },
          { dx: 0, dy: 0, dz: 0, rot: 0, delay: 0.15 },
          { dx: 380, dy: 110, dz: -180, rot: 12, delay: 0.3 },
        ];

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: 2400,
          }}>
            <div style={{
              transform: `perspective(2400px) rotateX(8deg) scale(${camScale})`,
              transformStyle: 'preserve-3d',
              position: 'relative',
              width: 1400, height: 800,
            }}>
              {panels.map((p, i) => {
                const pEnter = clamp((localTime - p.delay) / 0.7, 0, 1);
                const pe = Easing.easeOutCubic(pEnter);
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    left: '50%', top: '50%',
                    width: 520, height: 320,
                    marginLeft: -260, marginTop: -160,
                    transform: `translate3d(${p.dx * pe}px, ${p.dy * pe}px, ${p.dz * pe}px) rotateY(${p.rot * pe}deg)`,
                    opacity: pe,
                    background: 'linear-gradient(180deg, rgba(23,20,25,0.92), rgba(16,14,19,0.92))',
                    border: `1px solid ${BRAND.border}`,
                    borderRadius: 10,
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
                    padding: '24px 28px',
                  }}>
                    {/* Mini dashboards for each panel */}
                    {i === 0 && <MiniPanelStocks />}
                    {i === 1 && <MiniPanelOverview />}
                    {i === 2 && <MiniPanelMarket />}
                  </div>
                );
              })}

              {/* Final wordmark + CTA */}
              <div style={{
                position: 'absolute',
                left: '50%', bottom: -120,
                transform: `translateX(-50%) translateY(${(1 - e) * 30}px)`,
                opacity: clamp((localTime - 1.0) / 0.6, 0, 1),
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                  <HexagonLogo size={48} glow={0.5} />
                </div>
                <div style={{
                  fontFamily: BRAND.serif, fontSize: 56, fontWeight: 600,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: BRAND.gold,
                  textShadow: '0 0 30px rgba(212, 168, 73, 0.4)',
                  marginBottom: 10,
                }}>ScappiTrade</div>
                <div style={{
                  fontFamily: BRAND.serif, fontStyle: 'italic',
                  fontSize: 20, color: BRAND.textDim,
                  letterSpacing: '0.04em',
                }}>
                  Diplomatic Economy. Live Analytics. Trade with Honor.
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Mini panels for the final hero composition ──────────────────────────────
function MiniPanelOverview() {
  return (
    <div>
      <div style={{
        fontFamily: BRAND.serif, fontSize: 14, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: BRAND.gold, marginBottom: 14,
      }}>Overview</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { l: 'Gold', v: '$842K' },
          { l: 'Profit', v: '$318K', c: BRAND.green },
          { l: 'Active', v: '23' },
        ].map(s => (
          <div key={s.l} style={{
            padding: '10px 12px',
            background: 'rgba(8,7,10,0.5)',
            border: `1px solid ${BRAND.borderSoft}`,
            borderRadius: 6,
          }}>
            <div style={{
              fontFamily: BRAND.sans, fontSize: 8,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: BRAND.textDim, marginBottom: 4,
            }}>{s.l}</div>
            <div style={{
              fontFamily: BRAND.serif, fontSize: 20, fontWeight: 600,
              color: s.c || BRAND.text,
            }}>{s.v}</div>
          </div>
        ))}
      </div>
      {/* Sparkline */}
      <svg width="464" height="120" viewBox="0 0 464 120">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND.gold} stopOpacity="0.4" />
            <stop offset="100%" stopColor={BRAND.gold} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 0 80 L 40 70 L 80 78 L 120 60 L 160 65 L 200 45 L 240 50 L 280 30 L 320 38 L 360 22 L 400 28 L 464 14"
          fill="none" stroke={BRAND.gold} strokeWidth="2" />
        <path
          d="M 0 80 L 40 70 L 80 78 L 120 60 L 160 65 L 200 45 L 240 50 L 280 30 L 320 38 L 360 22 L 400 28 L 464 14 L 464 120 L 0 120 Z"
          fill="url(#sparkGrad)" />
      </svg>
      <div style={{
        marginTop: 8,
        fontFamily: BRAND.serif, fontStyle: 'italic', fontSize: 11,
        color: BRAND.textFaint,
      }}>Net profit · last 30 days</div>
    </div>
  );
}

function MiniPanelStocks() {
  const items = [
    { name: 'Iron Ore', price: '$24', delta: '+4%', up: true },
    { name: 'Wheat', price: '$8', delta: '-2%', up: false },
    { name: 'Spices', price: '$112', delta: '+9%', up: true },
    { name: 'Cloth', price: '$36', delta: '+1%', up: true },
    { name: 'Salt', price: '$14', delta: '-5%', up: false },
  ];
  return (
    <div>
      <div style={{
        fontFamily: BRAND.serif, fontSize: 14, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: BRAND.gold, marginBottom: 14,
      }}>Market Stocks</div>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 0',
          borderTop: i > 0 ? `1px solid ${BRAND.borderSoft}` : 'none',
        }}>
          <div style={{ flex: 1, fontFamily: BRAND.serif, fontSize: 14, color: BRAND.text }}>
            {it.name}
          </div>
          <div style={{ fontFamily: BRAND.mono, fontSize: 13, color: BRAND.gold }}>{it.price}</div>
          <div style={{
            fontFamily: BRAND.mono, fontSize: 11,
            color: it.up ? BRAND.green : BRAND.red,
            width: 36, textAlign: 'right',
          }}>{it.delta}</div>
        </div>
      ))}
    </div>
  );
}

function MiniPanelMarket() {
  return (
    <div>
      <div style={{
        fontFamily: BRAND.serif, fontSize: 14, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: BRAND.gold, marginBottom: 14,
      }}>Diplomacy</div>
      {[
        { name: 'Goldhaven', status: 'Allied', tone: BRAND.green },
        { name: 'Highmoor', status: 'Trade Pact', tone: BRAND.gold },
        { name: 'Redforge', status: 'Neutral', tone: BRAND.textDim },
        { name: 'Ashenvale', status: 'Embargo', tone: BRAND.red },
      ].map((d, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 0',
          borderTop: i > 0 ? `1px solid ${BRAND.borderSoft}` : 'none',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: `linear-gradient(135deg, ${d.tone}, rgba(0,0,0,0.4))`,
            border: `1px solid ${BRAND.borderSoft}`,
          }} />
          <div style={{ flex: 1, fontFamily: BRAND.serif, fontSize: 14, color: BRAND.text }}>
            {d.name}
          </div>
          <div style={{
            padding: '2px 10px',
            background: `${d.tone}22`,
            border: `1px solid ${d.tone}44`,
            borderRadius: 10,
            fontFamily: BRAND.sans, fontSize: 9,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: d.tone,
          }}>{d.status}</div>
        </div>
      ))}
    </div>
  );
}

window.ActFour = ActFour;
window.ActFive = ActFive;
