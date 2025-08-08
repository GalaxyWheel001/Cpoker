export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (url.pathname === '/ws' && request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      const tableId = url.searchParams.get('tableId') || 'lobby';
      const id = env.TABLE_DO.idFromName(`table_${tableId}`);
      const stub = env.TABLE_DO.get(id);
      // Pass the upgraded request to DO; it will accept the server socket
      stub.fetch(request);
      return new Response(null, { status: 101, webSocket: client });
    }

    if (url.pathname === '/health') {
      return json({ ok: true }, env);
    }

    if (url.pathname === '/tests') {
      const cases = runEvalTests();
      return json({ ok: true, cases }, env);
    }

    // Create/configure table: POST /table { tableId?, isPrivate, password }
    if (url.pathname === '/table' && request.method === 'POST') {
      const body = await request.json().catch(()=>({}));
      const tableId = body.tableId || crypto.randomUUID().slice(0,8);
      const isPrivate = !!body.isPrivate;
      const password = isPrivate ? String(body.password || '') : '';
      const inviteToken = isPrivate ? crypto.randomUUID().replace(/-/g,'').slice(0,16) : '';
      const id = env.TABLE_DO.idFromName(`table_${tableId}`);
      const stub = env.TABLE_DO.get(id);
      const resp = await stub.fetch('https://internal/config', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'config', tableId, isPrivate, password, inviteToken }),
      });
      if (!resp.ok) return json({ ok:false }, env, 500);
      const wsBase = (env.WS_BASE || '').replace(/\/$/, '');
      const wsUrl = wsBase ? `${wsBase}/ws?tableId=${tableId}` : '';
      return json({ ok: true, tableId, isPrivate, inviteToken, wsUrl }, env);
    }

    // Recent hands: GET /hands?tableId=xxx&limit=20
    if (url.pathname === '/hands' && request.method === 'GET') {
      const tableId = url.searchParams.get('tableId');
      const limit = Math.min(parseInt(url.searchParams.get('limit')||'20',10), 100);
      if (!tableId) return json({ ok:false, error:'tableId required' }, env, 400);
      await ensureSchema(env);
      const stmt = env.DB.prepare('SELECT id, table_id, hand_id, created_at, community, winners FROM hands WHERE table_id = ? ORDER BY id DESC LIMIT ?');
      const res = await stmt.bind(tableId, limit).all();
      return json({ ok:true, rows: res.results || [] }, env);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders(env) });
  }
}

function corsHeaders(env){
  return {
    'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'content-type, authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  };
}

function json(obj, env, status=200){
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...corsHeaders(env) } });
}

