import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xlzeuduftbvedjisfbip.supabase.co",
  "sb_publishable_fvIHoyum37kgBpfnSjIp6w_vzrG25At"
);

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  navy:    "#1D3169",
  red:     "#E21D38",
  warmGrey:"#DAD3CC",
  steel:   "#A9C2DC",
  sky:     "#A9D4E8",
  lime:    "#77D645",
  cyan:    "#14E4E5",
  amber:   "#FFC300",
  bg:      "#F7F5F3",
  white:   "#ffffff",
};

const COLORS = [P.navy, P.red, P.steel, P.lime, P.amber, P.cyan, P.sky, "#7C5CBF", "#E17055", "#74B9FF"];

// ─── Alias → Real Name Map ────────────────────────────────────────────────────
const ALIAS_MAP = {
  // Joe
  "JB":"Joe", "Jolly Rancher":"Joe", "Fiancee":"Joe", "Jellyfish":"Joe",
  // Olivia
  "OP":"Olivia", "Peppermint Patty":"Olivia", "Flake":"Olivia",
  // Talal
  "TA":"Talal", "Twix":"Talal",
  // Cat
  "CC":"Cat", "Kit Kat":"Cat", "Everyone hates me":"Cat", "Crocodile":"Cat",
  // Scott
  "SG":"Scott", "Snickers":"Scott", "GOAT":"Scott", "Captain":"Scott", "Salamander":"Scott",
  // Tom
  "TS":"Tom", "Twizzler":"Tom", "Toad":"Tom", "The Only Tom":"Tom",
  // Direct names pass through
  "Joe":"Joe", "Olivia":"Olivia", "Talal":"Talal", "Cat":"Cat", "Scott":"Scott", "Tom":"Tom",
};

function resolveName(name) {
  return ALIAS_MAP[name] || name;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_DRAFTS = [
  {
    id:"d1", category:"Fruits", season:1, week:1, status:"voted",
    drafters:["Tom","Joe","Talal","Cat","Scott"],
    numPicks:3,
    picks:{
      "Tom":["Apple","Cherry","Avocado"],
      "Joe":["Strawberry","Watermelon","Nectarine"],
      "Talal":["Fig","Grape","Orange"],
      "Cat":["Peach","Mango","Lychee"],
      "Scott":["Pineapple","Banana","Blueberry"],
    },
    votes:{},
    totals:{"Tom":4,"Joe":6,"Talal":5,"Cat":8,"Scott":8},
    seasonPoints:{"Tom":0,"Joe":0,"Talal":1,"Cat":3,"Scott":3},
    winner:"Cat & Scott",
  },
  {
    id:"d2", category:"Apps on Your Phone", season:1, week:2, status:"voted",
    drafters:["Tom","Joe","Cat","Olivia"],
    numPicks:3,
    picks:{
      "Tom":["Vine","iFunny","Flappy Bird"],
      "Joe":["Instagram","Netflix","Angry Birds"],
      "Cat":["Spotify","YouTube","Snapchat"],
      "Olivia":["TikTok","NYT Games","Chesapeake Dolphin Watch"],
    },
    votes:{},
    totals:{"Tom":0,"Joe":0,"Cat":3,"Olivia":0},
    seasonPoints:{"Tom":0,"Joe":0,"Cat":3,"Olivia":0},
    winner:"Cat",
  },
  {
    id:"d3", category:"Rotation Guests", season:1, week:3, status:"voted",
    drafters:["Tom","Joe","Olivia","Talal","Cat","Scott"],
    numPicks:3,
    picks:{
      "Tom":["Uncle Iroh","Donald Glover","Jon Stewart"],
      "Joe":["Gandalf","Seth Rogen","My dawg"],
      "Olivia":["Ray Lewis","King Von","Lamar Jackson"],
      "Talal":["Bruce Wayne (Bale)","Luigi","Nicki Minaj"],
      "Cat":["Martha Stewart","Paul Rudd","Rhett McLaughlin"],
      "Scott":["Bob Marley","Thomas Shelby","Bobby Fairways"],
    },
    votes:{},
    totals:{"Tom":17,"Joe":19,"Olivia":7,"Talal":15,"Cat":12,"Scott":21},
    seasonPoints:{"Tom":0,"Joe":0,"Olivia":0,"Talal":0,"Cat":0,"Scott":3},
    winner:"Scott",
  },
  {
    id:"d4", category:"Best Feelings", season:1, week:4, status:"voted",
    drafters:["Joe","Olivia","Scott","Talal","Cat","Tom"],
    numPicks:3,
    picks:{
      "Joe":["True Love","When a puppy falls asleep on you","Winning a championship"],
      "Olivia":["Shower after a beach day","Getting in bed w/ clean sheets post-shower","Seeing people out that you didn't expect"],
      "Scott":["Cold beer on a hot day after manual labor","Adrenaline rush of a roller coaster","Remembering something you were trying to"],
      "Talal":["Getting under a blanket in a cold room","Fresh glass of water post-wake up","First day of vacation"],
      "Cat":["Receiving a well-thought out gift","Post-beach nap","Saying something at the same time as someone else"],
      "Tom":["Nature piss","First drink/meal on vacation","Event that you didn't want to attend getting cancelled"],
    },
    votes:{},
    totals:{"Joe":11,"Olivia":22,"Scott":15,"Talal":26,"Cat":23,"Tom":14},
    seasonPoints:{"Joe":0,"Olivia":1,"Scott":0,"Talal":3,"Cat":2,"Tom":0},
    winner:"Talal",
  },
  {
    id:"d5", category:"Months", season:1, week:5, status:"voted",
    drafters:["Olivia","Joe","Scott","Tom"],
    numPicks:3,
    picks:{
      "Olivia":["May","August","September"],
      "Joe":["December","April","November"],
      "Scott":["July","October","March"],
      "Tom":["January","June","February"],
    },
    votes:{},
    totals:{"Olivia":16,"Joe":14,"Scott":18,"Tom":6},
    seasonPoints:{"Olivia":2,"Joe":1,"Scott":3,"Tom":0},
    winner:"Scott",
  },
  {
    id:"d6", category:"Candies", season:1, week:6, status:"voted",
    drafters:["Joe","Scott","Cat","Olivia"],
    numPicks:3,
    picks:{
      "Joe":["Hershey's Cookies and Cream","Sour Patch Blue-Only","Coca-Cola Sour Gummies"],
      "Scott":["Snickers","Starburst","M&Ms Classic"],
      "Cat":["Nerd's Gummy Cluster","Sour Patch Kids Apple Harvest","Three Musketeers"],
      "Olivia":["Mike and Ike's Sour","Twix","Jolly Ranchers"],
    },
    votes:{},
    totals:{"Joe":13,"Scott":12,"Cat":10,"Olivia":9},
    seasonPoints:{"Joe":3,"Scott":2,"Cat":1,"Olivia":0},
    winner:"Joe",
  },
  {
    id:"d7", category:"Childhood TV Shows", season:1, week:7, status:"voted",
    drafters:["Olivia","Tom","Joe","Cat","Scott","Talal"],
    numPicks:3,
    picks:{
      "Olivia":["Drake & Josh","Zoey 101","That's So Raven"],
      "Tom":["Suite Life of Z & C","Danny Phantom","Wizards of Waverly Place"],
      "Joe":["Spongebob","Fairly OddParents","Scooby-Doo"],
      "Cat":["Ned's Declassified","Kim Possible","Even Stevens"],
      "Scott":["iCarly","Victorious","Total Drama Island"],
      "Talal":["Jimmy Neutron","Dexter's Laboratory","Hey Arnold"],
    },
    votes:{},
    totals:{"Olivia":13,"Tom":18,"Joe":12,"Cat":12,"Scott":10,"Talal":0},
    seasonPoints:{"Olivia":2,"Tom":3,"Joe":0,"Cat":0,"Scott":0,"Talal":0},
    winner:"Tom",
  },
  {
    id:"d8", category:"Worst Corporate Buzzwords", season:1, week:8, status:"voted",
    drafters:["Olivia","Joe","Scott","Cat","Tom"],
    numPicks:3,
    picks:{
      "Olivia":["\"Ping\"","\"Happy [any day that's not Friday]!\"","\"Let's take this offline\""],
      "Joe":["\"I hope this email finds you well\"","\"Close the loop\"","\"Can you take a first pass at this?\""],
      "Scott":["\"Let's circle back\"","\"Do you have bandwidth?\"","\"Let's keep it at a 50,000 foot view\""],
      "Cat":["\"Let's not boil the ocean\"","\"We're family\"","\"Thought leadership\""],
      "Tom":["\"Move the needle\"","\"Ideate\"","\"Per my last email\""],
    },
    votes:{},
    totals:{"Tom":15,"Scott":12,"Olivia":7,"Cat":10,"Joe":6},
    seasonPoints:{"Tom":3,"Scott":2,"Olivia":0,"Cat":1,"Joe":0},
    winner:"Tom",
  },
  {
    id:"d9", category:"2000's Bangers", season:1, week:9, status:"voted",
    drafters:["Jolly Rancher","Peppermint Patty","Twix","Kit Kat","Snickers","Twizzler"],
    numPicks:7,
    picks:{
      "Jolly Rancher":["Hey Ya - Outkast","Smack That - Akon","Paper Planes - MIA","I Gotta Feeling - Black Eyed Peas","All the Small Things - Blink 182","Hollaback Girl - Gwen Stefani","American Idiot - Green Day"],
      "Peppermint Patty":["Beautiful Girls - Sean Kingston","Don't Matter - Akon","With You - Chris Brown","Hey There Delilah - Plain White T's","So Sick - Ne-Yo","The Sweet Escape - Gwen Stefani ft. Akon","Replay - Iyaz"],
      "Twix":["Kiss Me Thru the Phone - Soulja Boy","Low - Flo-Rida","Umbrella - Rihanna","Down - Jay Sean, Lil Wayne","Yeah! - Usher","Dangerous - Kardinal Offishall","Break Your Heart - Taio Cruz"],
      "Kit Kat":["Temperature - Sean Paul","Buy U A Drank - T-Pain","The Middle - Jimmy Eat World","Mr. Brightside - The Killers","Sugar We're Going Down - Fall Out Boy","The Way I Are - Timbaland","A Milli - Lil Wayne"],
      "Snickers":["Viva La Vida - Coldplay","One More Time - Daft Punk","Don't Stop the Music - Rihanna","Seven Nation Army - White Stripes","Love - Keyshia Cole","Lose Yourself - Eminem","You Belong With Me - Taylor Swift"],
      "Twizzler":["Get Busy - Sean Paul","If I Ain't Got You - Alicia Keys","21 Questions - 50 Cent","Crank Dat - Soulja Boy","Hips Don't Lie - Shakira","Foolish - Ashanti","Sunday Morning - Maroon 5"],
    },
    votes:{
      "JB - Leah":{"Jolly Rancher":6,"Peppermint Patty":1,"Twix":5,"Kit Kat":4,"Snickers":3,"Twizzler":2},
      "OP - Friend":{"Jolly Rancher":2,"Peppermint Patty":4,"Twix":3,"Kit Kat":6,"Snickers":5,"Twizzler":1},
      "TS - Friend":{"Jolly Rancher":6,"Peppermint Patty":2,"Twix":1,"Kit Kat":3,"Snickers":5,"Twizzler":4},
      "SG - SIL":{"Jolly Rancher":4,"Peppermint Patty":2,"Twix":6,"Kit Kat":3,"Snickers":5,"Twizzler":1},
      "CC - Cade":{"Jolly Rancher":3,"Peppermint Patty":2,"Twix":5,"Kit Kat":6,"Snickers":1,"Twizzler":4},
      "TA - Friend":{"Jolly Rancher":1,"Peppermint Patty":4,"Twix":6,"Kit Kat":3,"Snickers":5,"Twizzler":2},
    },
    totals:{"Jolly Rancher":22,"Peppermint Patty":15,"Twix":26,"Kit Kat":25,"Snickers":24,"Twizzler":14},
    seasonPoints:{"Jolly Rancher":0,"Peppermint Patty":0,"Twix":3,"Kit Kat":2,"Snickers":1,"Twizzler":0},
    winner:"Twix",
  },
  {
    id:"d10", category:"Zoo Animals", season:1, week:10, status:"voted",
    drafters:["Crocodile","Jellyfish","Toad","Salamander"],
    numPicks:5,
    picks:{
      "Crocodile":["Giraffe","Tiger","Wallaby","Clouded Leopard","Black-and-white Lemur"],
      "Jellyfish":["Elephant","Western Lowland Gorilla","Sloth Bear","Bufflehead","Armadillo"],
      "Toad":["Red Panda","Orangutan","Meerkat","Lion","Loris"],
      "Salamander":["Otter","Golden Lion Tamarin","Komodo Dragon","Giant Panda","Bald Eagle"],
    },
    votes:{
      "JB":{"Crocodile":2,"Jellyfish":0,"Toad":3,"Salamander":1},
      "OP":{"Crocodile":4,"Jellyfish":3,"Toad":1,"Salamander":2},
      "TS":{"Crocodile":2,"Jellyfish":1,"Toad":0,"Salamander":3},
      "SG":{"Crocodile":2,"Jellyfish":1,"Toad":3,"Salamander":0},
      "TA":{"Crocodile":4,"Jellyfish":3,"Toad":1,"Salamander":2},
      "CC":{"Crocodile":0,"Jellyfish":1,"Toad":3,"Salamander":2},
    },
    totals:{"Crocodile":14,"Jellyfish":9,"Toad":11,"Salamander":10},
    seasonPoints:{"Crocodile":3,"Jellyfish":0,"Toad":2,"Salamander":1},
    winner:"Crocodile",
  },
];

const SEASON1_SCORES = [
  { week:"Week 1: Fruits",           scores:{ Olivia:0, Talal:0, Scott:3, Cat:3, Tom:0, Joe:1 } },
  { week:"Week 2: Apps",             scores:{ Olivia:0, Talal:0, Scott:0, Cat:3, Tom:1, Joe:2 } },
  { week:"Week 3: Rotation",         scores:{ Olivia:0, Talal:0, Scott:3, Cat:0, Tom:1, Joe:2 } },
  { week:"Week 4: Feelings",         scores:{ Olivia:1, Talal:3, Scott:0, Cat:2, Tom:0, Joe:0 } },
  { week:"Week 5: Months",           scores:{ Olivia:2, Talal:0, Scott:3, Cat:0, Tom:0, Joe:1 } },
  { week:"Week 6: Candies",          scores:{ Olivia:0, Talal:0, Scott:2, Cat:1, Tom:0, Joe:3 } },
  { week:"Week 7: Childhood TV",     scores:{ Olivia:2, Talal:0, Scott:0, Cat:1, Tom:3, Joe:1 } },
  { week:"Week 8: Buzzwords",        scores:{ Olivia:0, Talal:0, Scott:2, Cat:1, Tom:3, Joe:0 } },
  { week:"Week 9: 2000s Bangers",    scores:{ Olivia:0, Talal:3, Scott:1, Cat:2, Tom:0, Joe:0 } },
  { week:"Week 10: Zoo Animals",     scores:{ Olivia:0, Talal:0, Scott:1, Cat:3, Tom:2, Joe:0 } },
];

const SEASON2_SCORES = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRankSuffix(n) {
  if (n===1) return "st"; if (n===2) return "nd"; if (n===3) return "rd"; return "th";
}

function computeSeasonPoints(totals) {
  const sorted = Object.entries(totals).sort((a,b) => b[1]-a[1]);
  const pts = {};
  sorted.forEach(([name, score], i) => {
    // Find all entries with the same score to detect ties
    const rank = sorted.findIndex(([,s]) => s === score);
    const tiedCount = sorted.filter(([,s]) => s === score).length;
    // Award points based on best rank in the tie group
    const basePts = rank===0?3:rank===1?2:rank===2?1:0;
    pts[name] = basePts;
  });
  return pts;
}

function computeTotalsFromVotes(votes, drafters) {
  const totals = {};
  drafters.forEach(d => { totals[d] = 0; });
  Object.values(votes).forEach(voterRankings => {
    const n = Object.keys(voterRankings).length;
    Object.entries(voterRankings).forEach(([drafter, rank]) => {
      const pts = n + 1 - rank;
      totals[drafter] = (totals[drafter] || 0) + pts;
    });
  });
  return totals;
}

function getLeaderboard(scores) {
  const players = {};
  scores.forEach(({ week, scores: ws }) => {
    Object.entries(ws).forEach(([alias, pts]) => {
      const p = resolveName(alias);
      if (!players[p]) players[p] = { total:0, weeks:{}, weeksPlayed:0 };
      players[p].weeks[week] = (players[p].weeks[week] || 0) + pts;
      players[p].total += pts;
      players[p].weeksPlayed++;
    });
  });
  Object.values(players).forEach(p => { p.avg = p.weeksPlayed ? (p.total/p.weeksPlayed).toFixed(2) : "0.00"; });
  return Object.entries(players).sort((a,b) => b[1].total - a[1].total);
}

function getDraftIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("vote");
}

