// Main app — wires up screens with click-thru navigation.
// Flow:
//   Hub → tap proposal → ActionSheet (bottom sheet over hub)
//     → "Cast your vote" → VoteModal → Receipt → back to Hub
//     → "Suggest amendment" → SuggestScreen → back to Hub
//     → "Read full proposal" → Detail screen (with its own footer actions)
//   Closed proposals → "View result & rollout" → ImplementedScreen

const { useState, useEffect } = React;

const STATE_PROPOSAL_OVERRIDES = {};

function App() {
  const [route, setRoute] = useState({ name: 'hub' });
  const [tab, setTab] = useState('governance');
  const [, force] = useState(0);
  const rerender = () => force(x => x + 1);

  useEffect(() => {
    const data = window.DYNK_DATA;
    data.proposals.forEach(p => {
      const o = STATE_PROPOSAL_OVERRIDES[p.id];
      if (o) Object.assign(p, o);
    });
  });

  const goHub = () => setRoute({ name: 'hub' });
  const goSheet = (id) => setRoute({ name: 'sheet', id });
  const goDetail = (id) => setRoute({ name: 'detail', id });
  const goVote = (id) => setRoute({ name: 'vote', id });
  const goSuggest = (id) => setRoute({ name: 'suggest', id });
  const goReceipt = (id, vote) => setRoute({ name: 'receipt', id, vote });
  const goImplemented = (id) => setRoute({ name: 'implemented', id });

  // Hub is always rendered as the base layer for sheet/vote routes.
  const renderHub = () => (
    <HubScreen onSelectProposal={goSheet} />
  );

  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ position: 'absolute', inset: 0 }} className="dynk-bg dynk-bg-flare" />
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Base layer */}
        {(route.name === 'hub' || route.name === 'sheet' || route.name === 'vote') && renderHub()}

        {route.name === 'detail' && (
          <DetailScreen
            proposalId={route.id}
            onBack={goHub}
            onVote={() => goVote(route.id)}
            onSuggest={() => goSuggest(route.id)}
          />
        )}

        {route.name === 'suggest' && (
          <SuggestScreen
            proposalId={route.id}
            onBack={() => goSheet(route.id)}
            onSubmit={() => {
              const p = window.DYNK_DATA.proposals.find(x => x.id === route.id);
              if (p) {
                p.amendments += 1;
                p.activity.unshift({
                  kind: 'amend', who: '@you', when: 'just now',
                  text: 'Your suggestion has been posted.', upvotes: 1,
                });
              }
              rerender();
              goHub();
            }}
          />
        )}

        {route.name === 'receipt' && (
          <VoteReceipt
            proposalId={route.id}
            vote={route.vote}
            onDone={goHub}
          />
        )}

        {route.name === 'implemented' && (
          <ImplementedScreen
            proposalId={route.id}
            onBack={goHub}
          />
        )}

        {/* Action sheet — pops over hub when proposal tapped */}
        {route.name === 'sheet' && (
          <ProposalActionSheet
            proposalId={route.id}
            onClose={goHub}
            onVote={() => goVote(route.id)}
            onSuggest={() => goSuggest(route.id)}
            onDetails={() => {
              const p = window.DYNK_DATA.proposals.find(x => x.id === route.id);
              if (p && (p.status === 'passed' || p.status === 'implementing')) {
                goImplemented(route.id);
              } else {
                goDetail(route.id);
              }
            }}
          />
        )}

        {/* Vote modal — pops over hub */}
        {route.name === 'vote' && (
          <VoteModal
            proposalId={route.id}
            onClose={() => goSheet(route.id)}
            onConfirm={(vote) => {
              const p = window.DYNK_DATA.proposals.find(x => x.id === route.id);
              if (p) {
                if (vote.choice === 'for') p.forVotes += 1;
                else p.againstVotes += 1;
              }
              goReceipt(route.id, vote);
            }}
          />
        )}

        {/* Tab bar — visible on hub, sheet, detail, implemented */}
        {(route.name === 'hub' || route.name === 'sheet' ||
          route.name === 'detail' || route.name === 'implemented') && (
          <TabBar active={tab} onTabChange={(t) => {
            setTab(t);
            if (t === 'governance') goHub();
          }} />
        )}
        </div>
      </div>
    </IOSDevice>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
