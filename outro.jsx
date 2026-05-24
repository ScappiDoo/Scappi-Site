// outro.jsx — 8-second outro: rapid revamp transition + split-screen price card

// ═══════════════════════════════════════════════════════════════════════════
// ACT VI  (16.0 – 21.0s)  Revamp transition — rapid cuts + light leaks
// ═══════════════════════════════════════════════════════════════════════════
function ActRevamp({ start = 16.0, end = 21.0 }) {
  // Each beat: { t, kind, label } — 12 quick cuts over 5 seconds
  // Cuts get faster as energy ramps up
  const beats = [
  { t: 0.00, kind: 'logo' },
  { t: 0.35, kind: 'signin' },
  { t: 0.65, kind: 'picker' },
  { t: 0.95, kind: 'stat' },
  { t: 1.25, kind: 'map' },
  { t: 1.55, kind: 'caravan' },
  { t: 1.85, kind: 'stat2' },
  { t: 2.15, kind: 'logo' },
  { t: 2.45, kind: 'spark' },
  { t: 2.75, kind: 'map' },
  { t: 3.05, kind: 'signin' },
  { t: 3.35, kind: 'stat' },
  { t: 3.65, kind: 'logo' },
  // Final hold builds toward outro card
  { t: 4.00, kind: 'wash' },
  { t: 5.20, kind: 'wash' }];


  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        // Light leak / shutter flashes between cuts
        // Motion blur grows toward end
        const overallProgress = clamp(localTime / duration, 0, 1);
        // Camera shake — small per-beat
        const shake = Math.sin(localTime * 32) * (1 - overallProgress) * 6;
        const shakeY = Math.cos(localTime * 27) * (1 - overallProgress) * 4;

        // Find current beat
        let currentBeat = beats[0];
        let nextBeat = beats[1];
        for (let i = 0; i < beats.length - 1; i++) {
          if (localTime >= beats[i].t && localTime < beats[i + 1].t) {
            currentBeat = beats[i];
            nextBeat = beats[i + 1];
            break;
          }
        }
        if (localTime >= beats[beats.length - 1].t) {
          currentBeat = beats[beats.length - 1];
          nextBeat = currentBeat;
        }

        // Time since current cut
        const cutDur = nextBeat.t - currentBeat.t;
        const cutT = (localTime - currentBeat.t) / Math.max(0.01, cutDur);

        // Flash intensity — peaks at start of each cut
        const flash = Math.max(0, 1 - cutT * 4);

        // Final wash to white→hold for outro entry
        const washIn = clamp((localTime - 4.5) / 0.5, 0, 1);

        return (
          <div style={{
            position: 'absolute', inset: 0,
            overflow: 'hidden',
            background: '#000'
          }}>
            {/* Current frame — with shake + slight motion blur */}
            <div style={{
              position: 'absolute', inset: 0,
              transform: `translate(${shake}px, ${shakeY}px) scale(${1 + (1 - cutT) * 0.04})`,
              filter: `blur(${(1 - cutT) * 1.5}px)`,
              opacity: 1 - washIn * 0.8
            }}>
              <RevampFrame kind={currentBeat.kind} t={cutT} />
            </div>

            {/* Light leak — orange / amber streak crossing the frame */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${85 + flash * 30}deg, transparent 30%, rgba(245, 210, 122, ${0.5 * flash}) 50%, rgba(255, 200, 100, ${0.3 * flash}) 55%, transparent 70%)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none'
            }} />

            {/* Hard flash on each cut */}
            <div style={{
              position: 'absolute', inset: 0,
              background: '#fff',
              opacity: flash * 0.25,
              mixBlendMode: 'overlay',
              pointerEvents: 'none'
            }} />

            {/* Color rim — alternates blue/purple per beat */}
            <div style={{
              position: 'absolute', inset: 0,
              boxShadow: `inset 0 0 200px 40px rgba(${currentBeat.t * 100 % 255}, 80, 220, ${0.3 * (1 - cutT)})`,
              pointerEvents: 'none'
            }} />

            {/* Scan/grain bands during fast cuts */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)',
              opacity: 0.6 + Math.sin(localTime * 80) * 0.2,
              pointerEvents: 'none'
            }} />

            {/* Final wash — fades to outro card */}
            <div style={{
              position: 'absolute', inset: 0,
              background: BRAND.bg,
              opacity: washIn,
              pointerEvents: 'none'
            }} />

            {/* "REVAMPED" wordmark briefly punches mid-act */}
            {localTime > 2.4 && localTime < 3.4 &&
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none'
            }}>
                <div style={{
                fontFamily: BRAND.serif,
                fontSize: 220,
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: BRAND.goldBright,
                textShadow: `0 0 60px ${BRAND.gold}, 0 8px 0 rgba(0,0,0,0.5)`,
                transform: `scale(${1 + (localTime - 2.4) * 0.15}) rotate(${Math.sin(localTime * 4) * 1.5}deg)`,
                opacity: 1 - clamp((localTime - 3.0) / 0.4, 0, 1),
                mixBlendMode: 'screen'
              }}>REVAMPED</div>
              </div>
            }
          </div>);

      }}
    </Sprite>);

}

