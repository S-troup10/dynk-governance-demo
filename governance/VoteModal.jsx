// Vote modal — bottom-sheet with For/Against, voting power slider

const VoteModal = ({ proposalId, onClose, onConfirm }) => {
  const data = window.DYNK_DATA;
  const p = data.proposals.find(x => x.id === proposalId);
  const [choice, setChoice] = React.useState(null);  // 'for' | 'against'

  if (!p) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(15,15,17,0.42)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      animation: 'fadeIn 0.18s ease',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(180deg, #F2E5D6 0%, #E5E6EE 60%, #DBDDE8 100%)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '14px 22px 28px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
        animation: 'slideUp 0.28s cubic-bezier(.2,.9,.25,1)',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'rgba(15,15,17,0.18)', margin: '0 auto 18px',
        }} />

        <div className="h-display" style={{ fontSize: 22, color: '#0F0F11', marginBottom: 4 }}>
          Cast your vote
        </div>
        <div style={{ fontSize: 12.5, color: '#5C5E68', marginBottom: 18 }}>
          {p.id} · {p.title}
        </div>

        {/* For/Against tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <button onClick={() => setChoice('for')} style={voteTile(choice === 'for', 'for')}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: choice === 'for' ? 'rgba(255,255,255,0.22)' : 'rgba(20,137,62,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={choice === 'for' ? '#fff' : '#14893E'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
              For
            </div>
            <div style={{ fontSize: 11.5, marginTop: 2, opacity: 0.85 }}>
              Approve as written
            </div>
          </button>
          <button onClick={() => setChoice('against')} style={voteTile(choice === 'against', 'against')}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: choice === 'against' ? 'rgba(255,255,255,0.22)' : 'rgba(155,28,33,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={choice === 'against' ? '#fff' : '#9B1C21'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
              Against
            </div>
            <div style={{ fontSize: 11.5, marginTop: 2, opacity: 0.85 }}>
              Reject this change
            </div>
          </button>
        </div>

        {/* Wallet info — flat 1 wallet, 1 vote */}
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: 18, padding: '14px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'rgba(255,122,26,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C95400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="14" rx="3"/>
              <path d="M16 13h.01M2 10h20"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, color: '#5C5E68' }}>Voting from</div>
            <div className="h-display" style={{ fontSize: 14.5, color: '#0F0F11', marginTop: 2 }}>
              {data.user.walletNumber} · 1 vote
            </div>
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(255,122,26,0.14)', color: '#C95400',
            fontSize: 11, fontWeight: 600, letterSpacing: 0.04,
          }}>{data.user.tier}</div>
        </div>

        {/* Confirm */}
        <button
          disabled={!choice}
          onClick={() => onConfirm({ choice })}
          style={{
            width: '100%',
            background: choice ? '#0F0F11' : 'rgba(15,15,17,0.25)',
            color: '#fff', border: 0, borderRadius: 999,
            padding: '16px', fontSize: 15, fontWeight: 500,
            cursor: choice ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-body)',
            boxShadow: choice ? '0 6px 20px rgba(15,15,17,0.22)' : 'none',
            transition: 'background 0.15s',
          }}>
          {choice ? `Confirm vote ${choice === 'for' ? 'FOR' : 'AGAINST'}` : 'Choose For or Against'}
        </button>

        <div style={{
          fontSize: 11, color: '#5C5E68', textAlign: 'center', marginTop: 10,
          lineHeight: 1.5,
        }}>
          Signed by your wallet · Immutable on-chain · You can change your vote until polls close.
        </div>
      </div>
    </div>
  );
};

const voteTile = (selected, kind) => ({
  background: selected
    ? (kind === 'for' ? 'linear-gradient(160deg, #2DBE6C, #14893E)' : 'linear-gradient(160deg, #C8252B, #8E1014)')
    : 'rgba(255,255,255,0.7)',
  border: selected ? '0' : `2px solid ${kind === 'for' ? 'rgba(45,190,108,0.4)' : 'rgba(200,37,43,0.3)'}`,
  color: selected ? '#fff' : (kind === 'for' ? '#14893E' : '#9B1C21'),
  borderRadius: 18, padding: '18px 14px',
  cursor: 'pointer', textAlign: 'center',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
  boxShadow: selected ? `0 8px 22px ${kind === 'for' ? 'rgba(20,137,62,0.32)' : 'rgba(155,28,33,0.32)'}` : 'none',
  transition: 'all 0.15s',
  fontFamily: 'var(--font-body)',
});

Object.assign(window, { VoteModal });
