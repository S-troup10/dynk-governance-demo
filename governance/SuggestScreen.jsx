// Suggest Amendment screen — keyboard-driven form

const SuggestScreen = ({ proposalId, onBack, onSubmit }) => {
  const data = window.DYNK_DATA;
  const p = data.proposals.find(x => x.id === proposalId);
  const [kind, setKind] = React.useState('amend');  // amend | counter | comment
  const [text, setText] = React.useState('');

  if (!p) return null;

  const kinds = [
    { id: 'amend',   label: 'Amend',   sub: 'Tweak wording or scope' },
    { id: 'counter', label: 'Counter', sub: 'Propose alternative' },
    { id: 'comment', label: 'Comment', sub: 'Discussion only' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppHeader title="Suggest" onBack={onBack} />

      <div style={{ flex: 1, minHeight: 0, padding: '0 20px 24px', overflowY: 'auto' }} className="no-scrollbar">
        {/* Context card */}
        <div style={{
          background: 'rgba(15,15,17,0.04)', borderRadius: 14,
          padding: '12px 14px', marginBottom: 18,
          fontSize: 12.5, color: '#5C5E68', lineHeight: 1.5,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
            color: '#0F0F11', letterSpacing: 0.04, marginBottom: 4,
          }}>{p.id}</div>
          <div style={{ color: '#0F0F11', fontWeight: 500 }}>{p.title}</div>
        </div>

        {/* Kind picker */}
        <div className="h-display" style={labelStyle}>Type</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
          {kinds.map(k => (
            <button key={k.id} onClick={() => setKind(k.id)} style={{
              background: kind === k.id ? '#0F0F11' : '#fff',
              color: kind === k.id ? '#fff' : '#0F0F11',
              border: kind === k.id ? '0' : '1px solid var(--dynk-line)',
              borderRadius: 16, padding: '12px 10px',
              cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                marginBottom: 2,
              }}>{k.label}</div>
              <div style={{ fontSize: 11, opacity: kind === k.id ? 0.8 : 0.6 }}>{k.sub}</div>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="h-display" style={labelStyle}>Your suggestion</div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={
            kind === 'amend' ? 'Suggest a specific edit. Quote the line you want changed and propose a replacement…' :
            kind === 'counter' ? 'Outline your counter-proposal. What\'s different and why?' :
            'Share your thinking with the community.'
          }
          style={{
            width: '100%', minHeight: 140,
            background: '#fff', border: '1px solid var(--dynk-line)',
            borderRadius: 16, padding: '14px 16px',
            fontFamily: 'var(--font-body)', fontSize: 14,
            lineHeight: 1.55, color: '#1A1A1A',
            resize: 'none', outline: 'none',
          }}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, color: '#A0A3B1', marginTop: 6,
        }}>
          <span>Markdown supported · Be specific</span>
          <span className="tnum">{text.length} / 600</span>
        </div>

        {/* Stake info */}
        <div style={{
          marginTop: 18, padding: '14px 16px',
          background: '#fff', border: '1px solid var(--dynk-line)',
          borderRadius: 16, fontSize: 12.5, lineHeight: 1.55,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: 'rgba(255,122,26,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C95400" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
            </svg>
          </div>
          <div>
            <strong style={{ color: '#0F0F11' }}>Stake: 5 DYNK.</strong>{' '}
            Refunded if your suggestion gets <strong style={{ color: '#0F0F11' }}>20+ upvotes</strong> within 48h. This deters spam without silencing minority views.
          </div>
        </div>
      </div>

      {/* Submit footer */}
      <div style={{
        padding: '14px 20px 26px',
        background: 'linear-gradient(180deg, rgba(232,235,244,0) 0%, rgba(232,235,244,0.95) 30%)',
      }}>
        <button
          disabled={text.trim().length < 10}
          onClick={() => onSubmit({ kind, text })}
          style={{
            width: '100%',
            background: text.trim().length >= 10 ? '#0F0F11' : 'rgba(15,15,17,0.25)',
            color: '#fff', border: 0, borderRadius: 999,
            padding: '16px', fontSize: 15, fontWeight: 500,
            cursor: text.trim().length >= 10 ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-body)',
            boxShadow: text.trim().length >= 10 ? '0 6px 20px rgba(15,15,17,0.22)' : 'none',
          }}>
          Post {kind === 'amend' ? 'amendment' : kind === 'counter' ? 'counter-proposal' : 'comment'}
        </button>
      </div>
    </div>
  );
};

const labelStyle = {
  fontSize: 11, fontWeight: 600, letterSpacing: 0.08,
  textTransform: 'uppercase', color: '#5C5E68', marginBottom: 8,
};

Object.assign(window, { SuggestScreen });
