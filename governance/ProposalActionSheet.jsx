// ProposalActionSheet — bottom sheet that pops up when user taps a proposal.
// Shows summary + actions: Cast your vote / Suggest amendment / Read full details.

const ProposalActionSheet = ({ proposalId, onClose, onVote, onSuggest, onDetails }) => {
  const data = window.DYNK_DATA;
  const p = data.proposals.find(x => x.id === proposalId);
  if (!p) return null;

  const total = p.forVotes + p.againstVotes;
  const forPct = total ? p.forVotes / total : 0;
  const turnout = total / p.eligible;
  const isClosed = p.status === 'passed' || p.status === 'rejected' || p.status === 'implementing';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      animation: 'fadeIn 0.2s ease-out',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15,15,17,0.55)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, #FBE5D2 0%, #F2E2D8 100%)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '12px 18px 28px',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.30)',
        animation: 'slideUp 0.32s cubic-bezier(0.2, 0.9, 0.3, 1)',
        maxHeight: '85%',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drag handle */}
        <div style={{
          width: 38, height: 4, borderRadius: 999,
          background: 'rgba(15,15,17,0.18)',
          margin: '0 auto 14px',
        }} />

        {/* Header — id + status + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 11.5, fontWeight: 700,
            color: '#0F0F11', letterSpacing: 0.04,
          }}>{p.id}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#A0A3B1' }} />
          <StatusChip status={p.status} />
          <span style={{ flex: 1 }} />
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%', border: 0,
            background: 'rgba(15,15,17,0.06)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F0F11" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="h-display" style={{
          fontSize: 20, lineHeight: 1.2, color: '#0F0F11',
          marginBottom: 12, textWrap: 'balance',
        }}>{p.title}</div>

        {/* Mini result bar */}
        <div style={{
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.55)',
          borderRadius: 16, padding: '12px 14px', marginBottom: 16,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 8,
          }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: '#A0A3B1', letterSpacing: 0.06, fontWeight: 600 }}>FOR</div>
                <div className="h-display tnum" style={{ fontSize: 18, color: '#14893E', lineHeight: 1, marginTop: 2 }}>
                  {(forPct * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#A0A3B1', letterSpacing: 0.06, fontWeight: 600 }}>AGAINST</div>
                <div className="h-display tnum" style={{ fontSize: 18, color: '#9B1C21', lineHeight: 1, marginTop: 2 }}>
                  {((1 - forPct) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#5C5E68', textAlign: 'right' }}>
              {(turnout * 100).toFixed(0)}% turnout<br/>
              <span style={{ color: p.status === 'active' ? '#C95400' : '#5C5E68', fontWeight: 600 }}>
                {p.status === 'active' ? `Ends ${p.endsIn}` : isClosed ? 'Closed' : ''}
              </span>
            </div>
          </div>
          <VoteBar forV={p.forVotes} againstV={p.againstVotes} eligible={p.eligible} />
        </div>

        {/* Action list */}
        {!isClosed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
            <SheetAction
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
              }
              iconBg="linear-gradient(160deg, #FF7A1A, #C95400)"
              title="Cast your vote"
              subtitle={`Voting as ${data.user.walletNumber} · 1 wallet, 1 vote`}
              primary
              onClick={onVote}
            />
            <SheetAction
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F0F11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              }
              iconBg="rgba(15,15,17,0.06)"
              title="Suggest amendment"
              subtitle="Propose a refinement before the vote ends"
              onClick={onSuggest}
            />
            <SheetAction
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F0F11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <path d="M14 2v6h6M9 13h6M9 17h4"/>
                </svg>
              }
              iconBg="rgba(15,15,17,0.06)"
              title="Read full proposal"
              subtitle="Changes, lifecycle, activity, and discussion"
              onClick={onDetails}
            />
          </div>
        )}

        {isClosed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SheetAction
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F0F11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <path d="M14 2v6h6M9 13h6M9 17h4"/>
                </svg>
              }
              iconBg="rgba(15,15,17,0.06)"
              title="View result & rollout"
              subtitle="See implementation timeline and on-chain status"
              primary
              onClick={onDetails}
            />
          </div>
        )}

        <div style={{
          fontSize: 11, color: '#5C5E68', textAlign: 'center',
          marginTop: 8,
        }}>
          {p.eligible.toLocaleString()} wallets eligible · {p.amendments} amendment{p.amendments === 1 ? '' : 's'} proposed
        </div>
      </div>
    </div>
  );
};

const SheetAction = ({ icon, iconBg, title, subtitle, primary, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px',
      background: primary ? '#0F0F11' : 'rgba(255,255,255,0.7)',
      border: primary ? 0 : '1px solid rgba(15,15,17,0.06)',
      borderRadius: 18, cursor: 'pointer', textAlign: 'left',
      color: primary ? '#fff' : '#0F0F11',
      boxShadow: primary ? '0 6px 18px rgba(15,15,17,0.18)' : 'none',
      transition: 'transform 0.12s',
      fontFamily: 'var(--font-body)',
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
        marginBottom: 2,
      }}>{title}</div>
      <div style={{
        fontSize: 11.5, opacity: primary ? 0.7 : 0.6, lineHeight: 1.35,
      }}>{subtitle}</div>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={primary ? '#fff' : '#A0A3B1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </button>
);

window.ProposalActionSheet = ProposalActionSheet;
