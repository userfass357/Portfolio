// Общая навигация
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',e=>{
  const v = e.target.dataset.view;
  document.querySelectorAll('.view').forEach(s=>s.style.display='none');
  document.getElementById(v).style.display='block';
}));

/* ---------------- Reaction Game ---------------- */
(() => {
  const area = document.getElementById('react-area');
  const startBtn = document.getElementById('react-start');
  const resetBtn = document.getElementById('react-reset');
  const timerEl = document.getElementById('react-timer');
  const scoreEl = document.getElementById('react-score');
  const avgEl = document.getElementById('react-avg');

  let gameTimer = null, appearTimer = null, timeLeft = 30; 
  let appearTime = 0, hits = 0, times = [];
  let active = false;
  const btn = document.createElement('button'); btn.className='target'; btn.textContent='Click!';
  btn.style.display='none'; area.appendChild(btn);

  function randDelay(){return 1000 + Math.random()*4000}
  function randPos(){
    const pw = area.clientWidth - btn.offsetWidth; const ph = area.clientHeight - btn.offsetHeight;
    const x = Math.max(0, Math.floor(Math.random()*pw)); const y = Math.max(0, Math.floor(Math.random()*ph));
    btn.style.left = x + 'px'; btn.style.top = y + 'px';
  }

  function scheduleNext(){
    appearTimer = setTimeout(()=>{
      randPos(); btn.style.display='block'; appearTime = performance.now();
    }, randDelay());
  }

  btn.addEventListener('click', ()=>{
    if(!active || btn.style.display==='none') return;
    const diff = Math.round(performance.now() - appearTime);
    times.push(diff); hits++; scoreEl.textContent = hits; btn.style.display='none';
    scheduleNext();
  });

  function finish(){ active=false; clearTimeout(appearTimer); clearInterval(gameTimer); btn.style.display='none';
    timerEl.textContent = '0';
    if(times.length) avgEl.textContent = Math.round(times.reduce((a,b)=>a+b,0)/times.length);
    else avgEl.textContent = '—';
  }

  startBtn.addEventListener('click', ()=>{
    // reset
    hits=0; times=[]; scoreEl.textContent='0'; avgEl.textContent='—'; timeLeft=30; timerEl.textContent='30';
    active=true; clearTimeout(appearTimer); clearInterval(gameTimer); scheduleNext();
    gameTimer = setInterval(()=>{
      timeLeft--; timerEl.textContent = timeLeft;
      if(timeLeft<=0) finish();
    },1000);
  });

  resetBtn.addEventListener('click', ()=>{ clearTimeout(appearTimer); clearInterval(gameTimer); active=false; btn.style.display='none'; timeLeft=30; timerEl.textContent='30'; hits=0; times=[]; scoreEl.textContent='0'; avgEl.textContent='—'; });
})();

/* ---------------- Tic-Tac-Toe ---------------- */
(() => {
  const boardEl = document.getElementById('ttt-board');
  const resetBtn = document.getElementById('ttt-reset');
  const turnEl = document.getElementById('ttt-turn');
  const msgEl = document.getElementById('ttt-msg');
  const aiCheckbox = document.getElementById('ttt-ai');
  const scoreX = document.getElementById('score-x');
  const scoreO = document.getElementById('score-o');

  let board = Array(9).fill(''); let turn = 'X'; let active = true; let xWins=0, oWins=0;

  function render(){ boardEl.innerHTML=''; for(let i=0;i<9;i++){ const c = document.createElement('div'); c.className='ttt-cell'; c.dataset.idx=i; c.textContent = board[i]; c.addEventListener('click', onCell); boardEl.appendChild(c);} }

  function checkWinner(){
    const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(const [a,b,c] of wins){ if(board[a] && board[a]===board[b] && board[b]===board[c]) return board[a]; }
    if(board.every(v=>v)) return 'draw';
    return null;
  }

  function onCell(e){ const i = +e.currentTarget.dataset.idx; if(!active || board[i]) return; board[i]=turn; const res = checkWinner(); if(res){ handleResult(res); } else { turn = turn === 'X' ? 'O' : 'X'; turnEl.textContent=turn; if(aiCheckbox.checked && turn==='O') setTimeout(aiMove,300); } render(); }

  function handleResult(res){ active=false; if(res==='draw'){ msgEl.textContent='Ничья'; } else { msgEl.textContent = 'Выиграл ' + res; if(res==='X') xWins++; else oWins++; scoreX.textContent = xWins; scoreO.textContent = oWins; } }

  function aiMove(){ const free = board.map((v,i)=>v?null:i).filter(v=>v!==null); if(!free.length) return; const pick = free[Math.floor(Math.random()*free.length)]; board[pick]='O'; const res = checkWinner(); if(res) handleResult(res); else { turn='X'; turnEl.textContent='X'; } render(); }

  resetBtn.addEventListener('click', ()=>{ board = Array(9).fill(''); turn='X'; active=true; msgEl.textContent=''; turnEl.textContent='X'; render(); });
  render();
})();

/* ---------------- Maze ---------------- */
(() => {
  const mazeBoard = document.getElementById('maze-board');
  const resetBtn = document.getElementById('maze-reset');
  const timerEl = document.getElementById('maze-timer');
  const msgEl = document.getElementById('maze-msg');

  // simple fixed maze 10x10: 0-free,1-wall,2-start,3-exit
  const layout = [
    1,1,1,1,1,1,1,1,1,1,
    1,2,0,0,0,1,0,0,3,1,
    1,0,1,1,0,1,0,1,0,1,
    1,0,1,0,0,0,0,1,0,1,
    1,0,1,0,1,1,0,1,0,1,
    1,0,0,0,1,0,0,0,0,1,
    1,0,1,0,1,0,1,1,0,1,
    1,0,1,0,0,0,0,1,0,1,
    1,0,0,0,1,1,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1
  ];

  let playerPos = 0; let interval = null; let seconds=0; let running=false;

  function find(n){return layout.indexOf(n)}
  function render(){ mazeBoard.innerHTML=''; for(let i=0;i<100;i++){ const d = document.createElement('div'); d.className='maze-cell'; if(layout[i]===1) d.classList.add('wall'); if(i===playerPos) d.classList.add('player'); if(layout[i]===3) d.classList.add('exit'); mazeBoard.appendChild(d);} }

  function startTimer(){ seconds=0; timerEl.textContent='0'; clearInterval(interval); running=true; interval=setInterval(()=>{ seconds++; timerEl.textContent = seconds; },1000);} 
  function stopTimer(){ running=false; clearInterval(interval); }

  function reset(){ playerPos = find(2); msgEl.textContent=''; render(); stopTimer(); timerEl.textContent='0'; }

  document.addEventListener('keydown', (e)=>{
    if(!running) startTimer(); if(!playerPos && playerPos!==0) playerPos=find(2);
    const w = 10; let r = playerPos; if(e.key==='ArrowUp') r -= w; else if(e.key==='ArrowDown') r += w; else if(e.key==='ArrowLeft') r -=1; else if(e.key==='ArrowRight') r+=1; else return;
    if(layout[r]===1) return; playerPos = r; render(); if(layout[playerPos]===3){ stopTimer(); msgEl.textContent = 'Выход достигнут! Время: '+seconds+'s'; }
  });

  resetBtn.addEventListener('click', reset);
  // init
  playerPos = find(2); render();
})();
