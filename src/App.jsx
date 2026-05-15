import { useState, useEffect, useRef } from "react";

// ─── Seed Data from Spreadsheet ──────────────────────────────────────────────
const SEED_DRAFTS = [
  {
    id: "d1",
    category: "2000's Bangers",
    season: 1,
    week: 9,
    status: "voted",
    drafters: ["Jolly Rancher","Peppermint Patty","Twix","Kit Kat","Snickers","Twizzler"],
    numPicks: 7,
    picks: {
      "Jolly Rancher": ["Hey Ya - Outkast","Smack That - Akon","Paper Planes - MIA","I Gotta Feeling - Black Eyed Peas","All the Small Things - Blink 182","Hollaback Girl - Gwen Stefani","American Idiot - Green Day"],
      "Peppermint Patty": ["Beautiful Girls - Sean Kingston","Don't Matter - Akon","With You - Chris Brown","Hey There Delilah - Plain White T's","So Sick - Ne-Yo","The Sweet Escape - Gwen Stefani ft. Akon","Replay - Iyaz"],
      "Twix": ["Kiss Me Thru the Phone - Soulja Boy","Low - Flo-Rida","Umbrella - Rihanna","Down - Jay Sean, Lil Wayne","Yeah! - Usher","Dangerous - Kardinal Offishall","Break Your Heart - Taio Cruz"],
      "Kit Kat": ["Temperature - Sean Paul","Buy U A Drank - T-Pain","The Middle - Jimmy Eat World","Mr. Brightside - The Killers","Sugar We're Going Down - Fall Out Boy","The Way I Are - Timbaland","A Milli - Lil Wayne"],
      "Snickers": ["Viva La Vida - Coldplay","One More Time - Daft Punk","Don't Stop the Music - Rihanna","Seven Nation Army - White Stripes","Love - Keyshia Cole","Lose Yourself - Eminem","You Belong With Me - Taylor Swift"],
      "Twizzler": ["Get Busy - Sean Paul","If I Ain't Got You - Alicia Keys","21 Questions - 50 Cent","Crank Dat - Soulja Boy","Hips Don't Lie - Shakira","Foolish - Ashanti","Sunday Morning - Maroon 5"],
    },
    votes: {
      "JB - Leah":   { "Jolly Rancher":6,"Peppermint Patty":1,"Twix":5,"Kit Kat":4,"Snickers":3,"Twizzler":2 },
      "OP - Friend": { "Jolly Rancher":2,"Peppermint Patty":4,"Twix":3,"Kit Kat":6,"Snickers":5,"Twizzler":1 },
      "TS - Friend": { "Jolly Rancher":6,"Peppermint Patty":2,"Twix":1,"Kit Kat":3,"Snickers":5,"Twizzler":4 },
      "SG - SIL":    { "Jolly Rancher":4,"Peppermint Patty":2,"Twix":6,"Kit Kat":3,"Snickers":5,"Twizzler":1 },
      "CC - Cade":   { "Jolly Rancher":3,"Peppermint Patty":2,"Twix":5,"Kit Kat":6,"Snickers":1,"Twizzler":4 },
      "TA - Friend": { "Jolly Rancher":1,"Peppermint Patty":4,"Twix":6,"Kit Kat":3,"Snickers":5,"Twizzler":2 },
    },
    totals: { "Jolly Rancher":22,"Peppermint Patty":15,"Twix":26,"Kit Kat":25,"Snickers":24,"Twizzler":14 },
  },
  {
    id: "d2",
    category: "Zoo Animals",
    season: 1,
    week: 10,
    status: "voted",
    drafters: ["Crocodile","Jellyfish","Toad","Salamander"],
    numPicks: 5,
    picks: {
      "Crocodile": ["Giraffe","Tiger","Wallaby","Clouded Leopard","Black-and-white Lemur"],
      "Jellyfish": ["Elephant","Western Lowland Gorilla","Sloth Bear","Bufflehead","Armadillo"],
      "Toad": ["Red Panda","Orangutan","Meerkat","Lion","Loris"],
      "Salamander": ["Otter","Golden Lion Tamarin","Komodo Dragon","Giant Panda","Bald Eagle"],
    },
    votes: {
      "JB": { "Crocodile":2,"Jellyfish":0,"Toad":3,"Salamander":1 },
      "OP": { "Crocodile":4,"Jellyfish":3,"Toad":1,"Salamander":2 },
      "TS": { "Crocodile":2,"Jellyfish":1,"Toad":0,"Salamander":3 },
      "SG": { "Crocodile":2,"Jellyfish":1,"Toad":3,"Salamander":0 },
      "TA": { "Crocodile":4,"Jellyfish":3,"Toad":1,"Salamander":2 },
      "CC": { "Crocodile":0,"Jellyfish":1,"Toad":3,"Salamander":2 },
    },
    totals: { "Crocodile":14,"Jellyfish":9,"Toad":11,"Salamander":10 },
  },
];

