// Proposal Detail — full proposal w/ tabs, big vote bar, activity stream, action footer

const ChangesTable = ({ changes }) => (
  <div style={{
    background: '#fff', borderRadius: 18, overflow: 'hidden',
    border: '1px solid var(--dynk-line)',
  }}>
    <div style={{
      padding: '11px 16px', background: 'rgba(15,15,17,0.03)',
      fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
      letterSpacing: 0.08, textTransform: 'uppercase', color: '#5C5E68',
      borderBottom: '1px solid var(--dynk-line)',
    }}>Proposed changes</div>
    {changes.map((c, i) => (
      <div key={i} style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', gap: 10,
        padding: '13px 16px',
        borderBottom: i === changes.length - 1 ? 'none' : '1px solid var(--dynk-line)',
        fontSize: 13.5,
      }}>
        <div>
          <div style={{ fontSize: 11, color: '#A0A3B1', marginBottom: 2 }}>{c.label}</div>
          <div style={{ color: '#9B1C21', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>{c.from}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A3B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#A0A3B1', marginBottom: 2, opacity: 0 }}>—</div>
          <div style={{ color: '#14893E', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{c.to}</div>
        </div>
      </div>
    ))}
  </div>
);

const VoteResultPanel = ({ p }) => {
  const total = p.forVotes + p.againstVotes;
  const turnout = total / p.eligible;
  const forPct = total === 0 ? 0 : p.forVotes / total;
  const passed = forPct >= p.threshold && turnout >= p.quorum;

  return (
    <div style={{
      background: '#fff', borderRadius: 22, padding: 18,
      boxShadow: 'var(--shadow-card)',
    }}>
      <div className="h-display" style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 0.1,
        textTransform: 'uppercase', color: '#5C5E68', marginBottom: 14,
      }}>Live result</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10.5, color: '#A0A3B1', marginBottom: 4, letterSpacing: 0.06, fontWeight: 600 }}>FOR</div>
          <div className="h-display tnum" style={{ fontSize: 30, color: '#14893E', lineHeight: 1 }}>
            {(forPct * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: 11.5, color: '#5C5E68', fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>
            {fmt(p.forVotes)} wallets
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: 10.5, color: '#A0A3B1', marginBottom: 4, letterSpacing: 0.06, fontWeight: 600 }}>AGAINST</div>
          <div className="h-display tnum" style={{ fontSize: 30, color: '#9B1C21', lineHeight: 1 }}>
            {((1 - forPct) * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: 11.5, color: '#5C5E68', fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>
            {fmt(p.againstVotes)} wallets
          </div>
        </div>
      </div>

      <VoteBar forV={p.forVotes} againstV={p.againstVotes} eligible={p.eligible} />

      {/* Threshold tracker */}
      <div style={{
        marginTop: 14, padding: '11px 14px',
        background: passed ? 'rgba(45,190,108,0.10)' : 'rgba(15,15,17,0.04)',
        borderRadius: 12, fontSize: 12.5, lineHeight: 1.5,
        display: 'flex', alignItems: 'center', gap: 10, color: '#0F0F11',
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: passed ? '#2DBE6C' : 'rgba(15,15,17,0.1)',
          color: passed ? '#fff' : '#5C5E68',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {passed ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
            </svg>
          )}
        </div>
        <div>
          {passed
            ? <><strong>Threshold met.</strong> If results hold, this proposal will be implemented at the next epoch.</>
            : <><strong>50% + quorum needed.</strong> Currently <strong>{(forPct * 100).toFixed(1)}%</strong> for, <strong>{(turnout * 100).toFixed(0)}%</strong> turnout (need 20%).</>
          }
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ a }) => (
  <div style={{
    background: '#fff', borderRadius: 18, padding: '14px 16px',
    marginBottom: 10, border: '1px solid var(--dynk-line)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <Avatar name={a.who.replace('@','')} color="#5C5E68" size={28} />
      <span style={{ fontSize: 13, fontWeight: 600, color: '#0F0F11' }}>{a.who}</span>
      <span style={{
        fontSize: 10.5, padding: '2px 7px', borderRadius: 999,
        background: a.kind === 'amend' ? 'rgba(255,122,26,0.12)' : 'rgba(57,115,242,0.10)',
        color: a.kind === 'amend' ? '#C95400' : '#2A56C9',
        fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase',
      }}>{a.kind === 'amend' ? 'Amendment' : 'Comment'}</span>
      <span style={{ fontSize: 11, color: '#A0A3B1', marginLeft: 'auto' }}>{a.when}</span>
    </div>
    <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#1A1A1A', textWrap: 'pretty' }}>{a.text}</div>
    <div style={{
      display: 'flex', gap: 14, marginTop: 10,
      fontSize: 12, color: '#5C5E68',
    }}>
      <button style={btnPlain}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 10v11M3 21h4V10L11 3l1 1v6h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H7"/>
        </svg>
        <span className="tnum">{a.upvotes}</span>
      </button>
      <button style={btnPlain}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/>
        </svg>
        Reply
      </button>
    </div>
  </div>
);
const btnPlain = {
  background: 'transparent', border: 0, cursor: 'pointer',
  color: '#5C5E68', display: 'flex', alignItems: 'center', gap: 5,
  padding: 0, fontSize: 12,
};

const DetailScreen = ({ proposalId, onBack, onVote, onSuggest }) => {
  const data = window.DYNK_DATA;
  const p = data.proposals.find(x => x.id === proposalId);
  const [tab, setTab] = React.useState('overview');
  if (!p) return null;
  const isClosed = p.status === 'passed' || p.status === 'rejected' || p.status === 'implementing';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
      <div style={{
        flex: 1, overflowY: 'auto', minHeight: 0,
        paddingBottom: isClosed ? 160 : 280,
      }} className="no-scrollbar">
        <AppHeader title="Proposal" onBack={onBack} right={
          <button aria-label="Share" style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#fff', border: 0, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F0F11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/>
            </svg>
          </button>
        } />

        {/* Title block */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 11.5, fontWeight: 700,
              color: '#0F0F11', letterSpacing: 0.04, whiteSpace: 'nowrap',
            }}>{p.id}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#A0A3B1' }} />
            <StatusChip status={p.status} />
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 11.5, color: '#5C5E68', whiteSpace: 'nowrap' }}>{p.posted}</span>
          </div>
          <div className="h-display" style={{
            fontSize: 22, lineHeight: 1.18, color: '#0F0F11', marginBottom: 14,
            textWrap: 'balance',
          }}>{p.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(160deg, #FF7A1A, #B8420C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700,
              boxShadow: '0 0 0 2px #fff',
              flexShrink: 0,
            }}>D</div>
            <span style={{ fontSize: 13, color: '#0F0F11', fontWeight: 500 }}>
              {p.author}
            </span>
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 5 }}>
              {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px', display: 'flex', gap: 4, marginBottom: 14 }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'activity', label: `Activity · ${p.activity.length}` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 0',
              background: 'transparent', border: 0, cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5,
              color: tab === t.id ? '#0F0F11' : '#A0A3B1',
              borderBottom: `2px solid ${tab === t.id ? '#0F0F11' : 'transparent'}`,
              letterSpacing: 0.02,
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ padding: '0 20px' }}>
            <VoteResultPanel p={p} />

            {/* TL;DR */}
            {p.tldr && (
              <div style={{
                marginTop: 16,
                padding: '14px 16px',
                background: 'linear-gradient(160deg, rgba(255,122,26,0.10), rgba(255,122,26,0.02))',
                border: '1px solid rgba(255,122,26,0.22)',
                borderRadius: 16,
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10.5,
                  letterSpacing: 0.12, textTransform: 'uppercase', color: '#C95400',
                  background: '#fff', borderRadius: 6, padding: '3px 7px',
                  flexShrink: 0, marginTop: 2,
                }}>TL;DR</div>
                <div style={{
                  fontSize: 13.5, lineHeight: 1.55, color: '#2C2C30', textWrap: 'pretty',
                }}>{p.tldr}</div>
              </div>
            )}

            {/* Changes */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <ChangesTable changes={p.changes} />
            </div>

            {/* Sections */}
            {(p.sections || []).map((sec, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div className="h-display" style={{
                  fontSize: 16, fontWeight: 700, color: '#0F0F11',
                  marginBottom: 8, letterSpacing: '-0.005em',
                }}>{sec.heading}</div>
                {sec.paras.map((para, j) => (
                  <p key={j} style={{
                    margin: '0 0 10px', fontSize: 14, lineHeight: 1.65, color: '#2C2C30',
                    textWrap: 'pretty',
                  }}>{para}</p>
                ))}
              </div>
            ))}

            {/* Lifecycle */}
            <div className="h-display" style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 0.08,
              textTransform: 'uppercase', color: '#5C5E68', marginBottom: 10,
              marginTop: 4,
            }}>Lifecycle</div>
            <Timeline status={p.status} />

            {/* Footer meta */}
            <div style={{
              marginTop: 18, padding: '12px 14px',
              background: 'rgba(15,15,17,0.04)', borderRadius: 12,
              fontSize: 11.5, color: '#5C5E68', lineHeight: 1.6,
              display: 'flex', flexWrap: 'wrap', gap: '4px 12px',
            }}>
              <span><strong style={{ color: '#0F0F11' }}>{p.id}</strong> · drafted by {p.author}</span>
              <span>·</span>
              <span>{p.eligible.toLocaleString()} wallets eligible</span>
              <span>·</span>
              <span>{p.amendments} amendment{p.amendments === 1 ? '' : 's'}</span>
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div style={{ padding: '0 20px' }}>
            {p.activity.length === 0 ? (
              <div style={{
                padding: 32, textAlign: 'center', color: '#A0A3B1',
                fontSize: 13.5,
              }}>No comments or amendments yet.</div>
            ) : (
              p.activity.map((a, i) => <ActivityItem key={i} a={a} />)
            )}
          </div>
        )}
      </div>

      {/* Action footer */}
      {!isClosed && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 110,
          padding: '14px 20px',
          background: 'linear-gradient(180deg, rgba(232,235,244,0) 0%, rgba(232,235,244,0.95) 35%)',
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onSuggest} style={{
              flex: 1, ...btnSecondary,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F0F11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Suggest amendment
            </button>
            <button onClick={onVote} style={{
              flex: 1.5, ...btnPrimary,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>
              </svg>
              Cast your vote
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Timeline = ({ status }) => {
  // Drafted → Voting → Threshold met → Implementing → Live
  const steps = [
    { id: 'drafted',   label: 'Drafted by core team' },
    { id: 'voting',    label: 'Open for voting' },
    { id: 'threshold', label: 'Threshold check' },
    { id: 'epoch',     label: 'Implemented at epoch' },
  ];
  // Simplified: active=at index 1 in progress; passed/implementing=>3; rejected=>halted at 2
  const idx =
    status === 'active' ? 1 :
    status === 'passed' || status === 'implementing' ? 3 :
    status === 'rejected' ? 2 : 1;
  const halted = status === 'rejected';

  return (
    <div style={{ position: 'relative', paddingLeft: 24, marginBottom: 16 }}>
      <div style={{
        position: 'absolute', left: 9, top: 6, bottom: 6, width: 2,
        background: 'rgba(15,15,17,0.08)',
      }} />
      {steps.map((s, i) => {
        const done = i < idx;
        const current = i === idx;
        const dotColor = done ? '#2DBE6C' : current ? (halted ? '#C8252B' : '#FF7A1A') : 'rgba(15,15,17,0.15)';
        return (
          <div key={s.id} style={{ position: 'relative', paddingBottom: i === steps.length - 1 ? 0 : 16 }}>
            <div style={{
              position: 'absolute', left: -23, top: 0,
              width: 20, height: 20, borderRadius: '50%',
              background: dotColor,
              boxShadow: current ? `0 0 0 4px ${dotColor}33` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {done && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
              )}
            </div>
            <div style={{
              fontSize: 13, fontWeight: current ? 600 : 500,
              color: done || current ? '#0F0F11' : '#A0A3B1',
            }}>{s.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const btnPrimary = {
  background: '#0F0F11', color: '#fff', border: 0,
  borderRadius: 999, padding: '14px 18px',
  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14.5,
  cursor: 'pointer', boxShadow: '0 6px 20px rgba(15,15,17,0.18)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
};
const btnSecondary = {
  background: '#fff', border: '1px solid rgba(15,15,17,0.15)', color: '#0F0F11',
  borderRadius: 999, padding: '14px 18px',
  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14.5,
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
};

Object.assign(window, { DetailScreen });
