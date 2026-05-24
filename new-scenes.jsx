// new-scenes.jsx — view picker + pixelated tile map

// ═══════════════════════════════════════════════════════════════════════════
// ACT II.5  View Picker — appears after sign-in
// ═══════════════════════════════════════════════════════════════════════════
function ActViewPicker({ start = 5.0, end = 7.2 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const enter = clamp(localTime / 0.5, 0, 1);
        const eEnter = Easing.easeOutCubic(enter);
        const exit = clamp((localTime - (duration - 0.4)) / 0.4, 0, 1);
        const opacity = eEnter * (1 - exit);

        // Cards stagger in
        const card0In = clamp((localTime - 0.4) / 0.55, 0, 1);
        const card1In = clamp((localTime - 0.55) / 0.55, 0, 1);

        // Cursor moves from sign-in button area to hover the Player View card,
        // then over to Admin Panel
        const cursorX = interpolate(
          [0, 0.6, 1.3, 2.0],
          [1020, 760, 760, 1160],
          Easing.easeInOutCubic
        )(localTime);
        const cursorY = interpolate(
          [0, 0.6, 1.3, 2.0],
          [820, 580, 580, 580],
          Easing.easeInOutCubic
        )(localTime);

        // Player View card hover state (hovered 0.7–1.4s)
        const playerHover = clamp((localTime - 0.7) / 0.3, 0, 1) * (1 - clamp((localTime - 1.3) / 0.3, 0, 1));
        // Admin card hover state (hovered 1.5s+)
        const adminHover = clamp((localTime - 1.5) / 0.3, 0, 1);

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity,
            perspective: 1800,
          }}>
            {/* Header */}
            <div style={{
              opacity: clamp(localTime / 0.5, 0, 1),
              transform: `translateY(${(1 - eEnter) * -10}px)`,
              textAlign: 'center', marginBottom: 60,
            }}>
              <div style={{
                fontFamily: BRAND.serif, fontSize: 56, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: BRAND.gold,
                textShadow: '0 0 30px rgba(212, 168, 73, 0.3)',
              }}>ScappiTrade</div>
              <div style={{
                marginTop: 12,
                fontFamily: BRAND.serif, fontStyle: 'italic',
                fontSize: 22, color: BRAND.textDim,
                letterSpacing: '0.04em',
              }}>
                Welcome back, ScappiDoo — choose your view
              </div>
            </div>

            {/* The two cards */}
            <div style={{ display: 'flex', gap: 32 }}>
              <PickerCard
                title="Player View"
                desc="Your caravans, portfolio, trade agreements and market prices"
                icon="map"
                hover={playerHover}
                enter={card0In}
              />
              <PickerCard
                title="Admin Panel"
                desc="Full server control — routes, item market, players, audit log and broadcasts"
                icon="gear"
                hover={adminHover}
                enter={card1In}
              />
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 80,
              opacity: clamp((localTime - 0.6) / 0.5, 0, 1) * 0.6,
              fontFamily: BRAND.serif, fontStyle: 'italic',
              fontSize: 13, letterSpacing: '0.08em',
              color: BRAND.textFaint,
            }}>
              ScappiTrade · Diplomatic Economy Plugin
            </div>

            {/* Cursor */}
            <div style={{
              position: 'absolute',
              left: cursorX, top: cursorY,
              width: 22, height: 22,
              transform: 'translate(-2px, -2px)',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))',
              zIndex: 100,
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22">
                <path d="M2 2 L2 16 L6 12.5 L9 19 L11.5 18 L8.5 11.5 L14 11 Z"
                  fill="#fff" stroke="#0a0a0a" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function PickerCard({ title, desc, icon, hover, enter }) {
  const e = Easing.easeOutBack(enter);
  return (
    <div style={{
      width: 360, height: 280,
      padding: '40px 36px',
      background: hover > 0
        ? `linear-gradient(180deg, rgba(35,28,20,${0.85 + hover * 0.1}), rgba(22,16,12,${0.85 + hover * 0.1}))`
        : 'linear-gradient(180deg, rgba(23,20,25,0.85), rgba(16,14,19,0.85))',
      border: `1px solid ${hover > 0 ? 'rgba(212, 168, 73, ' + (0.3 + hover * 0.4) + ')' : BRAND.border}`,
      borderRadius: 10,
      backdropFilter: 'blur(24px)',
      boxShadow: hover > 0
        ? `0 30px 80px rgba(0,0,0,0.5), 0 0 ${20 + hover * 30}px rgba(212, 168, 73, ${0.1 + hover * 0.25}), inset 0 1px 0 rgba(255,255,255,0.06)`
        : '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      transform: `translateY(${(1 - e) * 30}px) scale(${0.92 + e * 0.08 + hover * 0.02})`,
      opacity: enter,
      transition: 'background 200ms, box-shadow 200ms',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: 28 }}>
        {icon === 'map' ? <PickerMapIcon hover={hover} /> : <PickerGearIcon hover={hover} />}
      </div>
      <div style={{
        fontFamily: BRAND.serif, fontSize: 28, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: BRAND.gold,
        textShadow: hover > 0 ? `0 0 ${10 + hover * 20}px rgba(212, 168, 73, ${0.3 + hover * 0.3})` : 'none',
        marginBottom: 14,
      }}>{title}</div>
      <div style={{
        fontFamily: BRAND.serif, fontStyle: 'italic',
        fontSize: 15, lineHeight: 1.5,
        color: BRAND.textDim,
        maxWidth: 280,
      }}>{desc}</div>
    </div>
  );
}

