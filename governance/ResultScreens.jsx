// Vote receipt + Implementation success screens

const VoteReceipt = ({ proposalId, vote, onDone }) => {
  const data = window.DYNK_DATA;
  const p = data.proposals.find(x => x.id === proposalId);
  if (!p) return null;
  const isFor = vote.choice === 'for';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
      <div style={{ flex: 1, padding: '40px 24px 24px', minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
        {/* Animated success disc */}
        <div style={{
          width: 110, height: 110, borderRadius: '50%',
          background: isFor
            ? 'linear-gradient(160deg, #2DBE6C, #14893E)'
            : 'linear-gradient(160deg, #555, #1A1A1A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: isFor ? '0 16px 40px rgba(20,137,62,0.35)' : '0 16px 40px rgba(15,15,17,0.3)',
          animation: 'pop 0.4s cubic-bezier(.2,.9,.25,1)',
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7"/>
          </svg>
        </div>

        <div className="h-display" style={{ fontSize: 28, color: '#0F0F11', marginBottom: 6 }}>
          Vote recorded
        </div>
        <div style={{ fontSize: 14, color: '#5C5E68', marginBottom: 28, maxWidth: 280, lineHeight: 1.5 }}>
          Your <strong style={{ color: isFor ? '#14893E' : '#9B1C21' }}>{isFor ? 'For' : 'Against'}</strong> vote on <strong style={{ color: '#0F0F11' }}>{p.id}</strong> is signed and on-chain.
        </div>

        {/* Receipt card */}
        <div style={{
          background: '#fff', borderRadius: 22, padding: 18,
          width: '100%', maxWidth: 320,
          border: '1px solid var(--dynk-line)',
          textAlign: 'left',
        }}>
          <Row k="Choice" v={
            <span style={{
              padding: '3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.04,
              background: isFor ? 'rgba(45,190,108,0.14)' : 'rgba(200,37,43,0.10)',
              color: isFor ? '#14893E' : '#9B1C21',
            }}>{isFor ? 'FOR' : 'AGAINST'}</span>
          } />
          <Row k="Wallet" v={<span style={{ fontFamily: 'var(--font-display)', fontSize: 12.5 }}>{data.user.walletNumber}</span>} />
          <Row k="Weight" v={<span style={{ fontWeight: 600 }}>1 vote</span>} />
          <Row k="Tx" v={<span style={{ fontFamily: 'var(--font-display)', fontSize: 12.5, color: '#FF7A1A' }}>0x9f3a…b41c</span>} last />
        </div>

        <div style={{
          marginTop: 18, fontSize: 12, color: '#A0A3B1', maxWidth: 280, lineHeight: 1.5,
        }}>
          You can change your vote until polls close in <strong style={{ color: '#0F0F11' }}>{p.ends}</strong>.
        </div>
      </div>

      <div style={{ padding: '14px 20px 26px' }}>
        <button onClick={onDone} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Back to proposal
        </button>
      </div>
    </div>
  );
};

const Row = ({ k, v, last }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '11px 0',
    borderBottom: last ? 'none' : '1px solid var(--dynk-line)',
  }}>
    <span style={{ fontSize: 12.5, color: '#5C5E68' }}>{k}</span>
    <span style={{ fontSize: 13, color: '#0F0F11' }}>{v}</span>
  </div>
);

// Closed/passed-and-implementing receipt screen — shown after polls close
const ImplementedScreen = ({ proposalId, onBack }) => {
  const data = window.DYNK_DATA;
  const p = data.proposals.find(x => x.id === proposalId);
  if (!p) return null;
  const total = p.forVotes + p.againstVotes;
  const forPct = (p.forVotes / total) * 100;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppHeader title="Result" onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '0 20px 140px' }} className="no-scrollbar">
        {/* Hero result */}
        <div style={{
          background: 'linear-gradient(165deg, #2DBE6C 0%, #14893E 100%)',
          borderRadius: 24, padding: 22, color: '#fff',
          position: 'relative', overflow: 'hidden', marginBottom: 16,
          boxShadow: '0 12px 36px rgba(20,137,62,0.32)',
        }}>
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute', right: -60, top: -60, opacity: 0.25 }}>
            {[40, 60, 80, 100, 120].map((r) => (
              <path key={r}
                d={`M ${120 - r} 120 A ${r} ${r} 0 0 1 ${120 + r} 120`}
                stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            ))}
          </svg>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.06, marginBottom: 14,
            textTransform: 'uppercase',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
            Passed · Implementing
          </div>

          <div className="h-display" style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 12, textWrap: 'balance' }}>
            {p.title}
          </div>

          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>Final result</div>
              <div className="h-display tnum" style={{ fontSize: 32 }}>{forPct.toFixed(1)}%</div>
              <div style={{ fontSize: 11.5, opacity: 0.85 }}>FOR · threshold met</div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>Turnout</div>
              <div className="h-display tnum" style={{ fontSize: 32 }}>{((total / p.eligible) * 100).toFixed(0)}%</div>
              <div style={{ fontSize: 11.5, opacity: 0.85 }}>{fmt(total)} of {fmt(p.eligible)} wallets</div>
            </div>
          </div>
        </div>

        {/* Implementation timeline */}
        <div className="h-display" style={{
          fontSize: 12, fontWeight: 600, letterSpacing: 0.08,
          textTransform: 'uppercase', color: '#5C5E68', marginBottom: 12,
        }}>Rollout</div>

        <div style={{
          background: '#fff', borderRadius: 18, padding: 16,
          border: '1px solid var(--dynk-line)', marginBottom: 16,
        }}>
          {[
            { label: 'Vote closed', time: '2h ago', done: true },
            { label: 'Audited by core team', time: '1h ago', done: true },
            { label: 'Deployed to testnet', time: 'now', done: true, current: true },
            { label: 'Mainnet at next epoch', time: 'in 13d 8h', done: false },
          ].map((s, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--dynk-line)',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: s.done ? '#2DBE6C' : 'rgba(15,15,17,0.08)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: s.current ? '0 0 0 4px rgba(45,190,108,0.18)' : 'none',
                flexShrink: 0,
              }}>
                {s.done && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
                )}
              </div>
              <div style={{ flex: 1, fontSize: 13.5, color: '#0F0F11', fontWeight: s.current ? 600 : 500 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11.5, color: s.current ? '#14893E' : '#A0A3B1', fontWeight: s.current ? 600 : 400 }}>
                {s.time}
              </div>
            </div>
          ))}
        </div>

        {/* What changes */}
        <div className="h-display" style={{
          fontSize: 12, fontWeight: 600, letterSpacing: 0.08,
          textTransform: 'uppercase', color: '#5C5E68', marginBottom: 10,
        }}>What changes</div>
        <ChangesTable changes={p.changes} />
      </div>
    </div>
  );
};

Object.assign(window, { VoteReceipt, ImplementedScreen });
