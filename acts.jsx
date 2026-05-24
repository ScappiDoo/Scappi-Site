// acts.jsx — the five acts of the showcase

// ═══════════════════════════════════════════════════════════════════════════
// ACT I  (0.0 – 3.0s)   Macro close-up on the hexagon mark
// ═══════════════════════════════════════════════════════════════════════════
function ActOne({ start = 0, end = 3.2 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        // Macro start: huge logo, slowly pulls back & wordmark fades in
        const scale = interpolate([0, 2.6, 3.2], [4.2, 1.6, 1.3], Easing.easeInOutCubic)(localTime);
        const logoY = interpolate([0, 3.2], [0, -70])(localTime);
        // Light sweep across logo at 0.4–1.4s
        const sweep = clamp((localTime - 0.4) / 1.0, 0, 1);
        // Wordmark fades in 1.2–2.2s
        const wordOpacity = clamp((localTime - 1.2) / 0.8, 0, 1);
        const wordY = (1 - wordOpacity) * 20;
        // Tagline 1.8–2.6s
        const tagOpacity = clamp((localTime - 1.8) / 0.6, 0, 1);
        // Exit fade for the whole act 2.8–3.2s
        const exit = clamp((localTime - 2.8) / 0.4, 0, 1);
        const opacity = 1 - exit;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity,
          }}>
            <div style={{
              transform: `scale(${scale}) translateY(${logoY * (1 - localTime / 3.2) * 0.3}px)`,
              transformOrigin: 'center',
              position: 'relative',
            }}>
              <HexagonLogo size={140} glow={0.6 + sweep * 0.4} stroke={1.8} />
              {/* Light sweep — a diagonal gold streak across the hex */}
              <div style={{
                position: 'absolute', inset: 0,
                overflow: 'hidden',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                pointerEvents: 'none',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  left: `${-100 + sweep * 200}%`,
                  width: '60%',
                  background: 'linear-gradient(110deg, transparent 30%, rgba(245, 210, 122, 0.55) 50%, transparent 70%)',
                  transform: 'skewX(-20deg)',
                  filter: 'blur(2px)',
                }} />
              </div>
            </div>

            <div style={{
              marginTop: 36,
              opacity: wordOpacity,
              transform: `translateY(${wordY}px)`,
              fontFamily: BRAND.serif,
              fontSize: 72,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: BRAND.gold,
              textTransform: 'uppercase',
              textShadow: '0 0 40px rgba(212, 168, 73, 0.35)',
            }}>
              ScappiTrade
            </div>

            <div style={{
              marginTop: 12,
              opacity: tagOpacity,
              fontFamily: BRAND.serif,
              fontStyle: 'italic',
              fontSize: 22,
              letterSpacing: '0.06em',
              color: BRAND.textDim,
            }}>
              Trade Analytics Dashboard
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACT II  (3.0 – 6.8s)  Sign-in card materializes from glass
// ═══════════════════════════════════════════════════════════════════════════
function ActTwo({ start = 2.8, end = 6.8 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        // Card entry: scale + fade
        const enter = clamp(localTime / 0.7, 0, 1);
        const eEnter = Easing.easeOutCubic(enter);
        // Glow pulse on enter button at 2.3s into act, but clamped to short acts
        const pulse = clamp((localTime - (duration - 1.7)) / 0.6, 0, 1);
        // Exit
        const exit = clamp((localTime - (duration - 0.5)) / 0.5, 0, 1);
        const opacity = eEnter * (1 - exit);
        // Subtle parallax/orbit
        const tilt = interpolate([0, duration], [0, 8])(localTime);
        const py = interpolate([0, duration], [40, -10])(localTime) * (1 - exit);

        // Digits filling in at 0.9–2.0s
        const digitProgress = clamp((localTime - 0.9) / 1.1, 0, 1);
        const filledDigits = Math.floor(digitProgress * 6);

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: 1800,
          }}>
            <div style={{
              transform: `perspective(1800px) rotateY(${tilt}deg) rotateX(2deg) translateY(${py}px) scale(${0.85 + eEnter * 0.15})`,
              opacity,
              transformStyle: 'preserve-3d',
            }}>
              {/* Mini hex + title above card */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ display: 'inline-block', opacity: clamp(localTime / 0.5, 0, 1) }}>
                  <HexagonLogo size={56} glow={0.4} />
                </div>
                <div style={{
                  fontFamily: BRAND.serif,
                  fontSize: 42, fontWeight: 600,
                  letterSpacing: '0.16em',
                  color: BRAND.gold,
                  textTransform: 'uppercase',
                  marginTop: 18,
                  opacity: clamp((localTime - 0.2) / 0.5, 0, 1),
                }}>ScappiTrade</div>
                <div style={{
                  fontFamily: BRAND.serif, fontStyle: 'italic',
                  fontSize: 18, color: BRAND.textDim,
                  marginTop: 6,
                  opacity: clamp((localTime - 0.4) / 0.5, 0, 1),
                }}>Trade Analytics Dashboard</div>
              </div>

              <div style={{
                width: 480,
                padding: '32px 38px',
                background: 'linear-gradient(180deg, rgba(23,20,25,0.85), rgba(16,14,19,0.85))',
                border: `1px solid ${BRAND.border}`,
                borderRadius: 10,
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  fontFamily: BRAND.serif, fontSize: 22, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: BRAND.gold, marginBottom: 22,
                }}>Sign In</div>
                <div style={{
                  fontFamily: BRAND.sans, fontSize: 10,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: BRAND.textDim, marginBottom: 10,
                }}>Login Code</div>
                <div style={{
                  height: 52,
                  background: 'rgba(8,7,10,0.6)',
                  border: `1px solid ${BRAND.borderSoft}`,
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 14,
                  fontFamily: BRAND.mono, fontSize: 22,
                  letterSpacing: '0.4em',
                  color: BRAND.text,
                  marginBottom: 20,
                }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <span key={i} style={{
                      color: i < filledDigits ? BRAND.gold : BRAND.textFaint,
                      transition: 'color 200ms',
                    }}>{i < filledDigits ? ['7', '2', '9', '4', '0', '1'][i] : '0'}</span>
                  ))}
                </div>
                <div style={{
                  height: 52,
                  background: `linear-gradient(180deg, ${BRAND.gold}, #b58d35)`,
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: BRAND.serif, fontSize: 18, fontWeight: 600,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#1a1410',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 0 ${20 + pulse * 30}px rgba(212, 168, 73, ${0.3 + pulse * 0.4}), inset 0 1px 0 rgba(255,255,255,0.3)`,
                  transform: `scale(${1 + pulse * 0.02})`,
                }}>Enter Dashboard</div>
                <div style={{
                  marginTop: 16, textAlign: 'center',
                  fontFamily: BRAND.serif, fontStyle: 'italic',
                  fontSize: 13, color: BRAND.textFaint,
                }}>
                  Get your code in-game with <span style={{ color: BRAND.goldDim, fontWeight: 600 }}>/caravan link</span>
                </div>
              </div>
            </div>

            {/* Cursor moves down toward the Enter button */}
            <Cursor path={[
              { t: 0.0, x: 1300, y: 400 },
              { t: 1.6, x: 1100, y: 760 },
              { t: 2.5, x: 1020, y: 805 },
              { t: 3.5, x: 1020, y: 805 },
            ]} />
          </div>
        );
      }}
    </Sprite>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACT III (6.6 – 10.6s)  Overview dashboard — stat cards cascade in 3D
