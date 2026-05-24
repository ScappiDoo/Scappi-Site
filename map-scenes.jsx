// map-scenes.jsx — Real-map versions of the world map + side-by-side admin

// ─── Reusable: the actual map image with chunk grid + cinematic touches ────
function RealMap({ width = 940, height = 560, markers = [], routes = [], showGrid = true, animated = true }) {
  const t = useTime();
  return (
    <div style={{
      position: 'relative',
      width, height,
      background: '#04030a',
      overflow: 'hidden',
    }}>
      {/* Map image, fit inside */}
      <img
        src={(window.__resources && window.__resources.worldMap) || "assets/world-map.png"}
        alt="World Map"
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: '92%',
          transform: 'translate(-50%, -50%)',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 0 24px rgba(212,168,73,0.18)) saturate(1.08)',
          pointerEvents: 'none',
        }}
        draggable="false"
      />

      {/* Subtle chunk grid overlay (the gold-yellow lines visible on the real map) */}
      {showGrid && (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* Faint quadrant cross — matches the gold gridlines in the real screenshot */}
          <line x1={width/2} y1="0" x2={width/2} y2={height}
            stroke="rgba(212,168,73,0.22)" strokeWidth="1" />
          <line x1="0" y1={height/2} x2={width} y2={height/2}
            stroke="rgba(212,168,73,0.22)" strokeWidth="1" />
        </svg>
      )}

      {/* Routes — drawn lines between markers */}
      {routes.length > 0 && (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <filter id="routeGlow"><feGaussianBlur stdDeviation="2" /></filter>
          </defs>
          {routes.map((r, i) => (
            <g key={i}>
              <path d={`M ${r.from.x} ${r.from.y} Q ${(r.from.x + r.to.x)/2} ${(r.from.y + r.to.y)/2 - 30} ${r.to.x} ${r.to.y}`}
                fill="none" stroke={BRAND.gold} strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={r.dashed ? "4 6" : "0"}
                filter="url(#routeGlow)" opacity="0.85" />
              <path d={`M ${r.from.x} ${r.from.y} Q ${(r.from.x + r.to.x)/2} ${(r.from.y + r.to.y)/2 - 30} ${r.to.x} ${r.to.y}`}
                fill="none" stroke="#fff5dd" strokeWidth="1"
                strokeLinecap="round" opacity="0.7" />
            </g>
          ))}
        </svg>
      )}

      {/* Markers (cities, route endpoints, caravans) */}
      {markers.map((m, i) => {
        const pulse = animated ? 0.5 + 0.5 * Math.sin(t * 3 + i) : 0.5;
        const color = m.color || BRAND.gold;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: m.x - 10, top: m.y - 10,
            width: 20, height: 20,
            pointerEvents: 'none',
          }}>
            {/* Pulsing outer ring (real-time feel) */}
            {animated && (
              <div style={{
                position: 'absolute', inset: 0,
                border: `2px solid ${color}`,
                borderRadius: m.shape === 'square' ? 0 : '50%',
                opacity: 0.4 - pulse * 0.3,
                transform: `scale(${1 + pulse * 1.4})`,
              }} />
            )}
            {/* Main dot */}
            <div style={{
              position: 'absolute',
              left: 4, top: 4, width: 12, height: 12,
              background: color,
              border: `2px solid ${m.outline || '#fff'}`,
              borderRadius: m.shape === 'square' ? 2 : '50%',
              boxShadow: `0 0 ${6 + pulse * 6}px ${color}`,
            }} />
            {/* Optional label */}
            {m.label && (
              <div style={{
                position: 'absolute',
                left: 22, top: 0,
                whiteSpace: 'nowrap',
                fontFamily: BRAND.serif, fontSize: 12, fontStyle: 'italic',
                color: BRAND.text,
                background: 'rgba(8,7,10,0.85)',
                padding: '2px 8px',
                border: `1px solid ${BRAND.borderSoft}`,
                borderRadius: 3,
                textShadow: '0 1px 0 rgba(0,0,0,0.8)',
              }}>{m.label}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACT IV (replacement) — Player World Map with the actual map image
// ═══════════════════════════════════════════════════════════════════════════
function ActWorldMap({ start = 11.0, end = 13.6 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const enter = clamp(localTime / 0.5, 0, 1);
        const exit = clamp((localTime - (duration - 0.4)) / 0.4, 0, 1);
        const opacity = enter * (1 - exit);

        // Subtle camera orbit + zoom
        const orbit = interpolate([0, duration], [4, -8], Easing.easeInOutCubic)(localTime);
        const zoom = interpolate([0, duration], [1.08, 0.96], Easing.easeOutCubic)(localTime);
        const ty = interpolate([0, duration], [40, -20])(localTime);

        // Caravan animates along the route
        const caravanT = clamp((localTime - 0.6) / (duration - 0.9), 0, 1);
        // From Goldhaven (left-side) to Highmoor (right) — approximate over the map
        const start_xy = { x: 280, y: 320 };
        const end_xy = { x: 740, y: 280 };
        const midX = (start_xy.x + end_xy.x) / 2;
        const midY = (start_xy.y + end_xy.y) / 2 - 30;
        // Quadratic bezier sampling
        const bezier = (t) => {
          const x = (1 - t) * (1 - t) * start_xy.x + 2 * (1 - t) * t * midX + t * t * end_xy.x;
          const y = (1 - t) * (1 - t) * start_xy.y + 2 * (1 - t) * t * midY + t * t * end_xy.y;
          return { x, y };
        };
        const car = bezier(caravanT);

        // "Live" tick — pulses subtly
        const livePulse = 0.4 + 0.6 * Math.abs(Math.sin(localTime * 2));

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: 2400,
            opacity,
          }}>
            <div style={{
              transform: `perspective(2400px) rotateX(${orbit}deg) scale(${zoom}) translateY(${ty}px)`,
              transformStyle: 'preserve-3d',
              width: 1500,
              background: 'linear-gradient(180deg, rgba(16,14,19,0.92), rgba(8,7,10,0.92))',
              border: `1px solid ${BRAND.border}`,
              borderRadius: 12,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}>
              {/* Toolbar — matches the actual UI */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 24,
                padding: '14px 22px',
                background: 'rgba(8,7,10,0.5)',
                borderBottom: `1px solid ${BRAND.borderSoft}`,
              }}>
                <div style={{
                  fontFamily: BRAND.serif, fontSize: 20, fontWeight: 600,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
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
                    fontSize: 13, color: BRAND.textDim,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: l.color }} />
                    {l.label}
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 3, background: BRAND.green, borderRadius: 2 }} />
                  <div style={{ fontFamily: BRAND.serif, fontStyle: 'italic', fontSize: 13, color: BRAND.textDim }}>
                    Active Route
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                {/* Live indicator */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 10px',
                  border: `1px solid ${BRAND.borderSoft}`,
                  borderRadius: 12,
                }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: 4,
                    background: BRAND.green,
                    boxShadow: `0 0 ${4 + livePulse * 6}px ${BRAND.green}`,
                    opacity: 0.5 + livePulse * 0.5,
                  }} />
                  <span style={{
                    fontFamily: BRAND.sans, fontSize: 9,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: BRAND.green,
                  }}>Live</span>
                </div>
                <div style={{
                  padding: '4px 14px',
                  border: `1px solid ${BRAND.borderSoft}`,
                  borderRadius: 4,
                  fontFamily: BRAND.serif, fontSize: 12,
                  fontStyle: 'italic',
                  color: BRAND.gold,
                }}>All Lands ▾</div>
                <div style={{
                  padding: '4px 14px',
                  background: `linear-gradient(180deg, ${BRAND.gold}33, ${BRAND.gold}11)`,
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: 4,
                  fontFamily: BRAND.serif, fontSize: 12,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: BRAND.gold,
                }}>Refresh</div>
              </div>

              <div style={{ display: 'flex' }}>
                {/* Map area */}
                <div style={{ flex: 1, padding: 24 }}>
                  <RealMap
                    width={1040} height={560}
                    routes={[{ from: start_xy, to: end_xy }]}
                    markers={[
                      { x: start_xy.x, y: start_xy.y, color: BRAND.gold, outline: '#fff', label: 'Goldhaven' },
                      { x: end_xy.x,   y: end_xy.y,   color: BRAND.gold, outline: '#fff', label: 'Highmoor' },
                      caravanT > 0.02 && caravanT < 0.98 && {
                        x: car.x, y: car.y, color: BRAND.green, outline: '#fff', shape: 'circle',
                      },
                    ].filter(Boolean)}
                  />
                </div>

                {/* Side rail */}
                <div style={{
                  width: 360,
                  borderLeft: `1px solid ${BRAND.borderSoft}`,
                  padding: '20px 22px',
                  background: 'rgba(8,7,10,0.4)',
                }}>
                  <div style={{
                    fontFamily: BRAND.serif, fontSize: 17, fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: BRAND.gold, marginBottom: 16,
                  }}>Live Analytics Data</div>
                  {[
                    { label: 'Active Connections', val: '12' },
                    { label: 'Active Sessions', val: '47' },
                    { label: 'Routes Tracked', val: '8' },
                  ].map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '11px 0',
                      borderBottom: `1px solid ${BRAND.borderSoft}`,
                      fontFamily: BRAND.serif, fontSize: 14,
                    }}>
                      <span style={{ color: BRAND.textDim, fontStyle: 'italic' }}>{r.label}</span>
                      <span style={{ color: BRAND.gold, fontFamily: BRAND.mono }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{
                    marginTop: 22,
                    padding: '12px 14px',
                    background: 'rgba(90, 180, 122, 0.08)',
                    border: `1px solid rgba(90, 180, 122, 0.3)`,
                    borderRadius: 6,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: 4,
                        background: BRAND.green,
                        boxShadow: `0 0 ${3 + livePulse * 4}px ${BRAND.green}`,
                      }} />
                      <span style={{
                        fontFamily: BRAND.sans, fontSize: 9,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: BRAND.green,
                      }}>Caravan en route</span>
                    </div>
                    <div style={{
                      fontFamily: BRAND.serif, fontSize: 14, color: BRAND.text,
                    }}>Goldhaven → Highmoor</div>
                    <div style={{
                      fontFamily: BRAND.serif, fontStyle: 'italic',
                      fontSize: 12, color: BRAND.textDim, marginTop: 2,
                    }}>ETA · {Math.max(0, 18 - Math.floor(caravanT * 18))}s · cargo $14.2K</div>
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
// ACT IV.5  Side-by-side: Player World Map ↔ Admin Route Map Editor
// ═══════════════════════════════════════════════════════════════════════════
function ActMapsSideBySide({ start = 13.4, end = 16.8 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const enter = clamp(localTime / 0.5, 0, 1);
        const exit = clamp((localTime - (duration - 0.4)) / 0.4, 0, 1);
        const opacity = enter * (1 - exit);
        const e = Easing.easeOutCubic(enter);

        // Two panels slide in from outside
        const leftX = (1 - e) * -120;
        const rightX = (1 - e) * 120;

        // Highlight label that drifts between the two panels
        // 0-1.4s: "PLAYER VIEW" label on left
        // 1.4-2.8s: "ADMIN VIEW" label on right
        const phase = localTime < 1.4 ? 'player' : 'admin';

        // Slight perspective + camera drift
        const tiltY = interpolate([0, duration], [-2, 2])(localTime);

        // Animation: route is being drawn in admin view
        const drawProg = clamp((localTime - 1.4) / 1.4, 0, 1);

        // Live indicator pulse
        const livePulse = 0.4 + 0.6 * Math.abs(Math.sin(localTime * 2.5));

        // Player caravan animates
        const caravanT = (localTime % 3) / 3;
        const pStart = { x: 230, y: 280 };
        const pEnd = { x: 600, y: 240 };
        const pMidX = (pStart.x + pEnd.x) / 2;
        const pMidY = (pStart.y + pEnd.y) / 2 - 26;
        const pCar = {
          x: (1 - caravanT) * (1 - caravanT) * pStart.x + 2 * (1 - caravanT) * caravanT * pMidX + caravanT * caravanT * pEnd.x,
          y: (1 - caravanT) * (1 - caravanT) * pStart.y + 2 * (1 - caravanT) * caravanT * pMidY + caravanT * caravanT * pEnd.y,
        };

        // Admin route markers (gold start, red end like screenshot)
        const adminStart = { x: 320, y: 200 };
        const adminEnd = { x: 600, y: 360 };
        // Live route preview during drawing
        const lerp = (a, b, t) => a + (b - a) * t;
        const drawnEnd = {
          x: lerp(adminStart.x, adminEnd.x, drawProg),
          y: lerp(adminStart.y, adminEnd.y, drawProg),
        };

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: 2400,
            opacity,
            padding: '40px 60px',
          }}>
            <div style={{
              display: 'flex', gap: 24,
              transform: `perspective(2400px) rotateY(${tiltY}deg)`,
              transformStyle: 'preserve-3d',
              width: '100%', maxWidth: 1780,
            }}>
              {/* ═══════ LEFT: Player World Map ═══════ */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(180deg, rgba(16,14,19,0.94), rgba(8,7,10,0.94))',
                border: `1px solid ${phase === 'player' ? BRAND.border : BRAND.borderSoft}`,
                borderRadius: 10,
                overflow: 'hidden',
                transform: `translateX(${leftX}px)`,
                boxShadow: phase === 'player'
                  ? `0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,73,0.15)`
                  : '0 30px 80px rgba(0,0,0,0.6)',
                transition: 'box-shadow 300ms, border-color 300ms',
              }}>
                {/* Toolbar */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px 18px',
                  background: 'rgba(8,7,10,0.5)',
                  borderBottom: `1px solid ${BRAND.borderSoft}`,
                }}>
                  <div style={{
                    fontFamily: BRAND.serif, fontSize: 16, fontWeight: 600,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: BRAND.gold,
                  }}>World Map</div>
                  {[
                    { color: BRAND.green, label: 'Travelling' },
                    { color: BRAND.red, label: 'In Danger' },
                  ].map(l => (
                    <div key={l.label} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: BRAND.serif, fontStyle: 'italic',
                      fontSize: 11, color: BRAND.textDim,
                    }}>
                      <div style={{ width: 7, height: 7, borderRadius: 4, background: l.color }} />
                      {l.label}
                    </div>
                  ))}
                  <div style={{ flex: 1 }} />
                  <LiveBadge pulse={livePulse} />
                </div>

                {/* Map */}
                <div style={{ padding: '20px' }}>
                  <RealMap
                    width={760} height={500}
                    routes={[{ from: pStart, to: pEnd }]}
                    markers={[
                      { x: pStart.x, y: pStart.y, color: BRAND.gold, outline: '#fff', label: 'Goldhaven' },
                      { x: pEnd.x,   y: pEnd.y,   color: BRAND.gold, outline: '#fff', label: 'Highmoor' },
                      { x: pCar.x, y: pCar.y, color: BRAND.green, outline: '#fff' },
                    ]}
                  />
                </div>

                {/* Bottom bar — current caravan */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 18px',
                  borderTop: `1px solid ${BRAND.borderSoft}`,
                  background: 'rgba(8,7,10,0.5)',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4,
                    background: BRAND.green,
                    boxShadow: `0 0 ${3 + livePulse * 4}px ${BRAND.green}`,
                  }} />
                  <div style={{
                    fontFamily: BRAND.serif, fontSize: 13, color: BRAND.text,
                  }}>Goldhaven → Highmoor</div>
                  <div style={{ flex: 1 }} />
                  <div style={{
                    fontFamily: BRAND.mono, fontSize: 12, color: BRAND.gold,
                  }}>$14.2K</div>
                  <div style={{
                    fontFamily: BRAND.mono, fontSize: 11, color: BRAND.textDim,
                  }}>ETA {Math.max(1, 18 - Math.floor(caravanT * 18))}s</div>
                </div>

                {/* Phase badge */}
                <PhaseBadge label="Player view" position="bottom-left" active={phase === 'player'} />
              </div>

              {/* ═══════ RIGHT: Admin Route Map Editor ═══════ */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(180deg, rgba(16,14,19,0.94), rgba(8,7,10,0.94))',
                border: `1px solid ${phase === 'admin' ? BRAND.border : BRAND.borderSoft}`,
                borderRadius: 10,
                overflow: 'hidden',
                transform: `translateX(${rightX}px)`,
                boxShadow: phase === 'admin'
                  ? `0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,73,0.15)`
                  : '0 30px 80px rgba(0,0,0,0.6)',
                transition: 'box-shadow 300ms, border-color 300ms',
              }}>
                {/* Toolbar */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 18px',
                  background: 'rgba(8,7,10,0.5)',
                  borderBottom: `1px solid ${BRAND.borderSoft}`,
                }}>
                  <div style={{
                    fontFamily: BRAND.serif, fontSize: 16, fontWeight: 600,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: BRAND.gold,
                  }}>Route Map Editor</div>
                  <div style={{
                    fontFamily: BRAND.serif, fontStyle: 'italic',
                    fontSize: 11, color: BRAND.textDim,
                  }}>Drag markers to set route, then Save All</div>
                  <div style={{ flex: 1 }} />
                  <div style={{
                    padding: '4px 12px',
                    background: `linear-gradient(180deg, ${BRAND.gold}33, ${BRAND.gold}11)`,
                    border: `1px solid ${BRAND.border}`,
                    borderRadius: 4,
                    fontFamily: BRAND.serif, fontSize: 11,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: BRAND.gold,
                  }}>✓ Save All</div>
                </div>

                {/* Mode buttons */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px',
                  borderBottom: `1px solid ${BRAND.borderSoft}`,
                  background: 'rgba(8,7,10,0.3)',
                }}>
                  <div style={{
                    fontFamily: BRAND.sans, fontSize: 10,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: BRAND.textDim, marginRight: 4,
                  }}>Mode:</div>
                  {[
                    { label: 'Select', active: true },
                    { label: 'New Route', active: false },
                    { label: 'New Stall', active: false },
                  ].map((m, i) => (
                    <div key={i} style={{
                      padding: '4px 12px',
                      border: `1px solid ${m.active ? BRAND.border : BRAND.borderSoft}`,
                      background: m.active ? `${BRAND.gold}22` : 'transparent',
                      borderRadius: 4,
                      fontFamily: BRAND.serif, fontSize: 11,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: m.active ? BRAND.gold : BRAND.textDim,
                    }}>{m.label}</div>
                  ))}
                </div>

                {/* Body: sidebar + map */}
                <div style={{ display: 'flex' }}>
                  {/* Routes / Stalls sidebar */}
                  <div style={{
                    width: 200,
                    borderRight: `1px solid ${BRAND.borderSoft}`,
                    padding: '14px 12px',
                    background: 'rgba(8,7,10,0.3)',
                    minHeight: 500,
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontFamily: BRAND.sans, fontSize: 9,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: BRAND.gold, marginBottom: 8,
                    }}><span>Routes</span><span>(2)</span></div>
                    {[
                      { name: 'Goldhaven', dest: 'Highmoor', color: BRAND.gold, active: true },
                      { name: 'Silverbrook', dest: 'Redforge', color: BRAND.gold, active: false },
                    ].map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 4px',
                        borderRadius: 3,
                        background: r.active ? `${BRAND.gold}18` : 'transparent',
                        marginBottom: 4,
                      }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: 3,
                          background: r.color,
                        }} />
                        <div style={{
                          fontFamily: BRAND.serif, fontSize: 11, color: BRAND.text, fontWeight: 600,
                        }}>{r.name}</div>
                        <div style={{
                          fontFamily: BRAND.mono, fontSize: 9, color: BRAND.textDim,
                        }}>→ {r.dest}</div>
                      </div>
                    ))}

                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontFamily: BRAND.sans, fontSize: 9,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: BRAND.gold, marginTop: 14, marginBottom: 8,
                    }}><span>Market Stalls</span><span>(3)</span></div>
                    {['Goldhaven Bazaar', 'Highmoor Exchange', 'Ironpass Port'].map((s, i) => (
                      <div key={i} style={{
                        padding: '6px 4px',
                        fontFamily: BRAND.serif, fontSize: 11, color: BRAND.text,
                        borderBottom: i < 2 ? `1px solid ${BRAND.borderSoft}` : 'none',
                      }}>{s}</div>
                    ))}
                  </div>

                  {/* Map area */}
                  <div style={{ flex: 1, padding: '14px', position: 'relative' }}>
                    <RealMap
                      width={580} height={486}
                      markers={[
                        { x: adminStart.x, y: adminStart.y, color: BRAND.gold, outline: '#fff', shape: 'circle' },
                        { x: drawnEnd.x, y: drawnEnd.y, color: BRAND.red, outline: '#fff', shape: 'circle' },
                      ]}
                      routes={[{ from: adminStart, to: drawnEnd, dashed: drawProg < 0.99 }]}
                    />
                    {/* Hint chip mid-draw */}
                    {drawProg > 0.1 && drawProg < 0.95 && (
                      <div style={{
                        position: 'absolute',
                        left: drawnEnd.x + 30, top: drawnEnd.y - 12,
                        padding: '4px 10px',
                        background: 'rgba(8,7,10,0.9)',
                        border: `1px solid ${BRAND.borderSoft}`,
                        borderRadius: 4,
                        fontFamily: BRAND.mono, fontSize: 10,
                        color: BRAND.gold,
                        whiteSpace: 'nowrap',
                      }}>drag to place end…</div>
                    )}
                  </div>
                </div>

                {/* Phase badge */}
                <PhaseBadge label="Admin view" position="bottom-right" active={phase === 'admin'} />
              </div>
            </div>

            {/* Floating connector text between panels */}
            <div style={{
              position: 'absolute',
              top: 18, left: '50%', transform: 'translateX(-50%)',
              padding: '8px 24px',
              background: 'rgba(8,7,10,0.85)',
              border: `1px solid ${BRAND.borderSoft}`,
              borderRadius: 18,
              fontFamily: BRAND.sans, fontSize: 10,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: BRAND.gold,
              backdropFilter: 'blur(8px)',
              opacity: clamp((localTime - 0.3) / 0.5, 0, 1),
            }}>One map · Two views · Real time</div>
          </div>
        );
      }}
    </Sprite>
  );
}