const SEASON1_SCORES = [
  { week:"Week 1: Fruits",      scores:{ OP:0,  TA:0,  SG:3,  CC:3,  TS:1,  JB:0 } },
  { week:"Week 2: Apps",        scores:{ OP:0,  TA:0,  SG:0,  CC:3,  TS:1,  JB:2 } },
  { week:"Week 3: Rotation",    scores:{ OP:0,  TA:0,  SG:3,  CC:0,  TS:1,  JB:2 } },
  { week:"Week 4: Feelings",    scores:{ OP:1,  TA:3,  SG:0,  CC:2,  TS:0,  JB:0 } },
  { week:"Week 5: Months",      scores:{ OP:2,  TA:0,  SG:3,  CC:0,  TS:0,  JB:1 } },
  { week:"Week 6: Candies",     scores:{ OP:0,  TA:0,  SG:2,  CC:1,  TS:0,  JB:3 } },
  { week:"Week 7: Childhood TV",scores:{ OP:2,  TA:0,  SG:0,  CC:1,  TS:3,  JB:1 } },
  { week:"Week 8: Buzzwords",   scores:{ OP:0,  TA:0,  SG:2,  CC:1,  TS:3,  JB:0 } },
  { week:"Week 9: 2000s Bangers",scores:{ OP:0, TA:3,  SG:1,  CC:2,  TS:0,  JB:0 } },
  { week:"Week 10: Zoo Animals", scores:{ OP:0, TA:0,  SG:1,  CC:3,  TS:2,  JB:0 } },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeRankedPoints(totals) {
  // Lower score = better rank. 1st=3pts, 2nd=2pts, 3rd=1pt
  const sorted = Object.entries(totals).sort((a,b) => a[1]-b[1]);
  const pts = {};
  sorted.forEach(([name], i) => {
    pts[name] = i === 0 ? 3 : i === 1 ? 2 : i === 2 ? 1 : 0;
  });
  return pts;
}

function getRankSuffix(n) {
  if (n===1) return "st"; if (n===2) return "nd"; if (n===3) return "rd"; return "th";
}

const COLORS = ["#1D3169","#E21D38","#A9C2DC","#77D645","#FFC300","#14E4E5","#A9D4E8","#1D3169","#77D645","#FFC300"];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home"); // home | setup | draft | vote | results | leaderboard | history
  const [drafts, setDrafts] = useState(SEED_DRAFTS);
  const [activeDraft, setActiveDraft] = useState(null);
  const [setupStep, setSetupStep] = useState(0);
  const [setupData, setSetupData] = useState({ category:"", season:1, week:1, drafters:["",""], numPicks:5 });
  const [draftState, setDraftState] = useState({ picks:{}, currentRound:0, currentDrafter:0 });
  const [voteState, setVoteState] = useState({ voterName:"", rankings:{}, submitted:false, voters:[] });
  const [notification, setNotification] = useState(null);
  const inputRef = useRef();

  function notify(msg, type="success") {
    setNotification({ msg, type });
    setTimeout(()=>setNotification(null), 2500);
  }

  // ── Setup flow ─────────────────────────────────────────────────────────────
  function startSetup() { setSetupStep(0); setSetupData({ category:"", season:1, week:1, drafters:["",""], numPicks:5 }); setView("setup"); }

  function createDraft() {
    if (!setupData.category.trim()) return notify("Add a category name","error");
    const validDrafters = setupData.drafters.filter(d=>d.trim());
    if (validDrafters.length < 2) return notify("Need at least 2 drafters","error");
    const newDraft = {
      id: "d" + Date.now(),
      category: setupData.category,
      season: setupData.season,
      week: setupData.week,
      status: "drafting",
      drafters: validDrafters,
      numPicks: setupData.numPicks,
      picks: Object.fromEntries(validDrafters.map(d=>[d,[]])),
      votes: {},
      totals: {},
    };
    setDrafts(prev => [...prev, newDraft]);
    setActiveDraft(newDraft);
    setDraftState({ picks: Object.fromEntries(validDrafters.map(d=>[d,[]])), currentRound:0, currentDrafter:0 });
    setView("draft");
  }

  // ── Draft flow ─────────────────────────────────────────────────────────────
  function submitPick(pick) {
    if (!pick.trim()) return;
    const d = activeDraft;
    const drafter = d.drafters[draftState.currentDrafter];
    const newPicks = { ...draftState.picks };
    newPicks[drafter] = [...(newPicks[drafter]||[]), pick.trim()];

    const totalPicks = Object.values(newPicks).flat().length;
    const totalExpected = d.drafters.length * d.numPicks;
    const nextDrafter = (draftState.currentDrafter + 1) % d.drafters.length;
    const nextRound = nextDrafter === 0 ? draftState.currentRound + 1 : draftState.currentRound;

    setDraftState({ picks: newPicks, currentRound: nextRound, currentDrafter: nextDrafter });

    if (totalPicks >= totalExpected) {
      // Draft complete
      const updated = { ...d, picks: newPicks, status:"voting" };
      setActiveDraft(updated);
      setDrafts(prev => prev.map(x => x.id===d.id ? updated : x));
      setVoteState({ voterName:"", rankings:{}, submitted:false, voters:[] });
      setView("vote");
    }
  }

  // ── Vote flow ──────────────────────────────────────────────────────────────
  function loadDraftForVoting(draft) {
    setActiveDraft(draft);
    setVoteState({ voterName:"", rankings:{}, submitted:false, voters: Object.keys(draft.votes||{}) });
    setView("vote");
  }

  function submitVote() {
    const { voterName, rankings } = voteState;
    if (!voterName.trim()) return notify("Enter your name","error");
    const drafters = activeDraft.drafters;
    const ranked = Object.values(rankings);
    if (ranked.length !== drafters.length || new Set(ranked).size !== drafters.length) {
      return notify(`Rank all ${drafters.length} drafters with unique values 1–${drafters.length}`, "error");
    }
    // Convert rankings: user assigns 1=best. We store raw rank, compute totals as sum (lower=better)
    const newVotes = { ...(activeDraft.votes||{}), [voterName]: { ...rankings } };
    // Recalculate totals
    const newTotals = {};
    drafters.forEach(d => { newTotals[d] = 0; });
    Object.values(newVotes).forEach(v => {
      Object.entries(v).forEach(([drafter, rank]) => { newTotals[drafter] = (newTotals[drafter]||0) + rank; });
    });
    const updated = { ...activeDraft, votes: newVotes, totals: newTotals, status:"voting" };
    setActiveDraft(updated);
    setDrafts(prev => prev.map(x => x.id===activeDraft.id ? updated : x));
    setVoteState(prev => ({ ...prev, submitted:true, voters: Object.keys(newVotes) }));
    notify("Vote submitted!");
  }

  function finalizeDraft() {
    const updated = { ...activeDraft, status:"voted" };
    setActiveDraft(updated);
    setDrafts(prev => prev.map(x => x.id===activeDraft.id ? updated : x));
    setView("results");
  }

  // ── Global leaderboard ─────────────────────────────────────────────────────
  function getLeaderboard() {
    const players = {};
    SEASON1_SCORES.forEach(({ week, scores }) => {
      Object.entries(scores).forEach(([p, pts]) => {
        if (!players[p]) players[p] = { total:0, weeks:{}, avg:0, weeksPlayed:0 };
        players[p].weeks[week] = pts;
        players[p].total += pts;
        if (pts > 0 || week in scores) players[p].weeksPlayed++;
      });
    });
    Object.values(players).forEach(p => { p.avg = p.weeksPlayed ? (p.total/p.weeksPlayed).toFixed(2) : "0.00"; });
    return Object.entries(players).sort((a,b) => b[1].total - a[1].total);
  }

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.root}>
      {notification && (
        <div style={{ ...styles.notification, background: notification.type==="error" ? "#E21D38" : "#77D645", color: "#fff" }}>
          {notification.msg}
        </div>
      )}

      {view === "home" && <HomeView drafts={drafts} onNew={startSetup} onLeaderboard={()=>setView("leaderboard")} onHistory={()=>setView("history")} onVote={loadDraftForVoting} onResults={d=>{ setActiveDraft(d); setView("results"); }} />}
      {view === "setup" && <SetupView step={setupStep} data={setupData} setData={setSetupData} setStep={setSetupStep} onCreate={createDraft} onBack={()=>setView("home")} />}
      {view === "draft" && activeDraft && <DraftView draft={activeDraft} state={draftState} onPick={submitPick} onBack={()=>setView("home")} />}
      {view === "vote" && activeDraft && <VoteView draft={activeDraft} voteState={voteState} setVoteState={setVoteState} onSubmit={submitVote} onFinalize={finalizeDraft} onBack={()=>setView("home")} />}
      {view === "results" && activeDraft && <ResultsView draft={activeDraft} onNewDraft={startSetup} onLeaderboard={()=>setView("leaderboard")} onBack={()=>setView("home")} />}
      {view === "leaderboard" && <LeaderboardView data={getLeaderboard()} drafts={drafts} onBack={()=>setView("home")} />}
      {view === "history" && <HistoryView drafts={drafts} onView={d=>{setActiveDraft(d);setView("results");}} onVote={loadDraftForVoting} onBack={()=>setView("home")} />}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeView({ drafts, onNew, onLeaderboard, onHistory, onVote, onResults }) {
  const active = drafts.filter(d => d.status !== "voted");
  const recent = drafts.filter(d => d.status === "voted").slice(-2);
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroTag}>Draft Simulator</div>
        <h1 style={styles.heroTitle}>The Draft<br/><span style={styles.heroAccent}>Room</span></h1>
        <p style={styles.heroSub}>Build your roster. Defend your picks. Let the votes decide.</p>
        <button style={styles.btnPrimary} onClick={onNew}>+ Start New Draft</button>
      </div>

      <div style={styles.grid2}>
        <button style={styles.navCard} onClick={onLeaderboard}>
          <span style={styles.navIcon}>🏆</span>
          <span style={styles.navLabel}>Leaderboard</span>
          <span style={styles.navSub}>Season standings</span>
        </button>
        <button style={styles.navCard} onClick={onHistory}>
          <span style={styles.navIcon}>📜</span>
          <span style={styles.navLabel}>Draft History</span>
          <span style={styles.navSub}>All past drafts</span>
        </button>
      </div>

      {active.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Active Drafts</h2>
          {active.map(d => (
            <div key={d.id} style={styles.draftCard}>
              <div>
                <div style={styles.draftName}>{d.category}</div>
                <div style={styles.draftMeta}>S{d.season} W{d.week} · {d.drafters.length} drafters · {d.status === "drafting" ? "In Progress" : "Awaiting Votes"}</div>
              </div>
              <button style={styles.btnSmall} onClick={() => d.status === "voting" ? onVote(d) : null}>
                {d.status === "drafting" ? "Continue" : "Vote"}
              </button>
            </div>
          ))}
        </section>
      )}

      {recent.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Results</h2>
          {recent.map(d => {
            const sorted = Object.entries(d.totals).sort((a,b)=>a[1]-b[1]);
            const winner = sorted[0];
            return (
              <div key={d.id} style={styles.draftCard}>
                <div>
                  <div style={styles.draftName}>{d.category}</div>
                  <div style={styles.draftMeta}>Winner: <strong>{winner?.[0]}</strong> ({winner?.[1]} pts)</div>
                </div>
                <button style={styles.btnSmall} onClick={() => onResults(d)}>View</button>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

// ─── SETUP ────────────────────────────────────────────────────────────────────
function SetupView({ step, data, setData, setStep, onCreate, onBack }) {
  const [newDrafter, setNewDrafter] = useState("");

  function addDrafter() {
    if (!newDrafter.trim()) return;
    setData(d => ({ ...d, drafters: [...d.drafters.filter(x=>x), newDrafter.trim()] }));
    setNewDrafter("");
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>New Draft</h1>

      <div style={styles.card}>
        <label style={styles.label}>Category</label>
        <input style={styles.input} placeholder="e.g. 2000's Bangers, Best Pizza Toppings…" value={data.category} onChange={e=>setData(d=>({...d,category:e.target.value}))} />

        <div style={styles.row}>
          <div style={{flex:1}}>
            <label style={styles.label}>Season</label>
            <input style={styles.input} type="number" min="1" value={data.season} onChange={e=>setData(d=>({...d,season:+e.target.value}))} />
          </div>
          <div style={{flex:1}}>
            <label style={styles.label}>Week</label>
            <input style={styles.input} type="number" min="1" value={data.week} onChange={e=>setData(d=>({...d,week:+e.target.value}))} />
          </div>
          <div style={{flex:1}}>
            <label style={styles.label}>Picks each</label>
            <input style={styles.input} type="number" min="1" max="20" value={data.numPicks} onChange={e=>setData(d=>({...d,numPicks:+e.target.value}))} />
          </div>
        </div>

        <label style={styles.label}>Drafters</label>
        <div style={styles.drafterList}>
          {data.drafters.filter(x=>x).map((d,i) => (
            <div key={i} style={styles.drafterChip}>
              <span style={{ background: COLORS[i%COLORS.length], ...styles.chipDot }} />
              {d}
              <button style={styles.chipX} onClick={()=>setData(dd=>({...dd,drafters:dd.drafters.filter((_,j)=>j!==i)}))}>×</button>
            </div>
          ))}
        </div>
        <div style={styles.row}>
          <input style={{...styles.input,flex:1}} placeholder="Drafter name / alias" value={newDrafter} onChange={e=>setNewDrafter(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addDrafter()} />
          <button style={styles.btnSmall} onClick={addDrafter}>Add</button>
        </div>

        <button style={{...styles.btnPrimary, marginTop:24, width:"100%"}} onClick={onCreate}>
          Start Draft →
        </button>
      </div>
    </div>
  );
}

// ─── DRAFT ROOM ───────────────────────────────────────────────────────────────
function DraftView({ draft, state, onPick, onBack }) {
  const [pick, setPick] = useState("");
  const inputRef = useRef();

  const drafter = draft.drafters[state.currentDrafter];
  const color = COLORS[state.currentDrafter % COLORS.length];
  const totalPicks = Object.values(state.picks).flat().length;
  const totalNeeded = draft.drafters.length * draft.numPicks;
  const progress = totalPicks / totalNeeded;
  const round = state.currentRound + 1;

  function handlePick() {
    if (!pick.trim()) return;
    onPick(pick);
    setPick("");
    inputRef.current?.focus();
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <div style={styles.draftHeader}>
        <h1 style={styles.pageTitle}>{draft.category}</h1>
        <div style={styles.draftMeta}>Season {draft.season} · Week {draft.week}</div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress*100}%`, background: color }} />
      </div>
      <div style={{ ...styles.draftMeta, marginBottom:16 }}>Round {round} of {draft.numPicks} · Pick {totalPicks+1} of {totalNeeded}</div>

      {/* Current pick box */}
      <div style={{ ...styles.pickPrompt, borderColor: color }}>
        <div style={{ color, fontWeight:700, fontSize:14, marginBottom:6, letterSpacing:2, textTransform:"uppercase" }}>
          Now picking — Round {round}
        </div>
        <div style={{ fontSize:26, fontWeight:800, color:"#1D3169", marginBottom:16 }}>{drafter}</div>
        <input
          ref={inputRef}
          style={styles.bigInput}
          placeholder="Type your pick…"
          value={pick}
          onChange={e=>setPick(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handlePick()}
          autoFocus
        />
        <button style={{ ...styles.btnPrimary, marginTop:12, background:color, width:"100%" }} onClick={handlePick}>
          Lock It In ✓
        </button>
      </div>

      {/* Boards */}
      <div style={styles.boardGrid}>
        {draft.drafters.map((d,i) => (
          <div key={d} style={{ ...styles.boardCard, borderTopColor: COLORS[i%COLORS.length] }}>
            <div style={{ ...styles.boardName, color: COLORS[i%COLORS.length] }}>{d}</div>
            {(state.picks[d]||[]).map((p,j) => (
              <div key={j} style={styles.pickItem}>
                <span style={styles.pickNum}>{j+1}</span> {p}
              </div>
            ))}
            {Array.from({ length: draft.numPicks - (state.picks[d]||[]).length }).map((_,j) => (
              <div key={"e"+j} style={{ ...styles.pickItem, opacity:0.2 }}>
                <span style={styles.pickNum}>{(state.picks[d]||[]).length+j+1}</span> —
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VOTING ───────────────────────────────────────────────────────────────────
function VoteView({ draft, voteState, setVoteState, onSubmit, onFinalize, onBack }) {
  const { voterName, rankings, submitted, voters } = voteState;

  function setRank(drafter, val) {
    setVoteState(v => ({ ...v, rankings: { ...v.rankings, [drafter]: val === "" ? "" : +val } }));
  }

  const allRanked = draft.drafters.every(d => rankings[d] >= 1);
  const uniqueRanks = new Set(Object.values(rankings).filter(x=>x)).size === draft.drafters.length;

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>Vote</h1>
      <div style={styles.draftMeta}>{draft.category} · S{draft.season} W{draft.week}</div>

      {/* Who's voted */}
      {voters.length > 0 && (
        <div style={styles.voterBadges}>
          {voters.map(v => <span key={v} style={styles.voterBadge}>{v} ✓</span>)}
        </div>
      )}

      {!submitted ? (
        <div style={styles.card}>
          <label style={styles.label}>Your Name / Alias</label>
          <input style={styles.input} placeholder="How should we know you?" value={voterName} onChange={e=>setVoteState(v=>({...v,voterName:e.target.value}))} />

          <label style={{ ...styles.label, marginTop:16 }}>
            Rank the rosters — 1 = best, {draft.drafters.length} = worst
          </label>
          <div style={styles.voteHint}>No ties allowed. Each rank must be unique.</div>

          {draft.drafters.map((d,i) => (
            <div key={d} style={styles.voteRow}>
              <div style={{ ...styles.voteColorBar, background: COLORS[i%COLORS.length] }} />
              <div style={{ flex:1 }}>
                <div style={styles.voteDrafter}>{d}</div>
                <div style={styles.votePicksPreview}>
                  {(draft.picks[d]||[]).slice(0,3).join(" · ")}{(draft.picks[d]||[]).length > 3 ? " …" : ""}
                </div>
              </div>
              <input
                type="number"
                min="1"
                max={draft.drafters.length}
                style={{ ...styles.rankInput, borderColor: rankings[d] ? COLORS[i%COLORS.length] : "rgba(255,255,255,0.15)" }}
                value={rankings[d] ?? ""}
                onChange={e=>setRank(d, e.target.value)}
                placeholder="#"
              />
            </div>
          ))}

          <button
            style={{ ...styles.btnPrimary, marginTop:20, width:"100%", opacity: allRanked&&uniqueRanks ? 1 : 0.4 }}
            onClick={onSubmit}
            disabled={!allRanked || !uniqueRanks}
          >
            Submit Vote
          </button>
        </div>
      ) : (
        <div style={styles.card}>
          <div style={{ textAlign:"center", padding:"12px 0 20px" }}>
            <div style={{ fontSize:40, marginBottom:8 }}>✓</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#77D645" }}>Vote submitted, {voterName}!</div>
          </div>
          <div style={styles.label}>Your rankings:</div>
          {Object.entries(rankings).sort((a,b)=>a[1]-b[1]).map(([d,r]) => (
            <div key={d} style={styles.voteRow}>
              <div style={{ ...styles.voteColorBar, background: COLORS[draft.drafters.indexOf(d)%COLORS.length] }} />
              <div style={{ flex:1, color:"#1D3169" }}>{d}</div>
              <div style={{ fontWeight:800, color:"#E21D38" }}>#{r}</div>
            </div>
          ))}
          <button style={{ ...styles.btnSmall, marginTop:16, width:"100%" }} onClick={()=>setVoteState(v=>({...v,submitted:false,voterName:"",rankings:{}}))}>
            Add Another Vote
          </button>
          <button style={{ ...styles.btnPrimary, marginTop:8, width:"100%" }} onClick={onFinalize}>
            Close Voting & See Results →
          </button>
        </div>
      )}

      {/* Live totals */}
      {Object.keys(draft.totals||{}).length > 0 && (
        <div style={styles.card}>
          <div style={styles.label}>Live Totals (lower = winning)</div>
          {Object.entries(draft.totals).sort((a,b)=>a[1]-b[1]).map(([d,t],i) => (
            <div key={d} style={styles.resultRow}>
              <span style={styles.resultRank}>{i+1}{getRankSuffix(i+1)}</span>
              <div style={{ ...styles.resultBar, background: COLORS[draft.drafters.indexOf(d)%COLORS.length], width: `${Math.min(100, (t/(Math.max(...Object.values(draft.totals))))*90+5)}%` }} />
              <span style={styles.resultName}>{d}</span>
              <span style={styles.resultScore}>{t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function ResultsView({ draft, onNewDraft, onLeaderboard, onBack }) {
  const sorted = Object.entries(draft.totals||{}).sort((a,b)=>a[1]-b[1]);
  const pts = computeRankedPoints(draft.totals||{});

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>{draft.category}</h1>
      <div style={styles.draftMeta}>Season {draft.season} · Week {draft.week} · Final Results</div>

      {/* Podium */}
      {sorted.length >= 3 && (
        <div style={styles.podium}>
          {[sorted[1], sorted[0], sorted[2]].map((entry,pos) => {
            const rank = pos===1 ? 1 : pos===0 ? 2 : 3;
            const heights = [80, 110, 60];
            const ci = draft.drafters.indexOf(entry[0]);
            return (
              <div key={entry[0]} style={{ ...styles.podiumCol, height: heights[pos], background: COLORS[ci%COLORS.length] }}>
                <div style={styles.podiumRank}>{rank}</div>
                <div style={styles.podiumName}>{entry[0]}</div>
                <div style={styles.podiumScore}>{entry[1]} pts</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full results */}
      <div style={styles.card}>
        <div style={styles.label}>Full Rankings</div>
        {sorted.map(([drafter, total], i) => (
          <div key={drafter} style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ ...styles.resultRank, color: i===0?"#FFC300":i===1?"#A9C2DC":i===2?"#E21D38":"#bbb" }}>
                {i+1}{getRankSuffix(i+1)}
              </span>
              <span style={{ flex:1, fontWeight:600, color:"#1D3169" }}>{drafter}</span>
              <span style={{ color:"#888", fontSize:13 }}>{total} vote pts</span>
              <span style={{ fontWeight:800, color: COLORS[draft.drafters.indexOf(drafter)%COLORS.length] }}>+{pts[drafter]} season pts</span>
            </div>
            <div style={{ ...styles.votePicksPreview, paddingLeft:40 }}>
              {(draft.picks[drafter]||[]).join(" · ")}
            </div>
          </div>
        ))}
      </div>

      {/* Vote breakdown */}
      {Object.keys(draft.votes||{}).length > 0 && (
        <div style={styles.card}>
          <div style={styles.label}>Vote Breakdown</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>
                  <th style={styles.th}>Voter</th>
                  {draft.drafters.map(d => <th key={d} style={styles.th}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(draft.votes).map(([voter, votes]) => (
                  <tr key={voter}>
                    <td style={styles.td}>{voter}</td>
                    {draft.drafters.map(d => <td key={d} style={{ ...styles.td, color: votes[d]===1?"#FFE66D":"inherit" }}>{votes[d] ?? "—"}</td>)}
                  </tr>
                ))}
                <tr>
                  <td style={{ ...styles.td, fontWeight:700 }}>Total</td>
                  {draft.drafters.map(d => <td key={d} style={{ ...styles.td, fontWeight:700, color:"#1D3169" }}>{draft.totals[d] ?? "—"}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={styles.row}>
        <button style={{ ...styles.btnPrimary, flex:1 }} onClick={onNewDraft}>+ New Draft</button>
        <button style={{ ...styles.btnSmall, flex:1 }} onClick={onLeaderboard}>Leaderboard →</button>
      </div>
    </div>
  );
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
function LeaderboardView({ data, drafts, onBack }) {
  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>Leaderboard</h1>
      <div style={styles.draftMeta}>Season 1 — All Categories</div>

      {/* Top 3 */}
      <div style={styles.podium}>
        {[data[1], data[0], data[2]].filter(Boolean).map((entry, pos) => {
          const rank = pos===1?1:pos===0?2:3;
          const heights=[80,120,60];
          return (
            <div key={entry[0]} style={{ ...styles.podiumCol, height:heights[pos], background:COLORS[pos*2] }}>
              <div style={styles.podiumRank}>{rank}</div>
              <div style={styles.podiumName}>{entry[0]}</div>
              <div style={styles.podiumScore}>{entry[1].total} pts</div>
            </div>
          );
        })}
      </div>

      <div style={styles.card}>
        {data.map(([player, stats], i) => (
          <div key={player} style={{ ...styles.resultRow, marginBottom:12, alignItems:"center" }}>
            <span style={{ ...styles.resultRank, minWidth:32, color:i===0?"#FFC300":i===1?"#A9C2DC":i===2?"#E21D38":"#bbb" }}>
              #{i+1}
            </span>
            <span style={{ flex:1, fontWeight:700, color:"#1D3169", fontSize:16 }}>{player}</span>
            <span style={{ color:"#888", fontSize:13, marginRight:12 }}>avg {stats.avg}</span>
            <span style={{ fontWeight:800, color:"#E21D38", fontSize:18 }}>{stats.total}</span>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Week by Week</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr>
                <th style={styles.th}>Week</th>
                {data.map(([p]) => <th key={p} style={styles.th}>{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {SEASON1_SCORES.map(({ week, scores }) => (
                <tr key={week}>
                  <td style={{ ...styles.td, fontSize:11, color:"#888" }}>{week.replace("Week ","W")}</td>
                  {data.map(([p]) => (
                    <td key={p} style={{ ...styles.td, color: scores[p]===3?"#FFC300":scores[p]===2?"#1D3169":scores[p]===1?"#A9C2DC":"#ccc" }}>
                      {scores[p] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td style={{ ...styles.td, fontWeight:700 }}>Total</td>
                {data.map(([p,s]) => <td key={p} style={{ ...styles.td, fontWeight:700, color:"#E21D38" }}>{s.total}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryView({ drafts, onView, onVote, onBack }) {
  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>Draft History</h1>
      {drafts.map((d,i) => {
        const sorted = Object.entries(d.totals||{}).sort((a,b)=>a[1]-b[1]);
        const winner = sorted[0];
        return (
          <div key={d.id} style={styles.draftCard}>
            <div style={{ ...styles.draftColorBar, background:COLORS[i%COLORS.length] }} />
            <div style={{ flex:1 }}>
              <div style={styles.draftName}>{d.category}</div>
              <div style={styles.draftMeta}>
                S{d.season} W{d.week} · {d.drafters.length} drafters ·{" "}
                {d.status==="voted" && winner ? `Winner: ${winner[0]} (${winner[1]} pts)` : d.status}
              </div>
            </div>
            <button style={styles.btnSmall} onClick={() => d.status==="voted" ? onView(d) : onVote(d)}>
              {d.status==="voted" ? "Results" : "Vote"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight:"100vh", background:"#F7F5F3",
    fontFamily:"'DM Mono', 'Courier New', monospace",
    color:"#1a1a1a", position:"relative",
  },
  page: { maxWidth:760, margin:"0 auto", padding:"24px 20px 60px" },
  notification: {
    position:"fixed", top:16, left:"50%", transform:"translateX(-50%)",
    padding:"10px 24px", borderRadius:30, fontWeight:700, fontSize:14,
    color:"#fff", zIndex:9999, letterSpacing:1,
  },
  hero: { textAlign:"center", padding:"56px 0 40px" },
  heroTag: { display:"inline-block", background:"#1D3169", borderRadius:30, padding:"4px 16px", fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"#A9C2DC", marginBottom:20 },
  heroTitle: { fontSize:52, fontWeight:900, lineHeight:1.1, margin:"0 0 12px", color:"#1D3169", letterSpacing:-2 },
  heroAccent: { color:"#E21D38" },
  heroSub: { color:"#6b6b6b", fontSize:16, marginBottom:32 },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:32 },
  navCard: {
    background:"#fff", border:"1px solid #DAD3CC",
    borderRadius:12, padding:"20px 16px", cursor:"pointer", textAlign:"left",
    display:"flex", flexDirection:"column", gap:4, transition:"box-shadow 0.15s",
    boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
  },
  navIcon: { fontSize:24, marginBottom:4 },
  navLabel: { fontWeight:700, fontSize:15, color:"#1D3169" },
  navSub: { fontSize:12, color:"#888" },
  section: { marginBottom:28 },
  sectionTitle: { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#999", marginBottom:12, fontWeight:600 },
  draftCard: { display:"flex", alignItems:"center", gap:12, background:"#fff", border:"1px solid #DAD3CC", borderRadius:10, padding:"14px 16px", marginBottom:8, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" },
  draftColorBar: { width:4, height:40, borderRadius:2, flexShrink:0 },
  draftName: { fontWeight:700, fontSize:15, color:"#1D3169", marginBottom:2 },
  draftMeta: { fontSize:12, color:"#888" },
  card: { background:"#fff", border:"1px solid #DAD3CC", borderRadius:14, padding:"20px 18px", marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" },
  label: { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#999", marginBottom:8, display:"block", fontWeight:600 },
  input: { width:"100%", background:"#F7F5F3", border:"1px solid #DAD3CC", borderRadius:8, padding:"10px 14px", color:"#1a1a1a", fontSize:14, outline:"none", marginBottom:14, boxSizing:"border-box", fontFamily:"inherit" },
  bigInput: { width:"100%", background:"#F7F5F3", border:"2px solid #A9C2DC", borderRadius:10, padding:"14px 16px", color:"#1a1a1a", fontSize:18, outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
  row: { display:"flex", gap:10, alignItems:"flex-end", marginBottom:8 },
  drafterList: { display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 },
  drafterChip: { display:"flex", alignItems:"center", gap:6, background:"#F0EDE9", border:"1px solid #DAD3CC", borderRadius:20, padding:"4px 10px 4px 6px", fontSize:13, color:"#1D3169" },
  chipDot: { width:10, height:10, borderRadius:"50%", display:"inline-block" },
  chipX: { background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:16, padding:0, lineHeight:1 },
  btnPrimary: { background:"#E21D38", border:"none", borderRadius:8, padding:"12px 24px", fontWeight:800, fontSize:14, cursor:"pointer", color:"#fff", letterSpacing:1, fontFamily:"inherit" },
  btnSmall: { background:"#fff", border:"1.5px solid #1D3169", borderRadius:8, padding:"8px 16px", fontWeight:600, fontSize:13, cursor:"pointer", color:"#1D3169", fontFamily:"inherit" },
  backBtn: { background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:13, padding:"0 0 16px", fontFamily:"inherit" },
  pageTitle: { fontSize:32, fontWeight:900, color:"#1D3169", margin:"0 0 4px", letterSpacing:-1 },
  draftHeader: { marginBottom:16 },
  progressBar: { height:5, background:"#DAD3CC", borderRadius:3, overflow:"hidden", marginBottom:8 },
  progressFill: { height:"100%", borderRadius:3, transition:"width 0.3s ease" },
  pickPrompt: { border:"2px solid", borderRadius:14, padding:"20px 18px", marginBottom:24, background:"#fff" },
  boardGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))", gap:12 },
  boardCard: { background:"#fff", borderRadius:10, padding:"14px", borderTop:"3px solid", border:"1px solid #DAD3CC", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" },
  boardName: { fontWeight:800, fontSize:13, marginBottom:8, letterSpacing:1, textTransform:"uppercase" },
  pickItem: { display:"flex", alignItems:"baseline", gap:6, fontSize:13, color:"#444", padding:"3px 0", borderBottom:"1px solid #f0ede9" },
  pickNum: { fontSize:11, color:"#bbb", minWidth:16, fontWeight:700 },
  voteRow: { display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f0ede9" },
  voteColorBar: { width:4, height:40, borderRadius:2, flexShrink:0 },
  voteDrafter: { fontWeight:700, color:"#1D3169", fontSize:15 },
  votePicksPreview: { fontSize:12, color:"#aaa", marginTop:2 },
  rankInput: { width:52, background:"#F7F5F3", border:"2px solid", borderRadius:6, padding:"8px", color:"#E21D38", fontSize:18, fontWeight:800, textAlign:"center", fontFamily:"inherit", outline:"none" },
  voteHint: { fontSize:12, color:"#aaa", marginBottom:12 },
  voterBadges: { display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 },
  voterBadge: { background:"rgba(29,49,105,0.08)", color:"#1D3169", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 },
  resultRow: { display:"flex", alignItems:"center", gap:8, marginBottom:8 },
  resultRank: { fontSize:13, fontWeight:700, minWidth:28, color:"#bbb" },
  resultBar: { height:6, borderRadius:3, flexShrink:0, transition:"width 0.5s ease" },
  resultName: { flex:1, color:"#1D3169", fontWeight:600, fontSize:14 },
  resultScore: { fontWeight:800, color:"#E21D38" },
  podium: { display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8, margin:"24px 0 16px", height:140 },
  podiumCol: { flex:1, maxWidth:180, borderRadius:"8px 8px 0 0", display:"flex", flexDirection:"column", justifyContent:"flex-end", alignItems:"center", padding:"8px 8px 10px", cursor:"default" },
  podiumRank: { fontSize:22, fontWeight:900, color:"rgba(255,255,255,0.85)" },
  podiumName: { fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.9)", textAlign:"center", marginTop:2 },
  podiumScore: { fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 },
  th: { textAlign:"left", padding:"6px 8px", fontSize:11, color:"#aaa", borderBottom:"1px solid #DAD3CC", fontWeight:600, letterSpacing:1 },
  td: { padding:"6px 8px", borderBottom:"1px solid #f0ede9", color:"#555" },
};