// ═══════════════════════════════════════════════════════════════════════════
function ActThree({ start = 6.6, end = 10.8 }) {
  const stats = [
    { label: 'Gold Transported', value: '$842K', sub: 'lifetime cargo value', color: BRAND.text },
    { label: 'Net Profit', value: '$318K', sub: 'after import taxes', color: BRAND.green },
    { label: 'Deliveries', value: '1,247', sub: '1198 success · 49 failed', color: BRAND.text },
    { label: 'Success Rate', value: '96%', sub: 'completed vs destroyed', color: BRAND.green },
    { label: 'Active Now', value: '23', sub: 'caravans on the road', color: BRAND.text },
    { label: 'Agreements', value: '8', sub: 'active trade routes', color: BRAND.green },
  ];

  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const enter = clamp(localTime / 0.6, 0, 1);
        const exit = clamp((localTime - 3.7) / 0.5, 0, 1);
        const opacity = enter * (1 - exit);
        // Camera scroll: header in at start, gentle vertical pan
        const scrollY = interpolate([0, 4], [40, -80], Easing.easeInOutCubic)(localTime);
        // 3D tilt for cinematic
        const tiltX = interpolate([0, 4], [6, -2])(localTime);
        const tiltY = interpolate([0, 4], [-4, 4])(localTime);

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            perspective: 2200,
            opacity,
          }}>
            <div style={{
              transform: `perspective(2200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${scrollY}px)`,
              transformStyle: 'preserve-3d',
              width: 1700,
            }}>
              {/* Nav strip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 32,
                padding: '14px 28px',
                background: 'rgba(16,14,19,0.7)',
                border: `1px solid ${BRAND.borderSoft}`,
                borderRadius: 8,
                marginBottom: 28,
                backdropFilter: 'blur(20px)',
              }}>
                <HexagonLogo size={28} />
                <div style={{
                  fontFamily: BRAND.serif, fontSize: 20, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: BRAND.gold,
                }}>ScappiTrade</div>
                {['Overview', 'World Map', 'Stocks', 'Diplomacy', 'Deals', 'History', 'Market'].map((item, i) => (
                  <div key={item} style={{
                    fontFamily: BRAND.sans, fontSize: 11,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: i === 0 ? BRAND.gold : BRAND.textDim,
                    borderBottom: i === 0 ? `2px solid ${BRAND.gold}` : 'none',
                    paddingBottom: 4,
                  }}>{item}</div>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{
                  padding: '4px 12px',
                  border: `1px solid ${BRAND.borderSoft}`,
                  borderRadius: 12,
                  fontFamily: BRAND.sans, fontSize: 10,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: BRAND.gold,
                }}>Admin</div>
                <div style={{
                  fontFamily: BRAND.serif, fontStyle: 'italic',
                  fontSize: 14, color: BRAND.text,
                }}>ScappiDoo</div>
              </div>

              {/* Stat row 1 */}
              <div style={{ display: 'flex', gap: 18 }}>
                {stats.map((s, i) => {
                  // Each card staggers in
                  const cardStart = 0.3 + i * 0.12;
                  const cardEnter = clamp((localTime - cardStart) / 0.5, 0, 1);
                  const e = Easing.easeOutBack(cardEnter);
                  return (
                    <div key={i} style={{
                      opacity: cardEnter,
                      transform: `translateZ(${(1 - cardEnter) * -200}px) translateY(${(1 - e) * 40}px) scale(${0.85 + e * 0.15})`,
                    }}>
                      <StatCard {...s} valueColor={s.color} width={252} />
                    </div>
                  );
                })}
              </div>

              {/* Lower panels: Active Caravans + Top Traders */}
              <div style={{
                display: 'flex', gap: 20, marginTop: 22,
                opacity: clamp((localTime - 1.4) / 0.6, 0, 1),
              }}>
                <div style={{
                  flex: 1,
                  padding: '22px 26px',
                  background: 'linear-gradient(180deg, rgba(23,20,25,0.92), rgba(16,14,19,0.92))',
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: 8,
                  backdropFilter: 'blur(20px)',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 18,
                  }}>
                    <div style={{
                      fontFamily: BRAND.serif, fontSize: 22, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: BRAND.gold,
                    }}>Active Caravans</div>
                    <div style={{
                      padding: '2px 10px', borderRadius: 10,
                      background: 'rgba(212,168,73,0.12)',
                      fontFamily: BRAND.mono, fontSize: 11, color: BRAND.gold,
                    }}>23</div>
                  </div>
                  {[
                    { from: 'Goldhaven', to: 'Ironpass', val: '$14.2K', pct: 78, state: 'travel' },
                    { from: 'Silverbrook', to: 'Highmoor', val: '$8.6K', pct: 52, state: 'travel' },
                    { from: 'Redforge', to: 'Coastguard', val: '$22.0K', pct: 31, state: 'danger' },
                    { from: 'Ashenvale', to: 'Goldhaven', val: '$5.1K', pct: 91, state: 'travel' },
                  ].map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '10px 0',
                      borderTop: i > 0 ? `1px solid ${BRAND.borderSoft}` : 'none',
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: 4,
                        background: c.state === 'danger' ? BRAND.red : BRAND.green,
                        boxShadow: `0 0 8px ${c.state === 'danger' ? BRAND.red : BRAND.green}`,
                      }} />
                      <div style={{ flex: 1, fontFamily: BRAND.serif, fontSize: 15, color: BRAND.text }}>
                        {c.from} <span style={{ color: BRAND.textFaint }}>→</span> {c.to}
                      </div>
                      <div style={{
                        width: 100, height: 4,
                        background: 'rgba(244,237,224,0.08)',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${c.pct}%`, height: '100%',
                          background: c.state === 'danger' ? BRAND.red : BRAND.gold,
                        }} />
                      </div>
                      <div style={{
                        fontFamily: BRAND.mono, fontSize: 13,
                        color: BRAND.gold, width: 64, textAlign: 'right',
                      }}>{c.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{
                  flex: 1,
                  padding: '22px 26px',
                  background: 'linear-gradient(180deg, rgba(23,20,25,0.92), rgba(16,14,19,0.92))',
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: 8,
                  backdropFilter: 'blur(20px)',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 18,
                  }}>
                    <div style={{
                      fontFamily: BRAND.serif, fontSize: 22, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: BRAND.gold,
                    }}>Top Traders</div>
                    <div style={{
                      padding: '2px 10px', borderRadius: 10,
                      border: `1px solid ${BRAND.borderSoft}`,
                      fontFamily: BRAND.sans, fontSize: 9,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: BRAND.textDim,
                    }}>All Time</div>
                  </div>
                  {[
                    { name: 'Branwen', val: '$184K', delta: '+12%' },
                    { name: 'Kael Stormrider', val: '$162K', delta: '+8%' },
                    { name: 'Mira of Highmoor', val: '$148K', delta: '+5%' },
                    { name: 'ScappiDoo', val: '$129K', delta: '+18%' },
                  ].map((p, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '10px 0',
                      borderTop: i > 0 ? `1px solid ${BRAND.borderSoft}` : 'none',
                    }}>
                      <div style={{
                        width: 22, fontFamily: BRAND.serif, fontStyle: 'italic',
                        fontSize: 14, color: BRAND.textFaint,
                      }}>{i + 1}.</div>
                      <div style={{ flex: 1, fontFamily: BRAND.serif, fontSize: 15, color: BRAND.text }}>
                        {p.name}
                      </div>
                      <div style={{ fontFamily: BRAND.mono, fontSize: 12, color: BRAND.green }}>{p.delta}</div>
                      <div style={{
                        fontFamily: BRAND.mono, fontSize: 13,
                        color: BRAND.gold, width: 64, textAlign: 'right',
                      }}>{p.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

window.ActOne = ActOne;
window.ActTwo = ActTwo;
window.ActThree = ActThree;