// ── Per-beat content for the rapid cuts ─────────────────────────────────────
function RevampFrame({ kind, t }) {
  // t: 0→1 cut progress
  const slide = (1 - t) * 30;
  const zoom = 1.1 - t * 0.05;

  const common = {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transform: `scale(${zoom})`
  };

  if (kind === 'logo') {
    return (
      <div style={common}>
        <div style={{ transform: `translateY(${slide}px)` }}>
          <HexagonLogo size={300} glow={1.2} stroke={3} />
        </div>
      </div>);

  }

  if (kind === 'signin') {
    return (
      <div style={{ ...common, background: 'radial-gradient(ellipse at center, rgba(20,16,10,0.9), rgba(0,0,0,1))' }}>
        <div style={{
          fontFamily: BRAND.serif, fontSize: 120, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: BRAND.gold,
          textShadow: `0 0 40px ${BRAND.gold}`,
          transform: `translateY(${slide}px)`
        }}>Sign In</div>
      </div>);

  }

  if (kind === 'picker') {
    return (
      <div style={{ ...common, gap: 40, transform: `scale(${zoom}) translateX(${slide}px)` }}>
        {['PLAYER', 'ADMIN'].map((l, i) =>
        <div key={i} style={{
          width: 380, height: 480,
          border: `4px solid ${BRAND.gold}`,
          borderRadius: 16,
          background: 'linear-gradient(180deg, rgba(20,16,12,0.95), rgba(8,6,10,0.95))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: BRAND.serif, fontSize: 64, fontWeight: 700,
          letterSpacing: '0.16em', color: BRAND.gold,
          boxShadow: `0 0 60px ${BRAND.gold}99`
        }}>{l}</div>
        )}
      </div>);

  }

  if (kind === 'stat') {
    return (
      <div style={common}>
        <div style={{ textAlign: 'center', transform: `translateY(${slide * 0.5}px)` }}>
          <div style={{
            fontFamily: BRAND.sans, fontSize: 36,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: BRAND.textDim, marginBottom: 20
          }}>Gold Transported</div>
          <div style={{
            fontFamily: BRAND.serif, fontSize: 320, fontWeight: 700,
            color: BRAND.gold, lineHeight: 1,
            textShadow: `0 0 60px ${BRAND.gold}88`
          }}>$842K</div>
        </div>
      </div>);

  }

  if (kind === 'stat2') {
    return (
      <div style={common}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: BRAND.sans, fontSize: 32,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: BRAND.textDim, marginBottom: 20
          }}>Success Rate</div>
          <div style={{
            fontFamily: BRAND.serif, fontSize: 380, fontWeight: 700,
            color: BRAND.green, lineHeight: 1,
            textShadow: `0 0 80px ${BRAND.green}88`,
            transform: `scale(${1 + (1 - t) * 0.1})`
          }}>96%</div>
        </div>
      </div>);

  }

  if (kind === 'map') {
    return (
      <div style={{ ...common, overflow: 'hidden' }}>
        <div style={{
          transform: `scale(${1.4 + t * 0.15}) rotate(${(1 - t) * -4}deg)`
        }}>
          <img src={window.__resources && window.__resources.worldMap || "assets/world-map.png"} alt=""
          style={{
            width: 1400,
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 40px rgba(212,168,73,0.3))'
          }} draggable="false" />
        </div>
      </div>);

  }

  if (kind === 'caravan') {
    return (
      <div style={common}>
        <svg width="1600" height="900" viewBox="0 0 1600 900">
          <defs>
            <filter id="trailBlurOutro"><feGaussianBlur stdDeviation="8" /></filter>
          </defs>
          <path d="M 200 600 Q 600 300, 1000 450 T 1400 250"
          fill="none" stroke={BRAND.gold} strokeWidth="14"
          strokeLinecap="round" filter="url(#trailBlurOutro)" opacity="0.7" />
          <path d="M 200 600 Q 600 300, 1000 450 T 1400 250"
          fill="none" stroke={BRAND.goldBright} strokeWidth="4"
          strokeLinecap="round" />
          {[200, 700, 1400].map((x, i) =>
          <g key={i}>
              <circle cx={x} cy={600 - i * 175} r="40" fill={BRAND.gold} opacity="0.3" />
              <circle cx={x} cy={600 - i * 175} r="14" fill={BRAND.goldBright} />
            </g>
          )}
        </svg>
      </div>);

  }

  if (kind === 'spark') {
    return (
      <div style={common}>
        <svg width="1600" height="600" viewBox="0 0 1600 600">
          <defs>
            <linearGradient id="sparkBig" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND.gold} stopOpacity="0.6" />
              <stop offset="100%" stopColor={BRAND.gold} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 0 500 L 160 460 L 320 480 L 480 380 L 640 400 L 800 280 L 960 320 L 1120 180 L 1280 220 L 1440 100 L 1600 60"
          fill="none" stroke={BRAND.gold} strokeWidth="6" strokeLinecap="round" />
          <path d="M 0 500 L 160 460 L 320 480 L 480 380 L 640 400 L 800 280 L 960 320 L 1120 180 L 1280 220 L 1440 100 L 1600 60 L 1600 600 L 0 600 Z"
          fill="url(#sparkBig)" />
        </svg>
      </div>);

  }

  if (kind === 'wash') {
    return <div style={{ ...common, background: BRAND.bg }} />;
  }

  return <div style={common} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ACT VII (21.0 – 24.0s)  Split-screen outro — stills grid + price card