function PickerMapIcon({ hover }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{
      filter: hover > 0 ? `drop-shadow(0 0 ${6 * hover}px rgba(212,168,73,0.6))` : 'none',
    }}>
      {/* Stylized world map silhouette */}
      <path d="M 4 16 Q 8 12 14 14 Q 18 10 22 12 Q 28 9 32 13 Q 38 12 40 18 Q 38 24 34 24 Q 30 30 24 28 Q 18 32 12 28 Q 6 30 4 24 Z"
        fill={BRAND.gold} opacity="0.85" />
      <path d="M 20 8 Q 22 6 26 8 Q 30 10 28 14 Q 26 14 24 12 Q 22 12 20 8 Z"
        fill={BRAND.gold} opacity="0.6" />
      <path d="M 8 32 Q 12 30 14 34 Q 16 38 12 38 Q 8 36 8 32 Z"
        fill={BRAND.gold} opacity="0.5" />
    </svg>
  );
}

function PickerGearIcon({ hover }) {
  // Eight-tooth gear with center circle
  const teeth = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i;
    const cx = 22 + Math.cos(a) * 16;
    const cy = 22 + Math.sin(a) * 16;
    teeth.push(<rect key={i}
      x={cx - 3} y={cy - 3} width="6" height="6"
      transform={`rotate(${(180 / Math.PI) * a} ${cx} ${cy})`}
      fill={BRAND.gold} opacity="0.85" />);
  }
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{
      filter: hover > 0 ? `drop-shadow(0 0 ${6 * hover}px rgba(212,168,73,0.6))` : 'none',
    }}>
      {teeth}
      <circle cx="22" cy="22" r="13" fill={BRAND.gold} opacity="0.85" />
      <circle cx="22" cy="22" r="5" fill={BRAND.bg} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACT IV (replacement) — Pixelated tile world map
// ═══════════════════════════════════════════════════════════════════════════

// Procedural biome generator — deterministic from (x,y) so the map is stable
// across renders. Produces an irregular continent shape with green forests,
// blue winding rivers, sandy/desert edges, and rocky highlands.
function genTileMap(cols, rows) {
  // Hash-based pseudo-noise — fast and deterministic
  const hash = (x, y, seed = 0) => {
    let h = x * 374761393 + y * 668265263 + seed * 982451653;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  };
  // Smooth noise via 4-corner sample average with bilinear weights
  const noise = (x, y, scale, seed = 0) => {
    const sx = x / scale, sy = y / scale;
    const x0 = Math.floor(sx), y0 = Math.floor(sy);
    const fx = sx - x0, fy = sy - y0;
    const a = hash(x0, y0, seed);
    const b = hash(x0 + 1, y0, seed);
    const c = hash(x0, y0 + 1, seed);
    const d = hash(x0 + 1, y0 + 1, seed);
    // smoothstep
    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);
    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
  };

  const tiles = [];
  const cx = cols / 2, cy = rows / 2;
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      // Distance from center, normalized
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      // Continent shape — radial with noise
      const cont = noise(x, y, 8, 1) * 0.55 + noise(x, y, 3, 2) * 0.35;
      const radial = 1 - Math.sqrt(dx * dx + dy * dy * 1.1);
      const land = cont + radial * 0.6 - 0.45;

      let biome;
      if (land < 0.05) {
        biome = 'void'; // outside continent
      } else {
        // River network — based on second noise
        const river = noise(x, y, 6, 7);
        const moisture = noise(x, y, 12, 3);
        const heat = noise(x, y, 14, 5) + (y / rows) * 0.3;

        if (river > 0.45 && river < 0.53 && land > 0.1) {
          biome = 'water';
        } else if (land < 0.12) {
          biome = 'sand';
        } else if (heat > 0.8 && moisture < 0.4) {
          biome = 'desert';
        } else if (heat > 0.7 && moisture < 0.5) {
          biome = 'savanna';
        } else if (land > 0.5 && moisture > 0.4) {
          biome = 'forest';
        } else if (land > 0.4) {
          biome = 'grass';
        } else {
          biome = 'plains';
        }
      }
      row.push(biome);
    }
    tiles.push(row);
  }
  return tiles;
}