function buildShareLink(draftId) {
  return `${window.location.origin}${window.location.pathname}?vote=${draftId}`;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home");
  const [drafts, setDrafts] = useState([]);
  const [activeDraft, setActiveDraft] = useState(null);
  const [setupData, setSetupData] = useState({ category:"", season:2, week:1, drafters:[], drafterDetails:{}, numPicks:5, imageFile:null, imageUrl:null });
  const [draftState, setDraftState] = useState({ picks:{}, currentRound:0, currentDrafter:0 });
  const [voteState, setVoteState] = useState({ voterName:"", rankings:{}, submitted:false, voters:[] });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  // adminDraftIds: set of draft ids this device created — stored in localStorage
  const [adminDraftIds, setAdminDraftIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("adminDraftIds")||"[]")); }
    catch { return new Set(); }
  });

  useEffect(() => {
    async function loadDrafts() {
      const { data, error } = await supabase.from("drafts").select("*").order("created_at");
      if (error) {
        console.error("Error loading drafts:", error);
        setDrafts(SEED_DRAFTS);
        setLoading(false);
        return;
      }
      if (data.length === 0) {
        for (const draft of SEED_DRAFTS) {
          await supabase.from("drafts").insert({ id: draft.id, data: draft });
        }
        setDrafts(SEED_DRAFTS);
      } else {
        setDrafts(data.map(row => row.data));
        const id = getDraftIdFromUrl();
        if (id) {
          const found = data.find(row => row.id === id);
          if (found) {
            // Also fetch latest votes from votes table to ensure freshness
            const { data: voteRows } = await supabase.from("votes").select("*").eq("draft_id", found.id);
            let draftData = found.data;
            if (voteRows && voteRows.length > 0) {
              const votes = {};
              voteRows.forEach(v => { votes[v.voter_name] = v.rankings; });
              const totals = computeTotalsFromVotes(votes, draftData.drafters);
              draftData = { ...draftData, votes, totals };
            }
            setActiveDraft(draftData);
            setVoteState({ voterName:"", rankings:{}, submitted:false, voters: Object.keys(draftData.votes||{}) });
            setView("vote");
          }
        }
      }
      setLoading(false);
    }
    loadDrafts();
  }, []);

  async function saveDraft(draft) {
    await supabase.from("drafts").upsert({ id: draft.id, data: draft });
  }

  function notify(msg, type="success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  }

  function startSetup() {
    setSetupData({ category:"", season:2, week:1, drafters:[], drafterDetails:{}, numPicks:5, imageFile:null, imageUrl:null });
    setView("setup");
  }

  async function createDraft(orderedDrafters) {
    if (!setupData.category.trim()) return notify("Add a category name","error");
    if (!orderedDrafters || orderedDrafters.length < 2) return notify("Need at least 2 drafters","error");
    setCreating(true);
    let imageUrl = null;
    if (setupData.imageFile) {
      const ext = setupData.imageFile.name.split(".").pop();
      const path = `drafts/${Date.now()}.${ext}`;
      const { data: upData, error: upErr } = await supabase.storage
        .from("draft-images").upload(path, setupData.imageFile);
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("draft-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }
    const newDraft = {
      id: "d" + Date.now(),
      category: setupData.category,
      season: setupData.season,
      week: setupData.week,
      status: "drafting",
      drafters: orderedDrafters,
      drafterDetails: setupData.drafterDetails,
      numPicks: setupData.numPicks,
      picks: Object.fromEntries(orderedDrafters.map(d=>[d,[]])),
      votes: {},
      totals: {},
      imageUrl,
    };
    setDrafts(prev => [...prev, newDraft]);
    setActiveDraft(newDraft);
    setDraftState({ picks: Object.fromEntries(orderedDrafters.map(d=>[d,[]])), currentRound:0, currentDrafter:0 });
    await saveDraft(newDraft);
    // Mark as admin on this device
    const newAdminIds = new Set([...adminDraftIds, newDraft.id]);
    setAdminDraftIds(newAdminIds);
    localStorage.setItem("adminDraftIds", JSON.stringify([...newAdminIds]));
    setCreating(false);
    setView("draft");
  }

  function submitPick(pick) {
    if (!pick.trim()) return;
    const d = activeDraft;
    const drafter = d.drafters[draftState.currentDrafter];
    const newPicks = { ...draftState.picks };
    newPicks[drafter] = [...(newPicks[drafter]||[]), toTitleCase(pick)];
    const totalPicks = Object.values(newPicks).flat().length;
    const totalExpected = d.drafters.length * d.numPicks;
    // Snake draft: even rounds go 0..n-1, odd rounds go n-1..0
    const n = d.drafters.length;
    const nextRound = Math.floor(totalPicks / n);
    const posInRound = totalPicks % n;
    const nextDrafterIdx = nextRound % 2 === 0 ? posInRound : (n - 1 - posInRound);
    setDraftState({ picks: newPicks, currentRound: nextRound, currentDrafter: nextDrafterIdx });
    if (totalPicks >= totalExpected) {
      const updated = { ...d, picks: newPicks, status:"voting" };
      setActiveDraft(updated);
      setDrafts(prev => prev.map(x => x.id===d.id ? updated : x));
      saveDraft(updated);
      setVoteState({ voterName:"", rankings:{}, submitted:false, voters:[] });
      setView("vote");
    }
  }

  function editPick(drafter, index, newValue) {
    const newPicks = { ...draftState.picks };
    newPicks[drafter] = [...(newPicks[drafter]||[])];
    newPicks[drafter][index] = toTitleCase(newValue);
    setDraftState(prev => ({ ...prev, picks: newPicks }));
    const updated = { ...activeDraft, picks: { ...activeDraft.picks, [drafter]: newPicks[drafter] } };
    setActiveDraft(updated);
    setDrafts(prev => prev.map(x => x.id===activeDraft.id ? updated : x));
    saveDraft(updated);
  }

  function loadDraftForVoting(draft) {
    setActiveDraft(draft);
    setVoteState({ voterName:"", rankings:{}, submitted:false, voters: Object.keys(draft.votes||{}) });
    setView("vote");
  }

  async function submitVote() {
    const { voterName, rankings } = voteState;
    if (!voterName.trim()) return notify("Enter your name","error");
    const drafters = activeDraft.drafters;
    const existingVoters = Object.keys(activeDraft.votes||{});
    if (existingVoters.map(v=>v.toLowerCase()).includes(voterName.trim().toLowerCase())) {
      return notify(`${voterName} has already voted!`, "error");
    }
    const trimmed = voterName.trim();
    const matchedNickname = drafters.find(d =>
      d === trimmed ||
      (activeDraft.drafterDetails?.[d]?.realName || "").toLowerCase() === trimmed.toLowerCase()
    );
    const draftersToRank = drafters.filter(d => d !== matchedNickname);
    const ranked = Object.values(rankings).filter(v => v !== "" && v !== undefined);
    if (ranked.length !== draftersToRank.length || new Set(ranked).size !== draftersToRank.length) {
      return notify(`Rank all ${draftersToRank.length} drafters with unique values`, "error");
    }
    // Save vote to separate votes table
    const voteId = `${activeDraft.id}_${trimmed}_${Date.now()}`;
    await supabase.from("votes").insert({ id: voteId, draft_id: activeDraft.id, voter_name: trimmed, rankings });
    // Also update draft totals in drafts table
    const newVotes = { ...(activeDraft.votes||{}), [trimmed]: { ...rankings } };
    const newTotals = computeTotalsFromVotes(newVotes, drafters);
    const updated = { ...activeDraft, votes: newVotes, totals: newTotals, status:"voting" };
    setActiveDraft(updated);
    setDrafts(prev => prev.map(x => x.id===activeDraft.id ? updated : x));
    saveDraft(updated);
    setVoteState(prev => ({ ...prev, submitted:true, voters: Object.keys(newVotes) }));
    notify("Vote submitted!");
  }

  function finalizeDraft() {
    const pts = computeSeasonPoints(activeDraft.totals);
    const sorted = Object.entries(activeDraft.totals).sort((a,b)=>b[1]-a[1]);
    const topScore = sorted[0]?.[1];
    // Get all drafters with the top score (handles ties)
    const winners = sorted
      .filter(([,score]) => score === topScore)
      .map(([nickname]) =>
        activeDraft.drafterDetails?.[nickname]?.realName || resolveName(nickname) || nickname
      );
    const winnerRealName = winners.join(" & ");
    const updated = { ...activeDraft, status:"voted", seasonPoints:pts, winner:winnerRealName };
    setActiveDraft(updated);
    setDrafts(prev => prev.map(x => x.id===activeDraft.id ? updated : x));
    saveDraft(updated);
    setView("results");
  }

  async function deleteDraft(id) {
    if (!window.confirm("Delete this draft? This can't be undone.")) return;
    setDrafts(prev => prev.filter(d => d.id !== id));
    await supabase.from("drafts").delete().eq("id", id);
  }

  if (loading) return (
    <div style={{ ...styles.root, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", color:P.navy }}>
        <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
        <div style={{ fontWeight:700, fontSize:18 }}>Loading drafts…</div>
      </div>
    </div>
  );

  return (
    <div style={styles.root}>
      {notification && (
        <div style={{ ...styles.notification, background: notification.type==="error" ? P.red : P.lime }}>
          {notification.msg}
        </div>
      )}
      {view==="home"        && <HomeView drafts={drafts} onNew={startSetup} onLeaderboard={()=>setView("leaderboard")} onHistory={()=>setView("history")} onAnalysis={()=>setView("analysis")} onVote={loadDraftForVoting} onResults={d=>{setActiveDraft(d);setView("results");}} />}
      {view==="setup"       && <SetupView data={setupData} setData={setSetupData} onNext={()=>setView("wheel")} onBack={()=>setView("home")} />}
      {view==="wheel"       && <WheelView drafters={setupData.drafters||[]} drafterDetails={setupData.drafterDetails||{}} onCreate={createDraft} creating={creating} onBack={()=>setView("setup")} />}
      {view==="draft"       && activeDraft && <DraftView draft={activeDraft} state={draftState} onPick={submitPick} onEditPick={editPick} isAdmin={adminDraftIds.has(activeDraft.id)} onBack={()=>setView("home")} />}
      {view==="vote"        && activeDraft && <VoteView draft={activeDraft} voteState={voteState} setVoteState={setVoteState} onSubmit={submitVote} onFinalize={finalizeDraft} onBack={()=>setView("home")} isAdmin={adminDraftIds.has(activeDraft.id)} onRefreshDraft={d=>{setActiveDraft(d);setDrafts(prev=>prev.map(x=>x.id===d.id?d:x));}} />}
      {view==="results"     && activeDraft && <ResultsView draft={activeDraft} onNewDraft={startSetup} onLeaderboard={()=>setView("leaderboard")} onBack={()=>setView("home")} />}
      {view==="leaderboard" && <LeaderboardView drafts={drafts} onBack={()=>setView("home")} />}
      {view==="history"     && <HistoryView drafts={drafts} onView={d=>{setActiveDraft(d);setView("results");}} onVote={loadDraftForVoting} onDelete={deleteDraft} isSuperAdmin={isSuperAdmin} onEditSeason={editDraftSeason} onBack={()=>setView("home")} />}
      {view==="analysis"    && <AnalysisView drafts={drafts} onBack={()=>setView("home")} />}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeView({ drafts, onNew, onLeaderboard, onHistory, onAnalysis, onVote, onResults }) {
  const active = drafts.filter(d => d.status !== "voted");
  const recent = drafts.filter(d => d.status === "voted").slice(-2);
  return (
    <div style={styles.page}>
      <div style={{ ...styles.hero, textAlign:"center", alignItems:"center", display:"flex", flexDirection:"column", width:"100%" }}>
        <div style={styles.heroTag}>Draft Simulator</div>
        <h1 style={styles.heroTitle}>Thursday's Best<br/><span style={styles.heroAccent}>Draft Room</span></h1>
        <p style={styles.heroSub}>Build your roster. Defend your picks. Let the votes decide. Brought to you by Friday's Team Check-in.</p>
        <button style={styles.btnPrimary} onClick={onNew}>+ Start New Draft</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:32 }}>
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
        <button style={styles.navCard} onClick={onAnalysis}>
          <span style={styles.navIcon}>📊</span>
          <span style={styles.navLabel}>Analysis</span>
          <span style={styles.navSub}>Player stats</span>
        </button>
      </div>
      {active.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Active Drafts</h2>
          {active.map(d => (
            <div key={d.id} style={styles.draftCard}>
              <div style={{ flex:1 }}>
                <div style={styles.draftName}>{d.category}</div>
                <div style={styles.draftMeta}>S{d.season} W{d.week} · {d.drafters.length} drafters · {d.status==="drafting"?"In Progress":"Awaiting Votes"}</div>
              </div>
              <button style={styles.btnSmall} onClick={() => d.status==="voting" ? onVote(d) : null}>
                {d.status==="drafting" ? "Continue" : "Vote"}
              </button>
            </div>
          ))}
        </section>
      )}
      {recent.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Results</h2>
          {recent.map(d => (
            <div key={d.id} style={styles.draftCard}>
              <div style={{ flex:1 }}>
                <div style={styles.draftName}>{d.category}</div>
                <div style={styles.draftMeta}>Winner: <strong>{resolveName(d.winner)}</strong></div>
              </div>
              <button style={styles.btnSmall} onClick={() => onResults(d)}>View</button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

// ─── SETUP ────────────────────────────────────────────────────────────────────
function SetupView({ data, setData, onNext, onBack }) {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [color, setColor] = useState("#1D3169");

  function addDrafter() {
    if (!nickname.trim()) return;
    const key = nickname.trim();
    setData(d => ({
      ...d,
      drafters: [...d.drafters, key],
      drafterDetails: {
        ...(d.drafterDetails || {}),
        [key]: { realName: realName.trim() || key, color: color }
      }
    }));
    setNickname(""); setRealName(""); setColor("#1D3169");
  }

  function removeDrafter(i) {
    setData(d => {
      const removed = d.drafters[i];
      const newDetails = { ...(d.drafterDetails || {}) };
      delete newDetails[removed];
      return { ...d, drafters: d.drafters.filter((_,j)=>j!==i), drafterDetails: newDetails };
    });
  }

  function canProceed() {
    return data.category?.trim() && Array.isArray(data.drafters) && data.drafters.length >= 2;
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>New Draft</h1>

      <div style={styles.card}>
        <label style={styles.label}>Category</label>
        <input style={styles.input} placeholder="e.g. Best Pizza Toppings…" value={data.category} onChange={e=>setData(d=>({...d,category:e.target.value}))} />
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

        <label style={styles.label}>Draft Image (optional)</label>
        <input type="file" accept="image/*" style={{ ...styles.input, padding:"8px" }}
          onChange={e => setData(d=>({...d, imageFile: e.target.files[0]||null}))} />
        {data.imageFile && <div style={{ fontSize:12, color:P.navy, marginBottom:8 }}>📷 {data.imageFile.name}</div>}
      </div>

      <div style={styles.card}>
        <label style={styles.label}>Add Drafters</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
          <div>
            <label style={{ ...styles.label, fontSize:10 }}>Nickname / Alias</label>
            <input style={{...styles.input, marginBottom:0}} placeholder="e.g. Jolly Rancher" value={nickname} onChange={e=>setNickname(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addDrafter()} />
          </div>
          <div>
            <label style={{ ...styles.label, fontSize:10 }}>Real Name</label>
            <input style={{...styles.input, marginBottom:0}} placeholder="e.g. Joe" value={realName} onChange={e=>setRealName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addDrafter()} />
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div>
            <label style={{ ...styles.label, fontSize:10 }}>Color</label>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{ width:40, height:36, border:"none", borderRadius:6, cursor:"pointer", padding:2 }} />
              <input style={{ ...styles.input, width:100, marginBottom:0, fontFamily:"monospace", fontSize:13 }} placeholder="#1D3169" value={color} onChange={e=>setColor(e.target.value)} />
            </div>
          </div>
          <button style={{ ...styles.btnSmall, marginTop:20 }} onClick={addDrafter}>+ Add</button>
        </div>

        {data.drafters.length > 0 && (
          <div style={{ marginTop:8 }}>
            <label style={styles.label}>Drafters ({data.drafters.length})</label>
            {data.drafters.map((d,i) => {
              const det = data.drafterDetails?.[d] || {};
              const c = det.color || COLORS[i%COLORS.length];
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #f0ede9" }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", background:c, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <span style={{ fontWeight:700, color:P.navy }}>{d}</span>
                    {det.realName && det.realName !== d && <span style={{ color:"#aaa", fontSize:12, marginLeft:6 }}>({det.realName})</span>}
                  </div>
                  <button style={styles.chipX} onClick={()=>removeDrafter(i)}>×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button style={{...styles.btnPrimary, width:"100%", opacity: canProceed()?1:0.4}}
        onClick={()=>canProceed()&&onNext()}>
        Spin for Draft Order →
      </button>
    </div>
  );
}

// ─── WHEEL VIEW ───────────────────────────────────────────────────────────────
function WheelView({ drafters, drafterDetails, onCreate, creating, onBack }) {
  // remainingDrafters = still on wheel, order = final claimed positions
  const [remaining, setRemaining] = useState([...drafters]);
  const [order, setOrder] = useState([]); // [{drafter, position}]
  const [spinning, setSpinning] = useState(false);
  const [displayAngle, setDisplayAngle] = useState(0);
  const [spinResult, setSpinResult] = useState(null); // drafter name landed on
  const [claiming, setClaiming] = useState(false); // waiting for someone to claim

  if (!drafters || drafters.length < 2) return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <div style={styles.card}><div style={{ color:P.red, textAlign:"center", padding:24 }}>No drafters found. Go back and add at least 2.</div></div>
    </div>
  );

  const n = remaining.length;
  const sliceAngle = n > 0 ? 360 / n : 360;
  const CX = 140, CY = 140, R = 128, R_LABEL = 85;
  const done = remaining.length === 0;

  function getColor(name) {
    const origIdx = drafters.indexOf(name);
    return drafterDetails?.[name]?.color || COLORS[origIdx % COLORS.length];
  }

  function spin() {
    if (spinning || claiming || done || remaining.length === 0) return;
    setSpinning(true);
    setSpinResult(null);
    const landingDeg = Math.random() * 360;
    const totalRotation = displayAngle + 6 * 360 + landingDeg;
    setDisplayAngle(totalRotation);
    setTimeout(() => {
      setSpinning(false);
      setClaiming(true);
      const pointerOnWheel = ((360 - landingDeg) % 360 + 360) % 360;
      const winnerIdx = Math.floor(pointerOnWheel / sliceAngle) % n;
      setSpinResult(remaining[winnerIdx]);
    }, 4500);
  }

  function claimPosition(drafter, position) {
    const newOrder = [...order, { drafter, position }];
    const newRemaining = remaining.filter(d => d !== drafter);
    setOrder(newOrder);
    setRemaining(newRemaining);
    setSpinResult(null);
    setClaiming(false);
    setDisplayAngle(0); // reset angle for fresh spin with smaller wheel
    // If only one left, auto-assign last position
    if (newRemaining.length === 1) {
      const usedPositions = newOrder.map(o => o.position);
      const allPositions = drafters.map((_,i) => i+1);
      const lastPos = allPositions.find(p => !usedPositions.includes(p));
      const finalOrder = [...newOrder, { drafter: newRemaining[0], position: lastPos }];
      setOrder(finalOrder);
      setRemaining([]);
    }
  }

  function buildPath(i, total) {
    const sa = (i * (360/total) - 90) * (Math.PI/180);
    const ea = ((i+1) * (360/total) - 90) * (Math.PI/180);
    const x1 = CX + R * Math.cos(sa), y1 = CY + R * Math.sin(sa);
    const x2 = CX + R * Math.cos(ea), y2 = CY + R * Math.sin(ea);
    return `M${CX},${CY} L${x1},${y1} A${R},${R} 0 ${(360/total)>180?1:0},1 ${x2},${y2} Z`;
  }

  function getLabelPos(i, total) {
    const mid = ((i+0.5) * (360/total) - 90) * (Math.PI/180);
    return { x: CX + R_LABEL * Math.cos(mid), y: CY + R_LABEL * Math.sin(mid) };
  }

  // Available positions not yet claimed
  const claimedPositions = order.map(o => o.position);
  const availablePositions = drafters.map((_,i) => i+1).filter(p => !claimedPositions.includes(p));

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>Draft Order</h1>

      {!done ? (
        <>
          <p style={{ ...styles.draftMeta, textAlign:"center", marginBottom:16 }}>
            {claiming ? `${spinResult} — pick your draft position!` : `${remaining.length} drafter${remaining.length!==1?"s":""} remaining`}
          </p>

          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:24 }}>
            <div style={{ width:0, height:0, borderLeft:"14px solid transparent", borderRight:"14px solid transparent", borderTop:`28px solid ${P.red}`, marginBottom:-4, zIndex:10 }} />
            <div style={{ transition: spinning ? "transform 4.5s cubic-bezier(0.25,0.1,0.1,1)" : "none", transform:`rotate(${displayAngle}deg)`, borderRadius:"50%", boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
              <svg width="280" height="280" viewBox="0 0 280 280">
                {remaining.map((d,i) => {
                  const pos = getLabelPos(i, remaining.length);
                  const short = d.length > 9 ? d.slice(0,8)+"…" : d;
                  return (
                    <g key={d}>
                      <path d={buildPath(i, remaining.length)} fill={getColor(d)} stroke="#fff" strokeWidth="2" />
                      <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
                        style={{ fontSize: remaining.length > 6 ? 9 : 11, fontWeight:700, fill:"#fff", fontFamily:"Segoe UI, sans-serif", pointerEvents:"none" }}>
                        {short}
                      </text>
                    </g>
                  );
                })}
                <circle cx={CX} cy={CY} r="18" fill="#fff" stroke={P.warmGrey} strokeWidth="2" />
              </svg>
            </div>

            {!claiming && !spinning && (
              <button style={{ ...styles.btnPrimary, marginTop:24, padding:"14px 48px", fontSize:16 }} onClick={spin}>
                🎰 Spin!
              </button>
            )}
          </div>

          {/* Claim position panel */}
          {claiming && spinResult && (
            <div style={{ ...styles.card, border:`2px solid ${getColor(spinResult)}` }}>
              <div style={{ textAlign:"center", marginBottom:12 }}>
                <div style={{ fontSize:18, fontWeight:800, color:getColor(spinResult) }}>{spinResult}</div>
                <div style={{ fontSize:13, color:"#888", marginTop:4 }}>Choose your draft position:</div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
                {availablePositions.map(pos => (
                  <button key={pos} style={{ ...styles.btnSmall, padding:"10px 20px", fontSize:16, fontWeight:800, borderColor:getColor(spinResult), color:getColor(spinResult) }}
                    onClick={() => claimPosition(spinResult, pos)}>
                    #{pos}
                  </button>
                ))}
              </div>
              <div style={{ fontSize:11, color:"#aaa", textAlign:"center", marginTop:8 }}>
                Position determines your snake draft order
              </div>
            </div>
          )}

          {/* Claimed so far */}
          {order.length > 0 && (
            <div style={styles.card}>
              <div style={styles.label}>Claimed Positions</div>
              {order.sort((a,b)=>a.position-b.position).map(({drafter,position}) => {
                const det = drafterDetails?.[drafter] || {};
                return (
                  <div key={drafter} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:"1px solid #f0ede9" }}>
                    <span style={{ fontWeight:700, color:"#bbb", minWidth:28 }}>#{position}</span>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:getColor(drafter), flexShrink:0 }} />
                    <span style={{ flex:1, fontWeight:600, color:P.navy }}>{drafter}</span>
                    {det.realName && det.realName !== drafter && <span style={{ fontSize:12, color:"#aaa" }}>({det.realName})</span>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div style={styles.card}>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:40, marginBottom:6 }}>🎉</div>
            <div style={{ fontSize:20, fontWeight:800, color:P.navy }}>Draft order locked in!</div>
          </div>
          <div style={styles.label}>Draft Order (Snake)</div>
          {order.sort((a,b)=>a.position-b.position).map(({drafter,position}) => {
            const det = drafterDetails?.[drafter] || {};
            return (
              <div key={drafter} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f0ede9" }}>
                <span style={{ fontWeight:700, color:"#bbb", minWidth:28 }}>#{position}</span>
                <div style={{ width:14, height:14, borderRadius:"50%", background:getColor(drafter), flexShrink:0 }} />
                <span style={{ flex:1, fontWeight:600, color:P.navy }}>{drafter}</span>
                {det.realName && det.realName !== drafter && <span style={{ fontSize:12, color:"#aaa" }}>({det.realName})</span>}
              </div>
            );
          })}
          <div style={{ display:"flex", gap:8, marginTop:20 }}>
            <button style={{ ...styles.btnSmall, flex:1 }} onClick={() => { setRemaining([...drafters]); setOrder([]); setDisplayAngle(0); setSpinResult(null); setClaiming(false); }}>
              Reset
            </button>
            <button style={{ ...styles.btnPrimary, flex:2, opacity:creating?0.6:1 }} disabled={creating}
              onClick={() => {
                const sorted = order.sort((a,b)=>a.position-b.position).map(o=>o.drafter);
                onCreate(sorted);
              }}>
              {creating ? "Creating…" : "Start Draft →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── DRAFT ROOM ───────────────────────────────────────────────────────────────
function DraftView({ draft, state, onPick, onEditPick, isAdmin, onBack }) {
  const [pick, setPick] = useState("");
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");
  const drafter = draft.drafters[state.currentDrafter];
  const color = draft.drafterDetails?.[drafter]?.color || COLORS[state.currentDrafter % COLORS.length];
  const totalPicks = Object.values(state.picks).flat().length;
  const totalNeeded = draft.drafters.length * draft.numPicks;
  const progress = totalPicks / totalNeeded;
  const round = state.currentRound + 1;

  function handlePick() {
    if (!pick.trim()) return;
    onPick(pick);
    setPick("");
  }
  function startEdit(d, i, val) { setEditing({ drafter:d, index:i }); setEditVal(val); }
  function saveEdit() {
    if (!editVal.trim()||!editing) return;
    onEditPick(editing.drafter, editing.index, editVal.trim());
    setEditing(null); setEditVal("");
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>{draft.category}</h1>
      <div style={styles.draftMeta}>Season {draft.season} · Week {draft.week}</div>
      <div style={{ ...styles.progressBar, marginTop:12 }}>
        <div style={{ ...styles.progressFill, width:`${progress*100}%`, background:color }} />
      </div>
      <div style={{ ...styles.draftMeta, marginBottom:16 }}>Round {round} of {draft.numPicks} · Pick {totalPicks+1} of {totalNeeded}</div>
      <div style={{ ...styles.pickPrompt, borderColor:color }}>
        <div style={{ color, fontWeight:700, fontSize:13, marginBottom:6, letterSpacing:2, textTransform:"uppercase" }}>Now picking — Round {round}</div>
        <div style={{ fontSize:26, fontWeight:800, color:P.navy, marginBottom:16 }}>{drafter}</div>
        <input style={styles.bigInput} placeholder="Type your pick…" value={pick} onChange={e=>setPick(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handlePick()} autoFocus />
        <button style={{ ...styles.btnPrimary, marginTop:12, background:color, width:"100%", color:"#fff" }} onClick={handlePick}>Lock It In ✓</button>
      </div>
      <div style={styles.boardGrid}>
        {draft.drafters.map((d,i) => {
          const dc = draft.drafterDetails?.[d]?.color || COLORS[i%COLORS.length];
          return (
          <div key={d} style={{ ...styles.boardCard, borderTopColor:dc }}>
            <div style={{ ...styles.boardName, color:dc }}>{d}</div>
            {isAdmin && <div style={{ fontSize:10, color:"#ccc", marginBottom:2 }}>tap to edit</div>}
            {(state.picks[d]||[]).map((p,j) => (
              <div key={j} style={{ ...styles.pickItem, cursor:isAdmin?"pointer":"default" }} onClick={()=>isAdmin&&startEdit(d,j,p)}>
                {editing?.drafter===d&&editing?.index===j ? (
                  <div style={{ display:"flex", gap:4, flex:1 }}>
                    <input style={{ ...styles.input, flex:1, marginBottom:0, fontSize:12, padding:"4px 8px" }}
                      value={editVal} onChange={e=>setEditVal(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}} autoFocus />
                    <button style={{ ...styles.btnSmall, padding:"2px 8px", fontSize:11 }} onClick={saveEdit}>✓</button>
                    <button style={{ ...styles.chipX, fontSize:14 }} onClick={()=>setEditing(null)}>×</button>
                  </div>
                ) : (
                  <><span style={styles.pickNum}>{j+1}</span> {p}{isAdmin&&<span style={{ color:"#ddd", fontSize:10, marginLeft:4 }}>✎</span>}</>
                )}
              </div>
            ))}
            {Array.from({ length: draft.numPicks-(state.picks[d]||[]).length }).map((_,j) => (
              <div key={"e"+j} style={{ ...styles.pickItem, opacity:0.25 }}>
                <span style={styles.pickNum}>{(state.picks[d]||[]).length+j+1}</span> —
              </div>
            ))}
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── VOTING ───────────────────────────────────────────────────────────────────
function VoteView({ draft, voteState, setVoteState, onSubmit, onFinalize, onBack, isAdmin, onRefreshDraft }) {
  const { voterName, rankings, submitted, voters } = voteState;
  const [copied, setCopied] = useState(false);

  // Real-time: poll votes table every 4 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: voteRows } = await supabase.from("votes").select("*").eq("draft_id", draft.id);
      if (!voteRows) return;
      const freshVotes = {};
      voteRows.forEach(v => { freshVotes[v.voter_name] = v.rankings; });
      const freshVoterNames = Object.keys(freshVotes);
      if (freshVoterNames.length !== voters.length) {
        const freshTotals = computeTotalsFromVotes(freshVotes, draft.drafters);
        const freshDraft = { ...draft, votes: freshVotes, totals: freshTotals };
        onRefreshDraft(freshDraft);
        setVoteState(v => ({ ...v, voters: freshVoterNames }));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [draft.id, voters.length]);

  function copyLink() {
    navigator.clipboard.writeText(buildShareLink(draft.id)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function setRank(drafter, val) {
    setVoteState(v => ({ ...v, rankings: { ...v.rankings, [drafter]: val === "" ? "" : +val } }));
  }

  const trimmedVoter = voterName.trim();
  const matchedDrafter = trimmedVoter ? draft.drafters.find(d =>
    d === trimmedVoter ||
    (draft.drafterDetails?.[d]?.realName || "").toLowerCase() === trimmedVoter.toLowerCase()
  ) : null;
  const voterIsDrafter = !!matchedDrafter;
  const draftersToRank = trimmedVoter ? draft.drafters.filter(d => d !== matchedDrafter) : draft.drafters;
  const rankedValues = Object.values(rankings).filter(v => v !== "" && v !== undefined);
  const allRanked = rankedValues.length === draftersToRank.length && draftersToRank.length > 0;
  const uniqueRanks = new Set(rankedValues).size === rankedValues.length;

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      {draft.imageUrl && (
        <img src={draft.imageUrl} alt={draft.category}
          style={{ width:"100%", height:"auto", borderRadius:12, marginBottom:12, display:"block" }} />
      )}
      <h1 style={styles.pageTitle}>Vote</h1>
      <div style={styles.draftMeta}>{draft.category} · S{draft.season} W{draft.week}</div>

      {/* Draft board table */}
      <div style={{ ...styles.card, marginTop:16 }}>
        <div style={styles.label}>Draft Board</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr>
                <th style={{ ...styles.th, minWidth:40 }}>Rd</th>
                {draft.drafters.map((d,i) => {
                  const dc = draft.drafterDetails?.[d]?.color || COLORS[i%COLORS.length];
                  return <th key={d} style={{ ...styles.th, color:dc, minWidth:90, textAlign:"center" }}>{d}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: draft.numPicks }, (_,round) => (
                <tr key={round} style={{ background: round%2===0 ? P.white : "#fafaf8" }}>
                  <td style={{ ...styles.td, fontWeight:700, color:P.navy, fontSize:11, textAlign:"center", whiteSpace:"nowrap" }}>R{round+1}</td>
                  {draft.drafters.map((d,i) => {
                    const dc = draft.drafterDetails?.[d]?.color || COLORS[i%COLORS.length];
                    const pick = (draft.picks[d]||[])[round];
                    return (
                      <td key={d} style={{ ...styles.td, borderLeft:`2px solid ${dc}40`, paddingLeft:8, fontWeight: pick ? 700 : 400, color: pick ? dc : "#ddd", textAlign:"center" }}>
                        {pick || "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ ...styles.card, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <span style={{ fontSize:13, color:P.navy, flex:1 }}>🔗 Share this draft so others can vote</span>
        <button style={{ ...styles.btnSmall, fontSize:12 }} onClick={copyLink}>{copied ? "Copied! ✓" : "Copy Link"}</button>
      </div>

      {voters.length > 0 && (
        <div style={styles.voterBadges}>
          {voters.map(v => <span key={v} style={styles.voterBadge}>{v} ✓</span>)}
        </div>
      )}

      {!submitted ? (
        <div style={styles.card}>
          <label style={styles.label}>Your Name / Alias</label>
          <input
            style={styles.input}
            placeholder="How should we know you?"
            value={voterName}
            onChange={e => setVoteState(v => ({ ...v, voterName:e.target.value, rankings:{} }))}
          />
          {voterName.trim() && (
            <>
              <label style={{ ...styles.label, marginTop:8 }}>
                Rank the rosters — 1 = best
                {voterIsDrafter && <span style={{ color:"#aaa", fontWeight:400, textTransform:"none", letterSpacing:0, fontSize:11 }}> (you can't vote for yourself)</span>}
              </label>
              <div style={styles.voteHint}>
                No ties. 1 = best = most pts ({draftersToRank.length} pts), {draftersToRank.length} = last = 1 pt.
                {voterIsDrafter && <span style={{ color:"#aaa" }}> You can't vote for yourself.</span>}
              </div>
              {draftersToRank.map((d) => {
                const ci = draft.drafters.indexOf(d);
                const dc = draft.drafterDetails?.[d]?.color || COLORS[ci%COLORS.length];
                return (
                  <div key={d} style={styles.voteRow}>
                    <div style={{ ...styles.voteColorBar, background:dc }} />
                    <div style={{ flex:1 }}>
                      <div style={styles.voteDrafter}>{d}</div>
                      <div style={{ marginTop:4 }}>
                        {(draft.picks[d]||[]).map((p,pi) => (
                          <div key={pi} style={{ display:"flex", gap:6, fontSize:12, color:"#555", padding:"2px 0", borderBottom:"1px solid #f8f8f8" }}>
                            <span style={{ color:"#ccc", minWidth:16, fontWeight:700 }}>{pi+1}</span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <select
                      style={{ ...styles.rankSelect, borderColor: rankings[d] ? dc : P.warmGrey, color: rankings[d] ? P.red : "#aaa" }}
                      value={rankings[d] || ""}
                      onChange={e => setRank(d, e.target.value)}
                    >
                      <option value="">—</option>
                      {Array.from({ length: draftersToRank.length }, (_,k) => k+1).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
              <button
                style={{ ...styles.btnPrimary, marginTop:20, width:"100%", opacity: allRanked&&uniqueRanks?1:0.4 }}
                onClick={onSubmit}
                disabled={!allRanked || !uniqueRanks}
              >
                Submit Vote
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={styles.card}>
          <div style={{ textAlign:"center", padding:"12px 0 20px" }}>
            <div style={{ fontSize:40 }}>✓</div>
            <div style={{ fontSize:18, fontWeight:700, color:P.lime, marginTop:8 }}>Vote submitted, {voterName}!</div>
          </div>
          <div style={styles.label}>Your rankings:</div>
          {Object.entries(rankings).sort((a,b)=>a[1]-b[1]).map(([d,r]) => (
            <div key={d} style={styles.voteRow}>
              <div style={{ ...styles.voteColorBar, background:draft.drafterDetails?.[d]?.color || COLORS[draft.drafters.indexOf(d)%COLORS.length] }} />
              <div style={{ flex:1, color:P.navy }}>{d}</div>
              <div style={{ fontWeight:800, color:P.red }}>#{r}</div>
            </div>
          ))}
          <button style={{ ...styles.btnSmall, marginTop:16, width:"100%" }} onClick={()=>setVoteState(v=>({...v,submitted:false,voterName:"",rankings:{}}))}>
            Add Another Vote
          </button>
        </div>
      )}

      {/* ── ADMIN PANEL ── only for draft creator on this device */}
      {isAdmin && (
        <div style={{ ...styles.card, border:`2px solid ${P.navy}`, background:"#f0f2ff" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:16 }}>🔧</span>
            <span style={{ fontWeight:700, color:P.navy, fontSize:14 }}>Admin Panel</span>
            <span style={{ fontSize:11, color:"#aaa", marginLeft:4 }}>auto-refreshes every 4s</span>
          </div>
          <div style={{ fontSize:13, color:"#555", marginBottom:4 }}>
            <strong>{voters.length}</strong> vote{voters.length!==1?"s":""} received
          </div>
          {voters.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
              {voters.map(v => <span key={v} style={{ ...styles.voterBadge, background:P.navy, color:"#fff" }}>{v} ✓</span>)}
            </div>
          )}
          <button style={{ ...styles.btnPrimary, width:"100%" }} onClick={onFinalize}>
            Close Voting & See Results →
          </button>
        </div>
      )}

      {Object.keys(draft.totals||{}).length > 0 && (
        <div style={styles.card}>
          <div style={styles.label}>Live Totals (higher = winning)</div>
          {Object.entries(draft.totals).sort((a,b)=>b[1]-a[1]).map(([d,t],i) => {
            const lc = draft.drafterDetails?.[d]?.color || COLORS[draft.drafters.indexOf(d)%COLORS.length];
            const maxVal = Math.max(...Object.values(draft.totals));
            const pct = Math.max(20, (t / maxVal) * 100);
            return (
            <div key={d} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ ...styles.resultRank, minWidth:32, flexShrink:0 }}>{i+1}{getRankSuffix(i+1)}</span>
              <div style={{ flex:1, position:"relative", height:36, borderRadius:6, background:"#f0ede9", overflow:"visible" }}>
                {/* Colored fill bar */}
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${pct}%`, background:lc, borderRadius:6, transition:"width 0.5s ease" }} />
                {/* Name inside bar on left */}
                <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontWeight:700, fontSize:13, color:"#fff", textShadow:"0 1px 3px rgba(0,0,0,0.5)", zIndex:2, whiteSpace:"nowrap" }}>{d}</span>
                {/* Score always outside bar on right in navy */}
                <span style={{ position:"absolute", right:-44, top:"50%", transform:"translateY(-50%)", fontWeight:900, fontSize:16, color:lc, zIndex:2, minWidth:36, textAlign:"right" }}>{t}</span>
              </div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function ResultsView({ draft, onNewDraft, onLeaderboard, onBack }) {
  const sorted = Object.entries(draft.totals||{}).sort((a,b)=>b[1]-a[1]);
  const pts = draft.seasonPoints || computeSeasonPoints(draft.totals||{});

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      {draft.imageUrl && (
        <img src={draft.imageUrl} alt={draft.category}
          style={{ width:"100%", height:"auto", borderRadius:12, marginBottom:16, display:"block" }} />
      )}
      <h1 style={styles.pageTitle}>{draft.category}</h1>
      <div style={styles.draftMeta}>Season {draft.season} · Week {draft.week} · Final Results</div>

      {sorted.length >= 3 && (
        <div style={styles.podium}>
          {[sorted[1], sorted[0], sorted[2]].map((entry, pos) => {
            if (!entry) return null;
            const rank = pos===1?1:pos===0?2:3;
            const heights = [100,140,80];
            const ci = draft.drafters.indexOf(entry[0]);
            const dc = draft.drafterDetails?.[entry[0]]?.color || COLORS[ci%COLORS.length];
            return (
              <div key={entry[0]} style={{ ...styles.podiumCol, height:heights[pos], background:dc, justifyContent:"center", gap:4 }}>
                <div style={{ ...styles.podiumRank, fontSize:32 }}>{rank}</div>
                <div style={{ ...styles.podiumName, fontSize:12, wordBreak:"break-word" }}>{entry[0]}</div>
                <div style={{ ...styles.podiumScore, fontSize:11 }}>{entry[1]} pts</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rankings summary */}
      <div style={styles.card}>
        <div style={styles.label}>Final Rankings</div>
        {sorted.map(([drafter, total], i) => {
          const dc = draft.drafterDetails?.[drafter]?.color || COLORS[draft.drafters.indexOf(drafter)%COLORS.length];
          // For ties, find the first index with the same score
          const rank = sorted.findIndex(([,s]) => s === total) + 1;
          return (
            <div key={drafter} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #f0ede9" }}>
              <span style={{ ...styles.resultRank, color:rank===1?P.amber:rank===2?P.steel:rank===3?P.red:"#bbb", minWidth:32 }}>
                {rank}{getRankSuffix(rank)}
              </span>
              <div style={{ width:12, height:12, borderRadius:"50%", background:dc, flexShrink:0 }} />
              <span style={{ flex:1, fontWeight:700, color:P.navy }}>{drafter}</span>
              <span style={{ color:"#888", fontSize:12 }}>{total} pts</span>
              <span style={{ fontWeight:800, color:dc, fontSize:12 }}>+{pts[drafter]} season</span>
            </div>
          );
        })}
      </div>

      {/* Round-by-round draft table */}
      <div style={styles.card}>
        <div style={styles.label}>Draft Board — Round by Round</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr>
                <th style={{ ...styles.th, minWidth:60 }}>Round</th>
                {draft.drafters.map((d,i) => {
                  const dc = draft.drafterDetails?.[d]?.color || COLORS[i%COLORS.length];
                  return <th key={d} style={{ ...styles.th, color:dc, minWidth:100, textAlign:"center" }}>{d}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: draft.numPicks }, (_, round) => (
                <tr key={round} style={{ background: round%2===0 ? P.white : "#fafaf8" }}>
                  <td style={{ ...styles.td, fontWeight:700, color:P.navy, fontSize:11, textAlign:"center" }}>
                    R{round+1}
                  </td>
                  {draft.drafters.map((d,i) => {
                    const dc = draft.drafterDetails?.[d]?.color || COLORS[i%COLORS.length];
                    const pick = (draft.picks[d]||[])[round];
                    return (
                      <td key={d} style={{ ...styles.td, borderLeft:`2px solid ${dc}40`, paddingLeft:8, color: pick ? dc : "#ddd", fontWeight: pick ? 700 : 400 }}>
                        {pick || "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {Object.keys(draft.votes||{}).length > 0 && (
        <div style={styles.card}>
          <div style={styles.label}>Vote Breakdown</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>
                  <th style={styles.th}>Voter</th>
                  {draft.drafters.map(d => <th key={d} style={{ ...styles.th, textAlign:"center" }}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(draft.votes).map(([voter, votes]) => (
                  <tr key={voter}>
                    <td style={styles.td}>{voter}</td>
                    {draft.drafters.map(d => <td key={d} style={{ ...styles.td, textAlign:"center", color:votes[d]===1?P.amber:"inherit" }}>{votes[d] ?? "—"}</td>)}
                  </tr>
                ))}
                <tr>
                  <td style={{ ...styles.td, fontWeight:700 }}>Total</td>
                  {draft.drafters.map(d => <td key={d} style={{ ...styles.td, textAlign:"center", fontWeight:700, color:P.navy }}>{draft.totals[d] ?? "—"}</td>)}
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
function LeaderboardView({ drafts, onBack }) {
  const [season, setSeason] = useState(1);
  const [tab, setTab] = useState("standings");

  // For season 2+, build scores dynamically from completed drafts
  const buildDynamicScores = (s) => {
    const voted = drafts.filter(d => d.season === s && d.status === "voted");
    return voted.map(d => {
      const pts = d.seasonPoints || {};
      const scores = {};
      Object.entries(pts).forEach(([nickname, p]) => {
        // First try drafterDetails from this draft, then global ALIAS_MAP
        const realName = d.drafterDetails?.[nickname]?.realName
          || resolveName(nickname)
          || nickname;
        // Accumulate in case two nicknames map to same real name
        scores[realName] = (scores[realName] || 0) + p;
      });
      return { week: `W${d.week}: ${d.category}`, scores };
    });
  };
  const seasonScores = season === 1 ? SEASON1_SCORES : buildDynamicScores(season);
  const data = getLeaderboard(seasonScores);

  const wins = {};
  drafts.filter(d => d.season===season && d.status==="voted" && d.winner).forEach(d => {
    // Handle ties like "Cat & Scott"
    const names = d.winner.split(/\s*&\s*/);
    names.forEach(name => {
      const realName = resolveName(name.trim());
      wins[realName] = (wins[realName]||0) + 1;
    });
  });
  const winData = Object.entries(wins).sort((a,b)=>b[1]-a[1]);

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>Leaderboard</h1>

      {/* Season selector */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {[1,2].map(s => (
          <button key={s}
            style={{ ...styles.btnSmall, background:season===s?P.navy:P.white, color:season===s?P.white:P.navy }}
            onClick={()=>setSeason(s)}>
            Season {s}
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div style={{ display:"flex", marginBottom:20, border:`1px solid ${P.warmGrey}`, borderRadius:8, overflow:"hidden" }}>
        {[["standings","Point Standings"],["wins","Draft Wins"]].map(([key,label]) => (
          <button key={key}
            style={{ flex:1, padding:"10px 0", border:"none", background:tab===key?P.navy:P.white, color:tab===key?P.white:P.navy, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}
            onClick={()=>setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab==="standings" && (
        data.length === 0 ? (
          <div style={styles.card}><div style={{ color:"#aaa", textAlign:"center", padding:24 }}>No data for Season {season} yet.</div></div>
        ) : (
          <>
            <div style={styles.podium}>
              {[data[1],data[0],data[2]].filter(Boolean).map((entry,pos) => {
                const heights=[100,140,80];
                const bgColors=[P.steel,P.navy,P.red];
                // True rank accounting for ties
                const rank = data.findIndex(([,s]) => s.total === entry[1].total) + 1;
                return (
                  <div key={entry[0]} style={{ ...styles.podiumCol, height:heights[pos], background:bgColors[pos], justifyContent:"center", gap:4 }}>
                    <div style={{ ...styles.podiumRank, fontSize:32 }}>{rank}</div>
                    <div style={{ ...styles.podiumName, fontSize:13 }}>{resolveName(entry[0])}</div>
                    <div style={{ ...styles.podiumScore, fontSize:12 }}>{entry[1].total} pts</div>
                  </div>
                );
              })}
            </div>
            <div style={styles.card}>
              {data.map(([player,stats],i) => {
                const rank = data.findIndex(([,s]) => s.total === stats.total) + 1;
                return (
                <div key={player} style={{ ...styles.resultRow, marginBottom:12 }}>
                  <span style={{ ...styles.resultRank, minWidth:32, color:rank===1?P.amber:rank===2?P.steel:rank===3?P.red:"#bbb" }}>#{rank}</span>
                  <span style={{ flex:1, fontWeight:700, color:P.navy, fontSize:16 }}>{resolveName(player)}</span>
                  <span style={{ color:"#888", fontSize:13, marginRight:12 }}>avg {stats.avg}</span>
                  <span style={{ fontWeight:800, color:P.red, fontSize:18 }}>{stats.total}</span>
                </div>
              );})}
            </div>
            <div style={styles.card}>
              <div style={styles.label}>Week by Week</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Week</th>
                      {data.map(([p]) => <th key={p} style={styles.th}>{resolveName(p)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {seasonScores.map(({ week, scores }) => (
                      <tr key={week}>
                        <td style={{ ...styles.td, fontSize:11, color:"#888" }}>{week.replace("Week ","W")}</td>
                        {data.map(([p]) => {
                          const val = scores[p] ?? scores[resolveName(p)];
                          return (
                          <td key={p} style={{ ...styles.td, color:val===3?P.amber:val===2?P.navy:val===1?P.steel:"#ccc" }}>
                            {val ?? "—"}
                          </td>
                        );})}
                      </tr>
                    ))}
                    <tr>
                      <td style={{ ...styles.td, fontWeight:700 }}>Total</td>
                      {data.map(([p,s]) => <td key={p} style={{ ...styles.td, fontWeight:700, color:P.red }}>{s.total}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      )}

      {tab==="wins" && (
        <div style={styles.card}>
          <div style={styles.label}>Draft Winners — Season {season}</div>
          {winData.length===0 ? (
            <div style={{ color:"#aaa", textAlign:"center", padding:24 }}>No wins recorded yet.</div>
          ) : (
            winData.map(([name,count],i) => (
              <div key={name} style={{ ...styles.resultRow, marginBottom:12 }}>
                <span style={{ ...styles.resultRank, minWidth:32, color:i===0?P.amber:i===1?P.steel:"#bbb" }}>#{i+1}</span>
                <span style={{ flex:1, fontWeight:700, color:P.navy, fontSize:15 }}>{name}</span>
                <span style={{ fontWeight:800, color:P.red, fontSize:18 }}>{count} {count===1?"win":"wins"}</span>
              </div>
            ))
          )}
          <div style={{ marginTop:20 }}>
            <div style={styles.label}>All Results</div>
            {drafts.filter(d=>d.season===season&&d.status==="voted").map(d => (
              <div key={d.id} style={{ ...styles.resultRow, marginBottom:8 }}>
                <span style={{ flex:1, fontSize:13, color:"#555" }}>W{d.week}: {d.category}</span>
                <span style={{ fontWeight:700, color:P.navy, fontSize:13 }}>🏆 {resolveName(d.winner)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryView({ drafts, onView, onVote, onDelete, isSuperAdmin, onEditSeason, onBack }) {
  const seasons = [...new Set(drafts.map(d=>+d.season))].sort((a,b)=>a-b);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [editingSeasonFor, setEditingSeasonFor] = useState(null);
  const [newSeasonVal, setNewSeasonVal] = useState("");
  const activeSeason = selectedSeason ?? seasons[0] ?? 1;
  const filtered = drafts.filter(d=>+d.season===+activeSeason);

  function handleSeasonEdit(draftId) {
    if (!newSeasonVal || isNaN(+newSeasonVal)) return;
    onEditSeason(draftId, +newSeasonVal);
    setEditingSeasonFor(null);
    setNewSeasonVal("");
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>Draft History</h1>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {seasons.map(s => (
          <button key={s}
            style={{ ...styles.btnSmall, background:+activeSeason===+s?P.navy:P.white, color:+activeSeason===+s?P.white:P.navy }}
            onClick={()=>setSelectedSeason(+s)}>
            Season {s}
          </button>
        ))}
      </div>
      {filtered.map((d,i) => {
        const sorted = Object.entries(d.totals||{}).sort((a,b)=>b[1]-a[1]);
        const winner = sorted[0];
        return (
          <div key={d.id} style={{ ...styles.draftCard, flexDirection:"column", gap:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, width:"100%" }}>
              <div style={{ ...styles.draftColorBar, background:COLORS[i%COLORS.length] }} />
              <div style={{ flex:1 }}>
                <div style={styles.draftName}>{d.category}</div>
                <div style={styles.draftMeta}>
                  S{d.season} W{d.week} · {d.drafters.length} drafters ·{" "}
                  {d.status==="voted"&&winner?`Winner: ${resolveName(winner[0])}`:d.status}
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                <button style={styles.btnSmall} onClick={()=>d.status==="voted"?onView(d):onVote(d)}>
                  {d.status==="voted"?"Results":"Vote"}
                </button>
                {isSuperAdmin && (
                  <button style={{ ...styles.btnSmall, fontSize:12, padding:"8px 10px" }}
                    onClick={()=>{ setEditingSeasonFor(d.id); setNewSeasonVal(String(d.season)); }}
                    title="Edit season">✏️</button>
                )}
                <button style={{ ...styles.btnSmall, borderColor:P.red, color:P.red, padding:"8px 10px" }}
                  onClick={()=>onDelete(d.id)} title="Delete draft">🗑</button>
              </div>
            </div>
            {isSuperAdmin && editingSeasonFor===d.id && (
              <div style={{ display:"flex", gap:8, alignItems:"center", paddingLeft:24, paddingBottom:4 }}>
                <span style={{ fontSize:12, color:"#888" }}>Move to season:</span>
                <input type="number" min="1" style={{ ...styles.input, width:70, marginBottom:0, padding:"6px 10px", fontSize:13 }}
                  value={newSeasonVal} onChange={e=>setNewSeasonVal(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSeasonEdit(d.id)} />
                <button style={{ ...styles.btnPrimary, padding:"6px 14px", fontSize:12 }} onClick={()=>handleSeasonEdit(d.id)}>Save</button>
                <button style={{ ...styles.btnSmall, padding:"6px 10px", fontSize:12 }} onClick={()=>setEditingSeasonFor(null)}>Cancel</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight:"100vh", background:P.bg,
    fontFamily:"'Segoe UI', system-ui, -apple-system, sans-serif",
    color:"#1a1a1a", position:"relative",
  },
  page: { maxWidth:760, margin:"0 auto", padding:"24px 20px 60px" },
  notification: {
    position:"fixed", top:16, left:"50%", transform:"translateX(-50%)",
    padding:"10px 24px", borderRadius:30, fontWeight:700, fontSize:14,
    color:"#fff", zIndex:9999,
  },
  hero: { textAlign:"center", padding:"56px 0 40px", display:"flex", flexDirection:"column", alignItems:"center", width:"100%" },
  heroTag: { display:"inline-block", background:P.navy, borderRadius:30, padding:"4px 16px", fontSize:11, letterSpacing:3, textTransform:"uppercase", color:P.sky, marginBottom:20 },
  heroTitle: { fontSize:52, fontWeight:900, lineHeight:1.1, margin:"0 0 12px", color:P.navy, letterSpacing:-2, textAlign:"center", width:"100%" },
  heroAccent: { color:P.red },
  heroSub: { color:"#6b6b6b", fontSize:16, marginBottom:32, textAlign:"center", maxWidth:500 },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:32 },
  navCard: { background:P.white, border:`1px solid ${P.warmGrey}`, borderRadius:12, padding:"20px 16px", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:4, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" },
  navIcon: { fontSize:24, marginBottom:4 },
  navLabel: { fontWeight:700, fontSize:15, color:P.navy },
  navSub: { fontSize:12, color:"#888" },
  section: { marginBottom:28 },
  sectionTitle: { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#999", marginBottom:12, fontWeight:600 },
  draftCard: { display:"flex", alignItems:"center", gap:12, background:P.white, border:`1px solid ${P.warmGrey}`, borderRadius:10, padding:"14px 16px", marginBottom:8, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" },
  draftColorBar: { width:4, height:40, borderRadius:2, flexShrink:0 },
  draftName: { fontWeight:700, fontSize:15, color:P.navy, marginBottom:2 },
  draftMeta: { fontSize:12, color:"#888" },
  card: { background:P.white, border:`1px solid ${P.warmGrey}`, borderRadius:14, padding:"20px 18px", marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" },
  label: { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#999", marginBottom:8, display:"block", fontWeight:600 },
  input: { width:"100%", background:P.bg, border:`1px solid ${P.warmGrey}`, borderRadius:8, padding:"10px 14px", color:"#1a1a1a", fontSize:14, outline:"none", marginBottom:14, boxSizing:"border-box", fontFamily:"inherit" },
  bigInput: { width:"100%", background:P.bg, border:`2px solid ${P.steel}`, borderRadius:10, padding:"14px 16px", color:"#1a1a1a", fontSize:18, outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
  row: { display:"flex", gap:10, alignItems:"flex-end", marginBottom:8 },
  drafterList: { display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 },
  drafterChip: { display:"flex", alignItems:"center", gap:6, background:"#F0EDE9", border:`1px solid ${P.warmGrey}`, borderRadius:20, padding:"4px 10px 4px 6px", fontSize:13, color:P.navy },
  chipDot: { width:10, height:10, borderRadius:"50%", display:"inline-block" },
  chipX: { background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:16, padding:0, lineHeight:1 },
  btnPrimary: { background:P.red, border:"none", borderRadius:8, padding:"12px 24px", fontWeight:700, fontSize:14, cursor:"pointer", color:P.white, fontFamily:"inherit" },
  btnSmall: { background:P.white, border:`1.5px solid ${P.navy}`, borderRadius:8, padding:"8px 16px", fontWeight:600, fontSize:13, cursor:"pointer", color:P.navy, fontFamily:"inherit" },
  backBtn: { background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:13, padding:"0 0 16px", fontFamily:"inherit" },
  pageTitle: { fontSize:32, fontWeight:900, color:P.navy, margin:"0 0 4px", letterSpacing:-1 },
  progressBar: { height:5, background:P.warmGrey, borderRadius:3, overflow:"hidden", marginBottom:8 },
  progressFill: { height:"100%", borderRadius:3, transition:"width 0.3s ease" },
  pickPrompt: { border:"2px solid", borderRadius:14, padding:"20px 18px", marginBottom:24, background:P.white },
  boardGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))", gap:12 },
  boardCard: { background:P.white, borderRadius:10, padding:"14px", borderTop:"3px solid", border:`1px solid ${P.warmGrey}`, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" },
  boardName: { fontWeight:800, fontSize:13, marginBottom:8, letterSpacing:1, textTransform:"uppercase" },
  pickItem: { display:"flex", alignItems:"flex-start", gap:6, fontSize:12, color:"#444", padding:"2px 0", borderBottom:"1px solid #f0ede9", textAlign:"left" },
  pickNum: { fontSize:11, color:"#bbb", minWidth:16, fontWeight:700 },
  voteRow: { display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f0ede9" },
  voteColorBar: { width:4, height:40, borderRadius:2, flexShrink:0 },
  voteDrafter: { fontWeight:700, color:P.navy, fontSize:15 },
  votePicksPreview: { fontSize:12, color:"#aaa", marginTop:2 },
  rankSelect: { width:64, background:P.bg, border:"2px solid", borderRadius:6, padding:"8px 4px", fontSize:16, fontWeight:700, textAlign:"center", fontFamily:"inherit", outline:"none", cursor:"pointer" },
  voteHint: { fontSize:12, color:"#aaa", marginBottom:12 },
  voterBadges: { display:"flex", flexWrap:"wrap", gap:6, marginBottom:12, marginTop:12 },
  voterBadge: { background:"rgba(29,49,105,0.08)", color:P.navy, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 },
  resultRow: { display:"flex", alignItems:"center", gap:8, marginBottom:8 },
  resultRank: { fontSize:13, fontWeight:700, minWidth:28, color:"#bbb" },
  resultBar: { height:6, borderRadius:3, flexShrink:0, transition:"width 0.5s ease" },
  resultName: { flex:1, color:P.navy, fontWeight:600, fontSize:14 },
  resultScore: { fontWeight:800, color:P.red },
  podium: { display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8, margin:"24px 0 16px", height:160 },
  podiumCol: { flex:1, minWidth:0, borderRadius:"8px 8px 0 0", display:"flex", flexDirection:"column", justifyContent:"flex-end", alignItems:"center", padding:"8px 6px 10px", overflow:"hidden" },
  podiumRank: { fontSize:28, fontWeight:900, color:"rgba(255,255,255,0.9)", lineHeight:1 },
  podiumName: { fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.95)", textAlign:"center", marginTop:4, wordBreak:"break-word", width:"100%" },
  podiumScore: { fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 },
  th: { textAlign:"left", padding:"6px 8px", fontSize:11, color:"#aaa", borderBottom:`1px solid ${P.warmGrey}`, fontWeight:600, letterSpacing:1 },
  td: { padding:"6px 8px", borderBottom:"1px solid #f0ede9", color:"#555" },
};

// ─── ANALYSIS ─────────────────────────────────────────────────────────────────
const DRAFT_TAGS = ["Food & Drink","Music","TV & Film","Pop Culture","Lifestyle","Work & Office","Sports","Animals","Abstract","Other"];

function AnalysisView({ drafts, onBack }) {
  const [season, setSeason] = useState("all");
  const [tag, setTag] = useState("all");
  const [drafter, setDrafter] = useState("all");

  const seasons = [...new Set(drafts.filter(d=>d.status==="voted").map(d=>d.season))].sort();
  const availTags = [...new Set(drafts.filter(d=>d.status==="voted"&&d.tag).map(d=>d.tag))].sort();

  const voted = drafts.filter(d =>
    d.status === "voted" &&
    (season === "all" || d.season === +season) &&
    (tag === "all" || d.tag === tag)
  );

  const allPlayers = [...new Set(
    voted.flatMap(draft => draft.drafters.map(nickname =>
      draft.drafterDetails?.[nickname]?.realName || resolveName(nickname) || nickname
    ))
  )].sort();

  const players = {};
  voted.forEach(draft => {
    const pts = draft.seasonPoints || {};
    const totals = draft.totals || {};
    const sorted = Object.entries(totals).sort((a,b)=>b[1]-a[1]);
    const topScore = sorted[0]?.[1];

    draft.drafters.forEach(nickname => {
      const realName = draft.drafterDetails?.[nickname]?.realName || resolveName(nickname) || nickname;
      if (drafter !== "all" && realName !== drafter) return;
      if (!players[realName]) players[realName] = { drafts:0, wins:0, seasonPts:0, best:null, finishes:[] };
      const p = players[realName];
      p.drafts++;
      p.seasonPts += pts[nickname] || 0;
      const voteTotal = totals[nickname] || 0;
      const finish = sorted.findIndex(([n])=>n===nickname)+1;
      p.finishes.push(finish);
      if (p.best===null||finish<p.best) p.best=finish;
      if (voteTotal===topScore) p.wins++;
    });
  });

  Object.values(players).forEach(p => {
    p.avgFinish = p.drafts ? +(p.finishes.reduce((a,b)=>a+b,0)/p.finishes.length).toFixed(1) : 0;
    p.winRate = p.drafts ? Math.round((p.wins/p.drafts)*100) : 0;
  });

  const data = Object.entries(players).sort((a,b)=>b[1].seasonPts-a[1].seasonPts);

  const stats = [
    { key:"seasonPts", label:"Season Points", color:P.red,   lower:false },
    { key:"wins",      label:"Draft Wins",    color:P.amber, lower:false },
    { key:"winRate",   label:"Win Rate",      color:P.navy,  lower:false, suffix:"%" },
    { key:"avgFinish", label:"Avg Finish",    color:P.cyan,  lower:true  },
  ];

  function BarChart({ statDef }) {
    const { key, label, color, lower, suffix } = statDef;
    const sorted = [...data].sort((a,b) => lower
      ? (+a[1][key]||99) - (+b[1][key]||99)
      : (+b[1][key]||0) - (+a[1][key]||0)
    );
    const vals = sorted.map(([,s]) => +s[key]||0);
    const maxVal = Math.max(...vals, 0.01);
    const minVal = lower ? Math.min(...vals) : 0;
    const range = maxVal - minVal || 1;
    const BAR_AREA = 140;
    const BAR_W = Math.max(28, Math.min(52, Math.floor(280 / sorted.length)));

    return (
      <div style={{ background:P.white, border:`1px solid ${P.warmGrey}`, borderRadius:14, padding:"16px 12px 12px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", overflow:"hidden" }}>
        <div style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color, fontWeight:700, marginBottom:12, textAlign:"center" }}>{label}</div>
        <div style={{ overflowX:"auto", overflowY:"hidden", WebkitOverflowScrolling:"touch" }}>
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:BAR_AREA, borderBottom:`2px solid ${P.warmGrey}`, minWidth: sorted.length * (BAR_W + 4), margin:"0 auto" }}>
            {sorted.map(([name, s], i) => {
              const val = +s[key] || 0;
              const pct = lower ? 1-(val-minVal)/range : (val-minVal)/range;
              const barH = Math.max(6, Math.round(pct * (BAR_AREA - 28)));
              const isBest = i === 0;
              return (
                <div key={name} style={{ width:BAR_W, flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:"100%", gap:2 }}>
                  <span style={{ fontSize:10, fontWeight:800, color:isBest?color:"#bbb" }}>{val}{suffix||""}</span>
                  <div style={{ width:"75%", height:barH, background:isBest?color:`${color}55`, borderRadius:"4px 4px 0 0" }} />
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:4, marginTop:6, minWidth: sorted.length * (BAR_W + 4) }}>
            {sorted.map(([name], i) => (
              <div key={name} style={{ width:BAR_W, flexShrink:0, textAlign:"center", fontSize:9, color:i===0?P.navy:"#aaa", fontWeight:i===0?700:400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {name.split(" ")[0].slice(0,8)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h1 style={styles.pageTitle}>Analysis</h1>

      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ ...styles.label, marginBottom:0 }}>Season</label>
          <select style={{ ...styles.input, marginBottom:0, width:130 }} value={season} onChange={e=>setSeason(e.target.value)}>
            <option value="all">All Seasons</option>
            {seasons.map(s=><option key={s} value={s}>Season {s}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ ...styles.label, marginBottom:0 }}>Tag</label>
          <select style={{ ...styles.input, marginBottom:0, width:150 }} value={tag} onChange={e=>setTag(e.target.value)}>
            <option value="all">All Tags</option>
            {availTags.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ ...styles.label, marginBottom:0 }}>Drafter</label>
          <select style={{ ...styles.input, marginBottom:0, width:150 }} value={drafter} onChange={e=>setDrafter(e.target.value)}>
            <option value="all">All Drafters</option>
            {allPlayers.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ fontSize:12, color:"#888", marginBottom:20 }}>{voted.length} draft{voted.length!==1?"s":""} · {data.length} player{data.length!==1?"s":""}</div>

      {data.length === 0 ? (
        <div style={styles.card}><div style={{ color:"#aaa", textAlign:"center", padding:24 }}>No data matches these filters.</div></div>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24, maxWidth:"100%" }}>
            {stats.map(s => <BarChart key={s.key} statDef={s} />)}
          </div>
          <div style={styles.card}>
            <div style={styles.label}>Full Stats Table</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr>
                    <th style={styles.th}>Player</th>
                    <th style={{ ...styles.th, textAlign:"center" }}>Drafts</th>
                    <th style={{ ...styles.th, textAlign:"center" }}>Wins</th>
                    <th style={{ ...styles.th, textAlign:"center" }}>Win %</th>
                    <th style={{ ...styles.th, textAlign:"center" }}>Season Pts</th>
                    <th style={{ ...styles.th, textAlign:"center" }}>Avg Finish</th>
                    <th style={{ ...styles.th, textAlign:"center" }}>Best</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(([name,s])=>(
                    <tr key={name}>
                      <td style={{ ...styles.td, fontWeight:700, color:P.navy }}>{name}</td>
                      <td style={{ ...styles.td, textAlign:"center" }}>{s.drafts}</td>
                      <td style={{ ...styles.td, textAlign:"center", color:P.amber, fontWeight:700 }}>{s.wins}</td>
                      <td style={{ ...styles.td, textAlign:"center" }}>{s.winRate}%</td>
                      <td style={{ ...styles.td, textAlign:"center", color:P.red, fontWeight:700 }}>{s.seasonPts}</td>
                      <td style={{ ...styles.td, textAlign:"center" }}>{s.avgFinish}</td>
                      <td style={{ ...styles.td, textAlign:"center", color:P.lime, fontWeight:700 }}>{s.best??"-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}