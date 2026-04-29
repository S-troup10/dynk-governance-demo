// Governance Hub — proposal list with filter chips + summary stats

const FilterChips = ({ active, onChange, counts }) => {
  const chips = [
    { id: 'active',   label: 'Active',   n: counts.active   },
    { id: 'passed',   label: 'Passed',   n: counts.passed   },
    { id: 'rejected', label: 'Rejected', n: counts.rejected },
    { id: 'all',      label: 'All',      n: counts.all      },
  ];
  return (
    <div style={{
      display: 'flex', gap: 7, padding: '4px 20px 18px',
      flexShrink: 0,
    }}>
      {chips.map(c => {
        const on = active === c.id;
        return (
          <button key={c.id} onClick={() => onChange(c.id)} style={{
            flex: 1, minWidth: 0,
            border: on ? '0' : '1px solid rgba(15,15,17,0.14)',
            background: on ? '#0F0F11' : 'rgba(255,255,255,0.5)',
            color: on ? '#fff' : '#0F0F11',
            padding: '9px 4px', borderRadius: 999,
            fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12.5,
            cursor: 'pointer', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'background 0.15s',
          }}>
            {c.label}
            <span style={{
              background: on ? 'rgba(255,255,255,0.18)' : 'rgba(15,15,17,0.06)',
              padding: '1px 6px', borderRadius: 999,
              fontSize: 10.5, fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              minWidth: 16, textAlign: 'center',
            }}>{c.n}</span>
          </button>
        );
      })}
    </div>
  );
};

const SummaryCard = ({ user, activeCount }) => (
  <div style={{
    margin: '0 20px 16px', padding: '20px 22px',
    borderRadius: 24,
    background: 'linear-gradient(165deg, #1A1A1E 0%, #0A0A0C 100%)',
    color: '#fff', position: 'relative', overflow: 'hidden',
  }}>
    {/* concentric arcs (logo motif) as bg */}
    <svg width="220" height="220" viewBox="0 0 220 220" style={{
      position: 'absolute', right: -50, top: -40, opacity: 0.16,
    }}>
      {[34, 52, 72, 92, 112].map((r) => (
        <path key={r}
          d={`M ${110 - r} 110 A ${r} ${r} 0 0 1 ${110 + r} 110`}
          stroke="url(#gradArc)" strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
      <defs>
        <linearGradient id="gradArc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF7A1A"/>
          <stop offset="100%" stopColor="#FFD7A8" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
    </svg>

    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 10.5, letterSpacing: 0.14, color: '#FF7A1A',
        textTransform: 'uppercase', fontWeight: 700,
        whiteSpace: 'nowrap',
      }}>{user.tier} Wallet</span>
      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 10.5, letterSpacing: 0.08, color: 'rgba(255,255,255,0.7)',
        fontWeight: 600, whiteSpace: 'nowrap',
      }}>{user.walletNumber}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, position: 'relative', zIndex: 1 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11.5, color: '#A0A3B1', marginBottom: 6, letterSpacing: 0.02 }}>Active votes</div>
        <div className="h-display tnum" style={{ fontSize: 36, color: '#fff', lineHeight: 1 }}>{activeCount}</div>
        <div style={{ fontSize: 11, color: '#A0A3B1', marginTop: 6 }}>open for voting now</div>
      </div>
      <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.12)', margin: '0 16px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11.5, color: '#A0A3B1', marginBottom: 6, letterSpacing: 0.02 }}>Your weight</div>
        <div className="h-display" style={{ fontSize: 22, color: '#fff', lineHeight: 1.05 }}>1 wallet<br/><span style={{ fontSize: 22 }}>1 vote</span></div>
        <div style={{ fontSize: 11, color: '#A0A3B1', marginTop: 6 }}>flat across all tiers</div>
      </div>
    </div>
  </div>
);