// Palette for biome → base color + accent (for tree dots, etc.)
const BIOME_COLORS = {
  void: null,
  water: ['#3a6bc4', '#4a7ed4'],
  sand: ['#d4b876', '#e1c989'],
  desert: ['#c89556', '#d4a868'],
  savanna: ['#a8a050', '#b8b060'],
  forest: ['#3a6e2a', '#4a7e3a'],
  grass: ['#5a9036', '#6aa040'],
  plains: ['#7aa840', '#8ab850'],
};

// Render tile map to a canvas (cached)
function TileMapCanvas({ cols = 80, rows = 50, tile = 12, seed = 0 }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = cols * tile;
    canvas.height = rows * tile;
    ctx.imageSmoothingEnabled = false;
    const map = genTileMap(cols, rows);
    // Background — dark void
    ctx.fillStyle = BRAND.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Hash for per-tile variation
    const hash = (x, y, s = 0) => {
      let h = x * 374761393 + y * 668265263 + s * 982451653;
      h = (h ^ (h >> 13)) * 1274126177;
      return ((h ^ (h >> 16)) >>> 0) / 4294967295;
    };
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const b = map[y][x];
        if (b === 'void') continue;
        const pal = BIOME_COLORS[b];
        // Pick base or accent randomly for variation
        const v = hash(x, y, seed);
        ctx.fillStyle = v > 0.65 ? pal[1] : pal[0];
        ctx.fillRect(x * tile, y * tile, tile, tile);
        // Add darker dots on forest tiles for "tree" texture
        if (b === 'forest' && v > 0.4) {
          ctx.fillStyle = '#2a5a1f';
          const dx = Math.floor(v * 7) % (tile - 3);
          const dy = Math.floor(v * 13) % (tile - 3);
          ctx.fillRect(x * tile + dx, y * tile + dy, 3, 3);
        }
        if (b === 'plains' && v > 0.8) {
          ctx.fillStyle = '#4a7822';
          const dx = Math.floor(v * 11) % (tile - 2);
          const dy = Math.floor(v * 17) % (tile - 2);
          ctx.fillRect(x * tile + dx, y * tile + dy, 2, 2);
        }
        // Water highlights
        if (b === 'water' && v > 0.85) {
          ctx.fillStyle = '#6a9ed8';
          ctx.fillRect(x * tile + 2, y * tile + 2, 2, 2);
        }
      }
    }
  }, [cols, rows, tile, seed]);
  return <canvas ref={canvasRef} style={{
    imageRendering: 'pixelated',
    display: 'block',
  }} />;
}

