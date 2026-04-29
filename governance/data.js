/* DYNK Governance — sample data
   Three proposals + a current user with a Founder Wallet.
   Voting model: 1 wallet, 1 vote (no staking-for-power). */

window.DYNK_DATA = {
  user: {
    name: 'Satoshi Nakamoto',
    handle: 'gatnqhinakamntn@gmail.com',
    wallet: '7xKX...9fVz',
    walletNumber: 'DYNK #0061',
    tier: 'Founder',                  // Founder | Treasury
    avatarColor: '#FF7A1A',
  },

  team: {
    name: 'DYNK Core Team',
    handle: '@core',
  },

  proposals: [
    {
      id: 'DIP-014',
      title: 'Lower transaction fee from 1¢ to 0.5¢ for Founder wallets',
      summary: 'Reward founder-tier holders with halved network fees on all on-chain transactions, funded from the existing reward pool.',
      author: 'DYNK Core Team',
      authorHandle: '@core',
      posted: '2 days ago',
      ends: '5d 12h',
      endsIn: 'in 5d 12h',
      status: 'active',
      forVotes: 6_842,
      againstVotes: 1_205,
      eligible: 13_000,
      threshold: 0.5,
      quorum: 0.20,
      tags: ['Treasury', 'Fees'],
      amendments: 4,
      comments: 28,

      tldr: 'Cut on-chain fees by 50% for the 800 Founder Wallets. Funded from the existing reward pool, not treasury reserves. Treasury wallets unaffected. Rolls out at the next protocol epoch (~14 days after vote closes).',

      sections: [
        {
          heading: 'Background',
          paras: [
            'DYNK\'s core promise is fair fees and smarter ownership. Today every wallet — Founder and Treasury alike — pays the same flat 1¢ on-chain fee on every transaction.',
            'In the last 90 days, Founder Wallets generated 64% of total network volume but represent only ~6% of wallet count. The current flat-fee model under-rewards the cohort doing the most to drive throughput.',
          ],
        },
        {
          heading: 'Proposed change',
          paras: [
            'Halve the on-chain fee to 0.5¢ for any wallet on the Founder tier (DYNK #0001–#0800). Treasury wallets retain the standard 1¢ fee.',
            'The fee discount is funded entirely from the existing reward pool emissions — no new mint, no draw on treasury reserves, no impact on staker yield.',
          ],
        },
        {
          heading: 'Rationale',
          paras: [
            'Three goals: (1) compensate the wallets shouldering the most network usage, (2) keep the protocol economically neutral by sourcing the discount from emissions already earmarked for ecosystem incentives, and (3) avoid creating a new fee tier that would complicate future governance.',
            'Modeling against the last two epochs of on-chain data suggests the discount costs ~38,000 DYNK per epoch — well within the reward pool\'s monthly headroom of 420,000 DYNK.',
          ],
        },
        {
          heading: 'Implementation',
          paras: [
            'A flag on each wallet (`tier: founder | treasury`) is already on-chain. The fee module needs a one-line change to read this flag and apply 0.5¢ when set to founder. No migration required.',
            'Rollout activates at epoch boundary 14 days after the vote closes. A 7-day kill-switch lets the core team pause the discount if reward-pool depletion exceeds modeled bounds.',
          ],
        },
        {
          heading: 'Risks & mitigations',
          paras: [
            'Reward-pool depletion. Mitigated by the kill-switch and monthly review at each epoch close.',
            'Perception of two-tier protocol. The Founder tier is already public and immutable; this proposal makes the difference economic, not just titular. We will publish a quarterly report on actual fee savings vs. forecasted cost.',
            'Activity gaming. The discount applies per transaction, not per wallet — there is no incentive to wash-trade between Founder wallets, since both sides still pay 0.5¢.',
          ],
        },
      ],

      changes: [
        { label: 'Founder fee', from: '1.0¢', to: '0.5¢' },
        { label: 'Treasury fee', from: '1.0¢', to: '1.0¢ (unchanged)' },
        { label: 'Funded by', from: '—', to: 'Reward pool' },
        { label: 'Rollout', from: '—', to: 'Next epoch' },
      ],
      activity: [
        { kind: 'amend', who: '@maya.dynk', when: '4h', text: 'Suggest tying the fee discount to wallets that have been active in the last 30 days — otherwise dormant Founder wallets get a perk they aren\'t earning.', upvotes: 142 },
        { kind: 'comment', who: '@deepvalue', when: '7h', text: 'Strong yes — this aligns founder incentives with sustained network use, not just hoarding.', upvotes: 89 },
        { kind: 'amend', who: '@theo.7', when: '11h', text: 'Counter-proposal: phase down to 0.5¢ over 3 epochs instead of immediately, so the reward pool can absorb the cost gradually.', upvotes: 64 },
        { kind: 'comment', who: '@roni', when: '1d', text: 'What happens if the reward pool is depleted before the kill-switch fires? Need an explicit fallback rate, not just a pause.', upvotes: 31 },
      ],
    },

    {
      id: 'DIP-013',
      title: 'Open the AI Agent SDK to third-party merchants',
      summary: 'Allow approved merchants to build agent integrations directly, with a 90-day audit window and slashing for misuse.',
      author: 'DYNK Core Team',
      authorHandle: '@core',
      posted: '6 days ago',
      ends: 'Closed · passed',
      endsIn: 'closed',
      status: 'passed',
      forVotes: 9_120,
      againstVotes: 980,
      eligible: 13_000,
      threshold: 0.5,
      quorum: 0.20,
      tags: ['AI Agent', 'Ecosystem'],
      amendments: 7,
      comments: 54,
      tldr: 'Open the AI Agent SDK to any KYC\'d merchant via a public application flow. 90-day audit window per integration; misuse triggers automatic slashing of staked DYNK.',
      sections: [
        {
          heading: 'Background',
          paras: [
            'Today the DYNK AI Agent connects only to a curated list of 22 launch-partner merchants. The waitlist for new integrations exceeds 400 applicants.',
          ],
        },
        {
          heading: 'Proposed change',
          paras: [
            'Open the SDK so any KYC\'d merchant can request integration through a public application flow. Approval is automatic if KYC + collateral checks pass.',
            'A 90-day audit window applies to every new integration. During the window, agent calls are sandboxed and rate-limited. Misuse — defined in the integration agreement — triggers automatic slashing of the merchant\'s staked DYNK.',
          ],
        },
        {
          heading: 'Rationale',
          paras: [
            'A curated list does not scale and creates a gatekeeping bottleneck. The 90-day audit + slashing model gives us safety guardrails without a manual review committee.',
          ],
        },
      ],
      changes: [
        { label: 'Integration access', from: 'Curated list', to: 'Open with audit' },
        { label: 'Audit window', from: '—', to: '90 days' },
        { label: 'Misuse penalty', from: '—', to: 'Stake slashing' },
      ],
      activity: [],
    },

    {
      id: 'DIP-012',
      title: 'Reduce minimum NFT auction duration from 24h to 6h',
      summary: 'Faster auctions for low-value items. Cap applies only to NFTs floor-priced under 50 DYNK.',
      author: 'DYNK Core Team',
      authorHandle: '@core',
      posted: '12 days ago',
      ends: 'Closed · rejected',
      endsIn: 'closed',
      status: 'rejected',
      forVotes: 3_200,
      againstVotes: 7_640,
      eligible: 13_000,
      threshold: 0.5,
      quorum: 0.20,
      tags: ['NFTs', 'Marketplace'],
      amendments: 11,
      comments: 38,
      tldr: 'Drop the 24h minimum auction duration to 6h for low-value NFTs (<50 DYNK floor). Rejected — community preferred a separate fixed-price lane.',
      sections: [
        {
          heading: 'Background',
          paras: [
            'A short auction window was proposed to make low-value NFT trades feel more responsive. Community feedback rejected this proposal in favor of a separate "fixed price" lane that avoids auction mechanics altogether.',
          ],
        },
      ],
      changes: [
        { label: 'Min duration', from: '24h', to: '6h' },
      ],
      activity: [],
    },
  ],
};