const ProposalCard = ({ p, onClick }) => {
  const total = p.forVotes + p.againstVotes;
  const forPct = total === 0 ? 0 : (p.forVotes / total) * 100;
  return (
    <button onClick={onClick} style={{
      display: 'block', width: 'calc(100% - 40px)', margin: '0 20px 12px',
      padding: '16px 18px', textAlign: 'left',
      background: '#fff', borderRadius: 22, border: 0,
      boxShadow: 'var(--shadow-card)', cursor: 'pointer',
      transition: 'transform 0.15s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 11.5,
            color: '#0F0F11', fontWeight: 700, letterSpacing: 0.04,
            whiteSpace: 'nowrap',
          }}>{p.id}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#A0A3B1' }} />
          <span style={{ fontSize: 11.5, color: '#5C5E68', whiteSpace: 'nowrap' }}>{p.posted}</span>
        </div>
        <StatusChip status={p.status} />
      </div>

      <div className="h-display" style={{
        fontSize: 17, lineHeight: 1.22, color: '#0F0F11',
        marginBottom: 8, textWrap: 'pretty',
      }}>{p.title}</div>

      <div style={{
        fontSize: 13, lineHeight: 1.5, color: '#5C5E68',
        marginBottom: 14, textWrap: 'pretty',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{p.summary}</div>

      <VoteBar forV={p.forVotes} againstV={p.againstVotes} eligible={p.eligible} compact />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 14, fontSize: 12, color: '#5C5E68', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#14893E" stroke="#14893E" strokeWidth="0">
              <path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 7.59 6.59C7.22 6.95 7 7.45 7 8v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-.98z"/>
            </svg>
            <span style={{ color: '#14893E', fontWeight: 600 }} className="tnum">{fmt(p.forVotes)}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#9B1C21" stroke="#9B1C21" strokeWidth="0">
              <path d="M22 3h-4v12h4V3zM2 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L10.83 23l5.59-5.59c.36-.36.58-.86.58-1.41V6c0-1.1-.9-2-2-2H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v.98z"/>
            </svg>
            <span style={{ color: '#9B1C21', fontWeight: 600 }} className="tnum">{fmt(p.againstVotes)}</span>
          </span>
          <span style={{ color: '#A0A3B1', whiteSpace: 'nowrap' }}>{p.amendments} edits</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          color: p.status === 'active' ? '#C95400' : '#5C5E68',
          whiteSpace: 'nowrap', fontSize: 11.5,
        }}>
          {p.status === 'active' ? `Ends ${p.ends}` : p.ends}
        </span>
      </div>
    </button>
  );
};

const HubScreen = ({ onSelectProposal, onPropose }) => {
  const data = window.DYNK_DATA;
  const [filter, setFilter] = React.useState('active');
  const counts = {
    all: data.proposals.length,
    active: data.proposals.filter(p => p.status === 'active').length,
    passed: data.proposals.filter(p => p.status === 'passed' || p.status === 'implementing').length,
    rejected: data.proposals.filter(p => p.status === 'rejected').length,
  };
  const list = filter === 'all'
    ? data.proposals
    : filter === 'passed'
      ? data.proposals.filter(p => p.status === 'passed' || p.status === 'implementing')
      : data.proposals.filter(p => p.status === filter);

  return (
    <div style={{
      flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0,
      paddingTop: 58,  // clear iOS status bar + dynamic island
      paddingBottom: 140,
    }} className="no-scrollbar">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '8px 20px 14px',
        gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="h-display" style={{
            fontSize: 28, color: '#0F0F11', lineHeight: 1.05,
            letterSpacing: '-0.015em',
          }}>Governance</div>
          <div style={{ fontSize: 13, color: '#5C5E68', marginTop: 4 }}>Vote, suggest, shape the protocol</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, marginTop: 2 }}>
          <button aria-label="Notifications" style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#fff', border: 0, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0F0F11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>
            </svg>
            <span style={{
              position: 'absolute', top: 8, right: 9,
              width: 8, height: 8, borderRadius: '50%',
              background: '#FF7A1A', border: '1.5px solid #fff',
            }} />
          </button>
          <Avatar name={data.user.name} color={data.user.avatarColor} size={40} />
        </div>
      </div>

      <SummaryCard user={data.user} activeCount={counts.active} />

      <FilterChips active={filter} onChange={setFilter} counts={counts} />

      {list.map(p => (
        <ProposalCard key={p.id} p={p} onClick={() => onSelectProposal(p.id)} />
      ))}

      {/* "Proposals come from core team" note */}
      <div style={{
        margin: '14px 20px 0', padding: '14px 16px',
        background: 'rgba(15,15,17,0.04)', borderRadius: 16,
        fontSize: 12.5, color: '#5C5E68', lineHeight: 1.55,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5E68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <div>
          <strong style={{ color: '#0F0F11', fontWeight: 600 }}>How it works.</strong>{' '}
          The DYNK core team drafts proposals. Founder &amp; Treasury holders vote and can suggest amendments. Anything reaching <strong style={{ color: '#0F0F11' }}>50% +1</strong> with quorum gets implemented at the next epoch.
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { HubScreen });