// ═══════════════════════════════════════════════════════════════════════════
function ActOutroCard({ start = 21.0, end = 24.0 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const enter = clamp(localTime / 0.7, 0, 1);
        const e = Easing.easeOutCubic(enter);
        // Slight settle / breath
        const settle = Math.sin((localTime - 0.7) * 1.2) * 2;

        // Stills cascade in
        const stillsIn = (i) => clamp((localTime - 0.2 - i * 0.1) / 0.5, 0, 1);

        // Price counts up to $49.99 from $0
        const priceProg = clamp((localTime - 0.5) / 0.9, 0, 1);
        const priceEased = Easing.easeOutCubic(priceProg);
        const priceVal = (49.99 * priceEased).toFixed(2);

        // Underline draws after price
        const underline = clamp((localTime - 1.6) / 0.5, 0, 1);

        // CTA button glow pulse
        const ctaPulse = Math.max(0, Math.sin((localTime - 1.8) * 3)) * clamp(localTime - 1.8, 0, 1);

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex',
            background: BRAND.bg,
            opacity: e
          }}>
            {/* LEFT: 2×2 value prop grid — explains the price */}
            <div style={{
              flex: 1.05,
              padding: '60px 50px',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center',
              gap: 22
            }}>
              <div style={{
                fontFamily: BRAND.sans, fontSize: 11,
                letterSpacing: '0.32em', textTransform: 'uppercase',
                color: BRAND.gold,
                opacity: clamp(localTime / 0.4, 0, 1),
                marginBottom: 6
              }}>What's included</div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: 18,
                flex: 1,
                maxHeight: 600
              }}>
                {[
                {
                  icon: 'caravan',
                  title: 'Full Server Economy',
                  body: 'Caravans, cargo, dynamic pricing, taxes, import duties — a complete in-game trade simulation.'
                },
                {
                  icon: 'dash',
                  title: 'Live Web Dashboard',
                  body: 'Player and admin views, real-time analytics, audit log, broadcasts — no console commands required.'
                },
                {
                  icon: 'diplo',
                  title: 'Diplomacy & Deals',
                  body: 'Trade pacts, embargoes, alliances. Negotiate route access between factions.'
                },
                {
                  icon: 'lifetime',
                  title: 'Lifetime Updates',
                  body: 'One payment. Every future patch, new feature, and bug fix included — no subscription.'
                }].
                map((s, i) => {
                  const v = stillsIn(i);
                  const ev = Easing.easeOutCubic(v);
                  return (
                    <div key={i} style={{
                      position: 'relative',
                      padding: '24px 26px',
                      background: 'linear-gradient(180deg, rgba(23,20,25,0.92), rgba(16,14,19,0.92))',
                      border: `1px solid ${BRAND.border}`,
                      borderRadius: 10,
                      backdropFilter: 'blur(16px)',
                      opacity: v,
                      transform: `translateY(${(1 - ev) * 26}px) scale(${0.96 + ev * 0.04})`,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
                      display: 'flex', flexDirection: 'column',
                      gap: 14
                    }}>
                      <ValueIcon kind={s.icon} />
                      <div style={{
                        fontFamily: BRAND.serif, fontSize: 22, fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: BRAND.gold,
                        lineHeight: 1.15
                      }}>{s.title}</div>
                      <div style={{
                        fontFamily: BRAND.serif, fontStyle: 'italic',
                        fontSize: 15, lineHeight: 1.5,
                        color: BRAND.textDim
                      }}>{s.body}</div>
                    </div>);

                })}
              </div>
            </div>

            {/* Right edge divider */}
            <div style={{
              width: 1,
              background: `linear-gradient(180deg, transparent, ${BRAND.border}, transparent)`,
              alignSelf: 'stretch',
              margin: '60px 0'
            }} />

            {/* RIGHT: Price card */}
            <div style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '60px 70px',
              gap: 16,
              transform: `translateY(${settle}px)`
            }}>
              {/* Mini logo */}
              <div style={{
                opacity: clamp(localTime / 0.4, 0, 1),
                transform: `scale(${clamp(localTime / 0.4, 0, 1)})`
              }}>
                <HexagonLogo size={64} glow={0.6} stroke={2} />
              </div>

              {/* Wordmark */}
              <div style={{
                fontFamily: BRAND.serif, fontSize: 56, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: BRAND.gold,
                textShadow: `0 0 30px ${BRAND.gold}55`,
                opacity: clamp((localTime - 0.2) / 0.4, 0, 1),
                transform: `translateY(${(1 - clamp((localTime - 0.2) / 0.4, 0, 1)) * 12}px)`
              }}>ScappiTrade</div>

              {/* Eyebrow */}
              <div style={{
                fontFamily: BRAND.sans, fontSize: 12,
                letterSpacing: '0.34em', textTransform: 'uppercase',
                color: BRAND.textDim,
                opacity: clamp((localTime - 0.4) / 0.4, 0, 1),
                marginTop: 8
              }}>One-time license · lifetime updates</div>

              {/* The price — bold, modern, dominant */}
              <div style={{
                position: 'relative',
                marginTop: 28,
                opacity: clamp((localTime - 0.5) / 0.4, 0, 1)
              }}>
                <div style={{
                  display: 'flex', alignItems: 'baseline',
                  fontFamily: BRAND.sans,
                  fontWeight: 800,
                  color: BRAND.text,
                  letterSpacing: '-0.04em'
                }}>
                  <span style={{
                    fontSize: 96,
                    color: BRAND.gold,
                    fontWeight: 600,
                    marginRight: 4,
                    fontFamily: BRAND.serif
                  }}>$</span>
                  <span style={{
                    fontSize: 220,
                    lineHeight: 0.9,
                    color: BRAND.text,
                    fontVariantNumeric: 'tabular-nums',
                    textShadow: `0 0 40px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.6)`
                  }}>{priceVal.split('.')[0]}</span>
                  <span style={{
                    fontSize: 110,
                    fontWeight: 600,
                    color: BRAND.textDim,
                    marginLeft: 4,
                    fontVariantNumeric: 'tabular-nums'
                  }}>.{priceVal.split('.')[1]}</span>
                </div>

                {/* Underline accent */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  bottom: -8,
                  height: 4,
                  width: `${underline * 100}%`,
                  background: `linear-gradient(90deg, ${BRAND.gold}, transparent)`,
                  borderRadius: 2
                }} />
              </div>

              {/* CTA button */}
              <div style={{
                marginTop: 36,
                opacity: clamp((localTime - 1.4) / 0.4, 0, 1),
                transform: `scale(${0.96 + clamp((localTime - 1.4) / 0.4, 0, 1) * 0.04 + ctaPulse * 0.02})`
              }}>
                <div style={{
                  padding: '20px 56px',
                  background: `linear-gradient(180deg, ${BRAND.gold}, #b58d35)`,
                  borderRadius: 8,
                  fontFamily: BRAND.serif, fontSize: 22, fontWeight: 600,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: '#1a1410',
                  boxShadow: `0 0 ${30 + ctaPulse * 40}px rgba(212, 168, 73, ${0.4 + ctaPulse * 0.4}), inset 0 1px 0 rgba(255,255,255,0.3)`,
                  whiteSpace: 'nowrap'
                }}>Get ScappiTrade</div>
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 24,
                fontFamily: BRAND.serif, fontStyle: 'italic',
                fontSize: 13, color: BRAND.textFaint,
                opacity: clamp((localTime - 1.8) / 0.4, 0, 1),
                letterSpacing: '0.06em'
              }}>ScappiTrade · Diplomatic Economy Plugin</div>
            </div>

            {/* Subtle gold rim glow on right side */}
            <div style={{
              position: 'absolute',
              right: 0, top: 0, bottom: 0,
              width: 400,
              background: `radial-gradient(ellipse at right center, rgba(212,168,73,0.12), transparent 70%)`,
              pointerEvents: 'none'
            }} />
          </div>);

      }}
    </Sprite>);

}