function ActFourPixel({ start = 10.4, end = 13.2 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const enter = clamp(localTime / 0.5, 0, 1);
        const exit = clamp((localTime - (duration - 0.4)) / 0.4, 0, 1);
        const opacity = enter * (1 - exit);

        // Camera orbit
        const orbit = interpolate([0, duration], [0, -22], Easing.easeInOutCubic)(localTime);
        const zoom = interpolate([0, duration], [1.25, 0.95], Easing.easeOutCubic)(localTime);
        const ty = interpolate([0, duration], [80, -40])(localTime);

        // Trail draw — passes over tile map
        const trailProgress = clamp((localTime - 0.5) / (duration - 0.9), 0, 1);
        const trail = [
          { x: 220, y: 320 }, { x: 320, y: 280 }, { x: 420, y: 250 },
          { x: 540, y: 220 }, { x: 660, y: 240 }, { x: 760, y: 290 },
        ];
        const trailD = trail.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const dotT = clamp((localTime - 0.8) / (duration - 1.2), 0, 1);
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
              transform: `perspective(2400px) rotateX(${orbit}deg) rotateZ(-1deg) scale(${zoom}) translateY(${ty}px)`,
              transformStyle: 'preserve-3d',
              width: 1500,
              padding: 30,
              background: 'linear-gradient(180deg, rgba(16,14,19,0.92), rgba(8,7,10,0.92))',
              border: `1px solid ${BRAND.border}`,
              borderRadius: 12,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 24,
                padding: '10px 14px',
                background: 'rgba(8,7,10,0.5)',
                border: `1px solid ${BRAND.borderSoft}`,
                borderRadius: 8,
                marginBottom: 20,
              }}>
                <div style={{
                  fontFamily: BRAND.serif, fontSize: 20, fontWeight: 600,
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

              {/* Map + side rail */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  position: 'relative',
                  flex: 1,
                  background: 'rgba(4,3,6,0.6)',
                  border: `1px solid ${BRAND.borderSoft}`,
                  borderRadius: 6,
                  padding: 12,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'relative',
                    width: 960, height: 580,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      transform: `scale(${0.96 + 0.04 * Math.sin(localTime * 0.5)})`,
                      transformOrigin: 'center',
                    }}>
                      <TileMapCanvas cols={80} rows={50} tile={12} seed={3} />
                    </div>

                    {/* SVG overlay for trail + cities + caravan */}
                    <svg width="960" height="580" viewBox="0 0 960 580"
                      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      <defs>
                        <filter id="trailGlow">
                          <feGaussianBlur stdDeviation="3" />
                        </filter>
                      </defs>
                      {/* Trail glow */}
                      <path d={trailD} fill="none" stroke={BRAND.gold} strokeWidth="6"
                        strokeDasharray="2000"
                        strokeDashoffset={2000 * (1 - trailProgress)}
                        strokeLinecap="round" opacity="0.5"
                        filter="url(#trailGlow)" />
                      <path d={trailD} fill="none" stroke={BRAND.goldBright} strokeWidth="2.5"
                        strokeDasharray="2000"
                        strokeDashoffset={2000 * (1 - trailProgress)}
                        strokeLinecap="round" />

                      {/* Cities */}
                      {[
                        { x: 220, y: 320, name: 'Goldhaven' },
                        { x: 420, y: 250, name: 'Silverbrook' },
                        { x: 760, y: 290, name: 'Highmoor' },
                        { x: 480, y: 460, name: 'Redforge' },
                      ].map((c, i) => (
                        <g key={i}>
                          <rect x={c.x - 6} y={c.y - 6} width="12" height="12" fill="#000" opacity="0.5" />
                          <rect x={c.x - 5} y={c.y - 5} width="10" height="10" fill={BRAND.gold} />
                          <rect x={c.x - 2} y={c.y - 2} width="4" height="4" fill={BRAND.bg} />
                          <rect x={c.x + 12} y={c.y - 8} width={c.name.length * 7 + 8} height="16"
                            fill="rgba(8,7,10,0.85)" stroke={BRAND.borderSoft} />
                          <text x={c.x + 16} y={c.y + 4} fontFamily={BRAND.serif} fontSize="13"
                            fontStyle="italic" fill={BRAND.text}>{c.name}</text>
                        </g>
                      ))}

                      {/* Caravan marker */}
                      {dotT > 0 && (
                        <g transform={`translate(${carX}, ${carY})`}>
                          <circle r="18" fill={BRAND.green} opacity="0.18" />
                          <circle r="11" fill={BRAND.green} opacity="0.35" />
                          <rect x="-5" y="-5" width="10" height="10" fill={BRAND.green} />
                          <rect x="-3" y="-3" width="6" height="6" fill="#fff" opacity="0.9" />
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                {/* Side panel: Live Analytics */}
                <div style={{
                  width: 360,
                  padding: '18px 22px',
                  background: 'rgba(8,7,10,0.6)',
                  border: `1px solid ${BRAND.borderSoft}`,
                  borderRadius: 8,
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
                    marginTop: 20,
                    fontFamily: BRAND.serif, fontStyle: 'italic', fontSize: 13,
                    color: BRAND.textFaint, textAlign: 'center',
                  }}>
                    {trailProgress > 0.3
                      ? 'Caravan en route · Goldhaven → Highmoor'
                      : 'No caravans on the road'}
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

window.ActViewPicker = ActViewPicker;
window.ActFourPixel = ActFourPixel;
window.TileMapCanvas = TileMapCanvas;