function LiveBadge({ pulse }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '3px 9px',
      border: `1px solid rgba(90, 180, 122, 0.4)`,
      background: 'rgba(90, 180, 122, 0.08)',
      borderRadius: 11,
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: 3,
        background: BRAND.green,
        boxShadow: `0 0 ${3 + pulse * 5}px ${BRAND.green}`,
        opacity: 0.5 + pulse * 0.5,
      }} />
      <span style={{
        fontFamily: BRAND.sans, fontSize: 8,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: BRAND.green,
      }}>Live</span>
    </div>
  );
}

function PhaseBadge({ label, position, active }) {
  const isLeft = position === 'bottom-left';
  return (
    <div style={{
      position: 'absolute',
      [isLeft ? 'left' : 'right']: 14,
      top: 14,
      padding: '3px 10px',
      background: active ? `${BRAND.gold}22` : 'rgba(8,7,10,0.7)',
      border: `1px solid ${active ? BRAND.border : BRAND.borderSoft}`,
      borderRadius: 12,
      fontFamily: BRAND.sans, fontSize: 9,
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: active ? BRAND.gold : BRAND.textDim,
      transition: 'all 300ms',
      backdropFilter: 'blur(6px)',
    }}>{label}</div>
  );
}

window.RealMap = RealMap;
window.ActWorldMap = ActWorldMap;
window.ActMapsSideBySide = ActMapsSideBySide;