async function ensureSchema(env){
  if (env.__SCHEMA_READY) return;
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS hands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_id TEXT,
      hand_id INTEGER,
      created_at INTEGER,
      community TEXT,
      winners TEXT
    );
  `);
  env.__SCHEMA_READY = true;
}

// Helper: cards and hand evaluation
const RANKS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
const SUITS = ['C','D','H','S'];
const RANK_VALUE = Object.fromEntries(RANKS.map((r,i)=>[r, i+2]));

function buildDeck() {
  const deck = [];
  for (const s of SUITS) for (const r of RANKS) deck.push(r + s);
  // Fisher-Yates with crypto
  for (let i = deck.length - 1; i > 0; i--) {
    const rand = new Uint32Array(1);
    crypto.getRandomValues(rand);
    const j = Number(rand[0] % (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function cardRank(card) { return RANK_VALUE[card[0]]; }
function cardSuit(card) { return card[1]; }

// Evaluate best 5-card hand from 7 cards. Returns tuple [category, tiebreakers...] higher is better.
// Categories: 8 SF, 7 Quads, 6 FullHouse, 5 Flush, 4 Straight, 3 Trips, 2 TwoPair, 1 Pair, 0 High
function evaluate7(cards7) {
  // Count ranks and suits
  const counts = new Map();
  const suitToCards = new Map();
  const ranks = [];
  for (const c of cards7) {
    const rv = cardRank(c);
    ranks.push(rv);
    counts.set(rv, (counts.get(rv)||0)+1);
    const s = cardSuit(c);
    if (!suitToCards.has(s)) suitToCards.set(s, []);
    suitToCards.get(s).push(c);
  }
  ranks.sort((a,b)=>b-a);

  // Flush
  let flushCards = null;
  for (const [,cards] of suitToCards) if (cards.length >= 5) flushCards = cards.map(c=>cardRank(c)).sort((a,b)=>b-a).slice(0,5);

  // Straight helper (with A-5)
  function bestStraight(values) {
    const uniq = Array.from(new Set(values)).sort((a,b)=>b-a);
    if (uniq.includes(14)) uniq.push(1);
    let run = 1, bestHigh = 0;
    for (let i=1;i<uniq.length;i++){
      if (uniq[i] === uniq[i-1]-1) {
        run++;
        if (run>=5) { bestHigh = Math.max(bestHigh, uniq[i-4]); }
      } else run=1;
    }
    return bestHigh ? bestHigh : null;
  }

  // Straight
  const straightHigh = bestStraight(ranks);

  // Straight Flush
  let sfHigh = null;
  if (flushCards) sfHigh = bestStraight(flushCards);
  if (sfHigh) return [8, sfHigh];

  // Quads / Trips / Pairs
  const groups = Array.from(counts.entries()).sort((a,b)=> (b[1]-a[1]) || (b[0]-a[0]));
  const quads = groups.find(g=>g[1]===4);
  const trips = groups.filter(g=>g[1]===3).map(g=>g[0]);
  const pairs = groups.filter(g=>g[1]===2).map(g=>g[0]);
  const singles = groups.filter(g=>g[1]===1).map(g=>g[0]);

  if (quads) {
    const kicker = Math.max(...[...trips, ...pairs, ...singles]);
    return [7, quads[0], kicker];
  }

  if (trips.length >= 2 || (trips.length>=1 && pairs.length>=1)) {
    const topTrip = trips[0];
    const topPair = trips.length>=2 ? trips[1] : pairs[0];
    return [6, topTrip, topPair];
  }

  if (flushCards) return [5, ...flushCards];
  if (straightHigh) return [4, straightHigh];

  if (trips.length>=1) {
    const kickers = [...pairs, ...singles].sort((a,b)=>b-a).slice(0,2);
    return [3, trips[0], ...kickers];
  }

  if (pairs.length>=2) {
    const top2 = pairs.sort((a,b)=>b-a).slice(0,2);
    const kicker = Math.max(...singles);
    return [2, ...top2, kicker];
  }

  if (pairs.length===1) {
    const kickers = singles.sort((a,b)=>b-a).slice(0,3);
    return [1, pairs[0], ...kickers];
  }

  const top5 = ranks.slice(0,5);
  return [0, ...top5];
}

function compareRanks(a,b){
  for (let i=0;i<Math.max(a.length,b.length);i++){
    const av=a[i]||0, bv=b[i]||0; if (av!==bv) return av-bv; 
  }
  return 0;
}

function humanCategory(cat){
  return {
    8: 'Straight Flush',
    7: 'Four of a Kind',
    6: 'Full House',
    5: 'Flush',
    4: 'Straight',
    3: 'Three of a Kind',
    2: 'Two Pair',
    1: 'One Pair',
    0: 'High Card',
  }[cat] || 'Unknown';
}

function runEvalTests(){
  const parse = (s)=> s.split(/\s+/).map(x=>x.toUpperCase().replace('10','T'));
  const cases = [
    { name: 'Royal Flush (Hearts)', cards: 'AH KH QH JH TH 2C 3D', expect: 'Straight Flush' },
    { name: 'Straight Flush 9-high', cards: '9H 8H 7H 6H 5H 2C 3D', expect: 'Straight Flush' },
    { name: 'Four of a Kind (Aces)', cards: 'AH AD AC AS 9D 3C 2S', expect: 'Four of a Kind' },
    { name: 'Full House (AAA KK)', cards: 'AH AD AC KH KD 3C 2S', expect: 'Full House' },
    { name: 'Flush (Hearts)', cards: 'AH 9H 7H 4H 2H KC 3D', expect: 'Flush' },
    { name: 'Straight (A-5 wheel)', cards: 'AH 2C 3D 4S 5H 9C KD', expect: 'Straight' },
    { name: 'Straight (T-A)', cards: 'AH KD QD JC TS 2C 3D', expect: 'Straight' },
    { name: 'Trips (QQQ)', cards: 'QH QD QS 9C 7D 3C 2S', expect: 'Three of a Kind' },
    { name: 'Two Pair (KK 99)', cards: 'KH KD 9C 9D 5S 3C 2S', expect: 'Two Pair' },
    { name: 'One Pair (JJ)', cards: 'JH JD 9C 7D 5S 3C 2S', expect: 'One Pair' },
    { name: 'High Card (A)', cards: 'AH 9D 7C 5S 3H 2C 4D', expect: 'High Card' },
  ];
  return cases.map(test => {
    const arr = parse(test.cards);
    const rank = evaluate7(arr);
    return {
      name: test.name,
      cards: arr,
      category: humanCategory(rank[0]),
      ok: humanCategory(rank[0]) === test.expect,
      detail: rank,
    };
  });
}

export class TableDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.clients = new Map(); // clientId -> { ws, playerId }
    this.table = this.initialTable();
  }

  initialTable(){
    return {
      id: null,
      players: [], // {id,name,avatar,seat,chips,status,currentBet,acted,hole:[]}
      community: [],
      pot: 0,
      phase: 'waiting',
      dealerSeat: -1,
      smallBlind: 25,
      bigBlind: 50,
      currentSeat: -1,
      currentMaxBet: 0,
      minRaise: 50,
      deck: [],
      handId: 0,
      winners: null,
      isPrivate: false,
      password: '',
      inviteTokens: new Set(),
      // turn timer
      turnTimeMs: 20000,
      turnDeadlineMs: 0,
      tableId: '',
    };
  }

  activePlayers(){ return this.table.players.filter(p=>p.status==='active' || p.status==='allin'); }
  canAct(p){ return p.status==='active'; }
  nextActiveSeat(from){
    const n = this.table.players.length; if (n===0) return -1;
    for (let i=1;i<=n;i++){
      const seat = (from + i) % n; const p = this.table.players[seat];
      if (p && this.canAct(p)) return seat;
    }
    return -1;
  }

  getPlayerById(id){ return this.table.players.find(p=>p.id===id); }

  async fetch(request) {
    if (request.headers.get('Upgrade') === 'websocket') {
      const [client, server] = Object.values(new WebSocketPair());
      await this.state.acceptWebSocket(server);
      return new Response(null, { status: 101, webSocket: client });
    }

    // Handle config via HTTP
    if (request.method === 'POST') {
      try {
        const data = await request.json();
        if (data.type === 'config') {
          this.table.isPrivate = !!data.isPrivate;
          this.table.password = this.table.isPrivate ? String(data.password||'') : '';
          if (this.table.isPrivate && data.inviteToken) this.table.inviteTokens.add(String(data.inviteToken));
          this.table.tableId = data.tableId || this.table.tableId;
          return new Response(JSON.stringify({ ok:true }), { headers: { 'content-type':'application/json' } });
        }
      } catch {}
    }

    return new Response('Not Found', { status:404 });
  }

  async alarm() {
    // Turn timer deadline reached: auto-action
    const now = Date.now();
    if (this.table.turnDeadlineMs && now >= this.table.turnDeadlineMs && this.table.phase !== 'waiting') {
      const curr = this.table.players[this.table.currentSeat];
      if (curr && this.canAct(curr)) {
        const toCall = Math.max(0, this.table.currentMaxBet - curr.currentBet);
        if (toCall > 0) this.applyAction(curr.id, 'fold', 0); else this.applyAction(curr.id, 'check', 0);
      }
    }
  }

  webSocketMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      const { type } = data;
      if (type === 'hello') {
        const clientId = data.clientId || crypto.randomUUID();
        if (!this.clients.has(clientId)) this.clients.set(clientId, { ws, playerId: null });
        ws.send(JSON.stringify({ type: 'welcome', clientId }));
        this.broadcastState();
        return;
      }
      if (type === 'join_table') {
        const { player, inviteToken, password } = data; // {id,name,avatar}
        // Access control for private tables
        if (this.table.isPrivate) {
          const passOk = password && password === this.table.password;
          const tokenOk = inviteToken && this.table.inviteTokens.has(String(inviteToken));
          if (!passOk && !tokenOk) {
            ws.send(JSON.stringify({ type:'error', message:'unauthorized' }));
            return;
          }
        }
        // Bind ws -> playerId
        for (const [cid, obj] of this.clients) if (obj.ws === ws) obj.playerId = player.id;
        if (!this.table.players.find(p => p.id === player.id)) {
          const seat = this.table.players.length;
          this.table.players.push({ id: player.id, name: player.name, avatar: player.avatar || '', seat, chips: 5000, status: 'active', currentBet: 0, acted: false, hole: [] });
        }
        this.broadcast({ type: 'player_joined', player });
        this.broadcastState();
        if (this.table.phase === 'waiting' && this.activePlayers().length >= 2) this.startHand();
        return;
      }
      if (type === 'leave_table') {
        const { playerId } = data;
        this.table.players = this.table.players.filter(p => p.id !== playerId);
        this.broadcast({ type: 'player_left', playerId });
        this.broadcastState();
        return;
      }
      if (type === 'start_hand') {
        this.startHand();
        return;
      }
      if (type === 'player_action') {
        const { action, amount = 0, playerId } = data;
        this.applyAction(playerId, action, Number(amount)||0);
        return;
      }
      if (type === 'chat') {
        let pid = null; for (const [,obj] of this.clients) if (obj.ws===ws) pid = obj.playerId;
        this.broadcast({ type: 'chat', message: data.message, playerId: pid, at: Date.now() });
        return;
      }
    } catch (e) {
      try { ws.send(JSON.stringify({ type: 'error', message: 'bad_message' })); } catch {}
    }
  }

  webSocketClose(ws) {
    // Optionally mark player disconnected
  }

  broadcast(payload) {
    const msg = JSON.stringify(payload);
    for (const [, { ws }] of this.clients) {
      try { ws.send(msg); } catch {}
    }
  }

  broadcastState() {
    // Prepare public-safe state (hide hole cards)
    const pubPlayers = this.table.players.map(p => ({
      id: p.id, name: p.name, avatar: p.avatar, seat: p.seat, chips: p.chips, status: p.status, currentBet: p.currentBet,
      cards: p.hole.length ? [{ hidden: true }, { hidden: true }] : [],
    }));
    const payload = {
      type: 'state',
      table: {
        players: pubPlayers,
        communityCards: this.table.community.map(code => this.cardToUi(code)),
        pot: this.table.pot,
        phase: this.table.phase,
        currentSeat: this.table.currentSeat,
        currentMaxBet: this.table.currentMaxBet,
        minRaise: this.table.minRaise,
        handId: this.table.handId,
        winners: this.table.winners,
        remainingMs: Math.max(0, this.table.turnDeadlineMs - Date.now()),
      }
    };
    this.broadcast(payload);

    // Send private hole cards per client
    for (const [, { ws, playerId }] of this.clients) {
      if (!playerId) continue;
      const p = this.getPlayerById(playerId);
      if (!p) continue;
      const hole = p.hole.map(code => this.cardToUi(code));
      try { ws.send(JSON.stringify({ type: 'hole_cards', cards: hole, playerId })); } catch {}
    }
  }

  cardToUi(code){
    const r = code[0]; const s = code[1];
    const suitMap = { 'H':'♥', 'D':'♦', 'C':'♣', 'S':'♠' };
    return { rank: r === 'T' ? '10' : r, suit: suitMap[s] };
  }

  setTurn(seat){
    this.table.currentSeat = seat;
    this.table.turnDeadlineMs = Date.now() + this.table.turnTimeMs;
    // schedule alarm for auto-action
    this.state.storage.setAlarm(new Date(this.table.turnDeadlineMs));
  }

  startHand() {
    if (this.activePlayers().length < 2) return;
    // Reset table for new hand
    this.table.community = [];
    this.table.pot = 0;
    this.table.phase = 'preflop';
    this.table.deck = buildDeck();
    this.table.handId += 1;
    this.table.currentMaxBet = 0;
    this.table.minRaise = this.table.bigBlind;
    this.table.winners = null;
    for (const p of this.table.players) { p.currentBet=0; p.acted=false; if (p.chips>0) p.status='active'; p.hole=[]; }

    // Rotate dealer
    const n = this.table.players.length;
    this.table.dealerSeat = (this.table.dealerSeat + 1 + n) % n;
    const sbSeat = this.nextActiveSeat(this.table.dealerSeat);
    const bbSeat = this.nextActiveSeat(sbSeat);

    // Deal two cards to active players
    for (let i=0;i<2;i++){
      for (let j=0;j<n;j++){
        const seat = (this.table.dealerSeat + 1 + j) % n;
        const p = this.table.players[seat];
        if (p && p.status==='active') p.hole.push(this.table.deck.pop());
      }
    }

    // Post blinds
    const sb = this.table.players[sbSeat];
    const bb = this.table.players[bbSeat];
    if (sb && sb.status==='active') {
      const post = Math.min(this.table.smallBlind, sb.chips);
      sb.chips -= post; sb.currentBet += post; this.table.pot += post;
      if (sb.chips===0) sb.status='allin';
    }
    if (bb && bb.status==='active') {
      const post = Math.min(this.table.bigBlind, bb.chips);
      bb.chips -= post; bb.currentBet += post; this.table.pot += post;
      if (bb.chips===0) bb.status='allin';
    }
    this.table.currentMaxBet = Math.max(sb?.currentBet||0, bb?.currentBet||0);

    // First to act preflop is left of BB
    this.setTurn(this.nextActiveSeat(bbSeat));
    for (const p of this.table.players) p.acted = (p.seat === bbSeat); // BB considered acted unless raised

    this.broadcastState();
  }

  applyAction(playerId, action, amount) {
    const player = this.getPlayerById(playerId);
    if (!player || !this.canAct(player)) return;
    if (this.table.players[this.table.currentSeat]?.id !== playerId) return; // Not player's turn

    const toCall = Math.max(0, this.table.currentMaxBet - player.currentBet);

    if (action === 'fold') {
      player.status = 'fold';
      player.acted = true;
      this.advanceTurnOrPhase(player.seat);
      return;
    }

    if (action === 'check') {
      if (toCall > 0) return; // cannot check
      player.acted = true;
      this.advanceTurnOrPhase(player.seat);
      return;
    }

    if (action === 'call') {
      const pay = Math.min(toCall, player.chips);
      player.chips -= pay; player.currentBet += pay; this.table.pot += pay;
      if (player.chips===0) player.status='allin';
      player.acted = true;
      this.advanceTurnOrPhase(player.seat);
      return;
    }

    if (action === 'raise') {
      // amount is raiseTo (total bet), require amount - currentMaxBet >= minRaise
      const raiseTo = Math.max(amount, this.table.currentMaxBet + this.table.minRaise);
      const need = Math.max(0, raiseTo - player.currentBet);
      const pay = Math.min(need, player.chips);
      if (pay <= 0) return;
      player.chips -= pay; player.currentBet += pay; this.table.pot += pay;
      if (player.chips===0) player.status='allin';
      const prevMax = this.table.currentMaxBet;
      this.table.currentMaxBet = Math.max(this.table.currentMaxBet, player.currentBet);
      this.table.minRaise = Math.max(this.table.minRaise, this.table.currentMaxBet - prevMax);
      // On raise, others must act again
      for (const p of this.table.players) if (this.canAct(p)) p.acted = (p.id === playerId);
      // Next turn
      this.setTurn(this.nextActiveSeat(player.seat));
      this.broadcastState();
      return;
    }
  }

  advanceTurnOrPhase(prevSeat) {
    const needAct = this.table.players.filter(p=>p.status==='active');
    const allMatched = needAct.every(p=>p.currentBet===this.table.currentMaxBet && p.acted);
    if (needAct.length===0) { this.endHandByFold(); return; }

    if (allMatched) {
      // Reset for next street
      for (const p of this.table.players) { p.currentBet = 0; p.acted = false; }
      this.table.currentMaxBet = 0; this.table.minRaise = this.table.bigBlind;

      if (this.table.phase === 'preflop') {
        this.dealCommunity(3); this.table.phase = 'flop';
      } else if (this.table.phase === 'flop') {
        this.dealCommunity(1); this.table.phase = 'turn';
      } else if (this.table.phase === 'turn') {
        this.dealCommunity(1); this.table.phase = 'river';
      } else if (this.table.phase === 'river') {
        this.showdown();
        return;
      }
      // First to act postflop is left of dealer
      this.setTurn(this.nextActiveSeat(this.table.dealerSeat));
      this.broadcastState();
      return;
    }

    // Otherwise move to next player
    const next = this.nextActiveSeat(prevSeat);
    this.setTurn(next);
    this.broadcastState();
  }

  dealCommunity(n){
    for (let i=0;i<n;i++) this.table.community.push(this.table.deck.pop());
  }

  endHandByFold(){
    const winner = this.table.players.find(p=>p.status!=='fold');
    if (winner) winner.chips += this.table.pot;
    this.table.winners = winner ? [{ playerId: winner.id, amount: this.table.pot }] : [];
    this.finalizeHand();
  }

  async finalizeHand(){
    const communityUi = this.table.community.map(c=>this.cardToUi(c));
    const winnersJson = JSON.stringify(this.table.winners || []);
    try {
      await ensureSchema(this.env);
      await this.env.DB.prepare('INSERT INTO hands (table_id, hand_id, created_at, community, winners) VALUES (?,?,?,?,?)')
        .bind(this.table.tableId || 'unknown', this.table.handId, Date.now(), JSON.stringify(communityUi), winnersJson)
        .run();
    } catch {}
    this.table.pot = 0;
    this.table.phase = 'waiting';
    this.broadcastState();
  }

  showdown(){
    // Side pots: use contributions snapshot from current street not tracked; simplified: single pot split
    const contenders = this.table.players.filter(p=>p.status!=='fold' && p.hole.length===2);
    const board = this.table.community;
    const scores = contenders.map(p=>({ p, rank: evaluate7([...p.hole, ...board]) }));
    scores.sort((a,b)=>compareRanks(a.rank,b.rank));
    const best = scores[scores.length-1]?.rank;
    const winners = scores.filter(s=>compareRanks(s.rank, best)===0).map(s=>s.p);
    const share = Math.floor(this.table.pot / Math.max(1,winners.length));
    for (const w of winners) w.chips += share;
    this.table.winners = winners.map(w=>({ playerId: w.id, amount: share, category: humanCategory(best[0]) }));
    this.finalizeHand();
  }
}