window.ActRevamp = ActRevamp;
window.ActOutroCard = ActOutroCard;

// ── Small monoline icons for the value prop cards ───────────────────────────
function ValueIcon({ kind }) {
  const stroke = BRAND.gold;
  const sw = 1.6;
  const wrap = (children) =>
  <div style={{
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: `${BRAND.gold}18`,
    border: `1px solid ${BRAND.border}`,
    borderRadius: 8
  }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">{children}</svg>
    </div>;


  if (kind === 'caravan') {
    // Wagon silhouette: round canopy + 2 wheels
    return wrap(<g>
      <path d="M 3 12 Q 3 6 11 6 Q 19 6 19 12 L 19 14 L 3 14 Z"
      stroke={stroke} strokeWidth={sw} fill="none" />
      <circle cx="7" cy="17" r="2" stroke={stroke} strokeWidth={sw} fill="none" />
      <circle cx="15" cy="17" r="2" stroke={stroke} strokeWidth={sw} fill="none" />
      <line x1="3" y1="9" x2="19" y2="9" stroke={stroke} strokeWidth={sw} opacity="0.5" />
    </g>);
  }
  if (kind === 'dash') {
    // Dashboard / bar chart with frame
    return wrap(<g>
      <rect x="3" y="3" width="16" height="16" rx="2" stroke={stroke} strokeWidth={sw} fill="none" />
      <rect x="6" y="11" width="2" height="5" fill={stroke} />
      <rect x="10" y="8" width="2" height="8" fill={stroke} />
      <rect x="14" y="6" width="2" height="10" fill={stroke} />
    </g>);
  }
  if (kind === 'diplo') {
    // Two clasped hands / handshake — simplified to two interlocking shapes
    return wrap(<g>
      <path d="M 3 11 L 8 6 L 11 9" stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 19 11 L 14 16 L 11 13" stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 8 6 L 14 16" stroke={stroke} strokeWidth={sw} opacity="0.5" />
      <circle cx="11" cy="11" r="1.5" fill={stroke} />
    </g>);
  }
  if (kind === 'lifetime') {
    // Infinity loop
    return wrap(<g>
      <path d="M 6 11 C 6 8 8 7 10 9 L 12 11 C 14 13 16 14 16 11 C 16 8 14 7 12 9 L 10 11 C 8 13 6 14 6 11 Z"
      stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" />
    </g>);
  }
  return wrap(<g><circle cx="11" cy="11" r="7" stroke={stroke} strokeWidth={sw} fill="none" /></g>);
}

window.ValueIcon = ValueIcon;