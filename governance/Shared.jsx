// Shared building blocks: AppBar, TabBar, Avatar, Logo, status chips, vote bar
// Drops onto window.* for cross-script use.

const DynkLogo = ({ size = 28, glow = false }) => (
  <img
    src="../assets/dynk-logo.png"
    alt="DYNK"
    style={{
      height: size,
      width: 'auto',
      objectFit: 'contain',
      objectPosition: 'left center',
      filter: glow ? 'drop-shadow(0 4px 14px rgba(255,122,26,0.35))' : 'none',
    }}
  />
);

const DynkMark = ({ size = 36 }) => (
  // Just the D-monogram; we crop the full logo to the left ~30%
  <div style={{
    width: size, height: size,
    backgroundImage: 'url(../assets/dynk-logo.png)',
    backgroundSize: 'auto 100%',
    backgroundPosition: 'left center',
    backgroundRepeat: 'no-repeat',
    flexShrink: 0,
  }} />
);

const Avatar = ({ name = 'You', color = '#FF7A1A', size = 36 }) => {
  const initial = (name[0] || '?').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(160deg, ${color} 0%, #B8420C 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 600, fontSize: size * 0.4,
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    }}>{initial}</div>
  );
};

// Header bar — back btn + title (display font) + optional right actions
const AppHeader = ({ title, onBack, right = null }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '66px 20px 12px',  // 66 = clear iOS status bar + dynamic island
    minHeight: 110,
  }}>
    {onBack && (
      <button onClick={onBack} aria-label="Back" style={{
        width: 40, height: 40, borderRadius: '50%',
        background: '#fff', border: 0, cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F0F11" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
    )}
    <div className="h-display" style={{
      flex: 1, textAlign: onBack ? 'center' : 'left',
      fontSize: 17, paddingRight: onBack && !right ? 40 : 0,
      letterSpacing: 0,
    }}>{title}</div>
    {right}
  </div>
);

// Status chip for proposal state
const StatusChip = ({ status }) => {
  const map = {
    active:       { bg: 'rgba(255,122,26,0.12)', fg: '#C95400', dot: '#FF7A1A', label: 'Active' },
    discussion:   { bg: 'rgba(57,115,242,0.12)', fg: '#2A56C9', dot: '#3973F2', label: 'Discussion' },
    passed:       { bg: 'rgba(45,190,108,0.14)', fg: '#14893E', dot: '#2DBE6C', label: 'Passed' },
    implementing: { bg: 'rgba(45,190,108,0.14)', fg: '#14893E', dot: '#2DBE6C', label: 'Implementing' },
    rejected:     { bg: 'rgba(200,37,43,0.10)',  fg: '#9B1C21', dot: '#C8252B', label: 'Rejected' },
  };
  const s = map[status] || map.active;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.fg,
      padding: '5px 10px 5px 8px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 600, letterSpacing: 0.02,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, boxShadow: `0 0 8px ${s.dot}` }} />
      {s.label}
    </div>
  );
};

const Tag = ({ children }) => (
  <span style={{
    display: 'inline-block',
    fontSize: 11, fontWeight: 500, color: '#5C5E68',
    background: 'rgba(15,15,17,0.05)',
    padding: '4px 9px', borderRadius: 999,
    letterSpacing: 0.02,
  }}>{children}</span>
);

// Horizontal vote bar — green For / red Against, with threshold marker
const VoteBar = ({ forV, againstV, eligible, threshold = 0.5, compact = false }) => {
  const total = forV + againstV;
  const turnout = total / eligible;
  const forPct = total === 0 ? 0 : forV / total;
  const againstPct = total === 0 ? 0 : againstV / total;
  return (
    <div>
      <div style={{
        position: 'relative',
        height: compact ? 8 : 10,
        background: 'rgba(15,15,17,0.08)',
        borderRadius: 999, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${forPct * 100}%`,
          background: 'linear-gradient(90deg, #2DBE6C, #14893E)',
          transition: 'width 0.6s cubic-bezier(.2,.8,.2,1)',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: `${againstPct * 100}%`,
          background: 'linear-gradient(90deg, #C8252B, #8E1014)',
          transition: 'width 0.6s cubic-bezier(.2,.8,.2,1)',
        }} />
        {/* Threshold tick at 50% */}
        <div style={{
          position: 'absolute', left: `${threshold * 100}%`,
          top: -2, bottom: -2, width: 2, background: '#0F0F11',
          opacity: 0.4, transform: 'translateX(-1px)',
        }} />
      </div>
      {!compact && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 8, fontSize: 12, color: '#5C5E68',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <span><span style={{ color: '#14893E', fontWeight: 600 }}>{(forPct * 100).toFixed(1)}%</span> For</span>
          <span style={{ color: '#A0A3B1' }}>{(turnout * 100).toFixed(1)}% turnout · 50% needed</span>
          <span>Against <span style={{ color: '#9B1C21', fontWeight: 600 }}>{(againstPct * 100).toFixed(1)}%</span></span>
        </div>
      )}
    </div>
  );
};

const fmt = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
};

// Bottom tab bar matching the existing app shell — 4 tabs + center FAB
const TabBar = ({ active, onTabChange }) => {
  const tabs = [
    { id: 'wallet',     label: 'Wallet',     icon: 'wallet' },
    { id: 'history',    label: 'History',    icon: 'history' },
    { id: 'governance', label: 'Govern',     icon: 'govern',  highlight: true },
    { id: 'nfts',       label: 'NFTs',       icon: 'nfts' },
    { id: 'profile',    label: 'Profile',    icon: 'profile' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      zIndex: 50,
      paddingBottom: 22, paddingTop: 10,
      background: 'linear-gradient(180deg, rgba(232,235,244,0) 0%, rgba(232,235,244,0.85) 40%, rgba(232,235,244,0.95) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
        padding: '0 14px',
      }}>
        {tabs.map(t => (
          <button key={t.id}
            onClick={() => onTabChange && onTabChange(t.id)}
            style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, flex: 1, padding: '6px 2px',
              opacity: active === t.id ? 1 : 0.55,
            }}>
            <TabIcon icon={t.icon} active={active === t.id} highlight={t.highlight} />
            <div style={{
              fontSize: 10.5, fontWeight: active === t.id ? 600 : 500,
              color: '#0F0F11',
              fontFamily: 'var(--font-display)',
              letterSpacing: 0.02,
            }}>{t.label}</div>
          </button>
        ))}
      </div>
      <div style={{
        height: 5, width: 134, borderRadius: 3,
        background: '#0F0F11', margin: '14px auto 0',
      }} />
    </div>
  );
};

const TabIcon = ({ icon, active, highlight }) => {
  const stroke = '#0F0F11';
  if (icon === 'govern') {
    // Center "Govern" tab uses the orange FAB look — mini gavel
    return (
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: highlight ? 'linear-gradient(160deg, #FF8A2C, #E55A00)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: highlight ? '0 8px 22px rgba(229,90,0,0.45)' : 'none',
        marginBottom: -4,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 4l6 6"/>
          <path d="M9 9l6 6"/>
          <path d="M3 21l7-7"/>
          <path d="M16 2l6 6-3 3-6-6z"/>
        </svg>
      </div>
    );
  }
  const icons = {
    wallet:  <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12h3"/></>,
    history: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    nfts:    <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 14l4-4 4 4 3-3 5 5"/><circle cx="9" cy="9" r="1.5"/></>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {icons[icon]}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────
Object.assign(window, {
  DynkLogo, DynkMark, Avatar,
  AppHeader, StatusChip, Tag, VoteBar, TabBar, fmt,
});
