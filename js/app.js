import { Character } from './character.js';
import { TaskManager, Task } from './tasks.js';
import * as storage from './storage.js';

const el = id=>document.getElementById(id);

let character = new Character();
let tasks = new TaskManager();

function saveState(){
  storage.save({character:character.toJSON(),tasks:tasks.toJSON()});
}

function loadState(){
  const data = storage.load();
  if(data){
    character = new Character(data.character||{});
    tasks = new TaskManager(data.tasks||[]);
  } else {
    character = new Character();
    tasks = new TaskManager();
  }
}

function renderCharacter(){
  el('charName').value = character.name;
  el('avatarImage').src = character.avatar || 'https://via.placeholder.com/96/8B5CF6/fff?text=:)';
  el('level').textContent = character.level;
  el('xpCurrent').textContent = character.xp;
  el('xpNeeded').textContent = character.getXpToNext();
  const pct = Math.round((character.xp / character.getXpToNext())*100);
  el('xpFill').style.width = Math.min(100,Math.max(0,pct)) + '%';
  el('createdAt').textContent = new Date(character.createdAt).toLocaleString();
}

function renderTasks(){
  const active = tasks.getActive();
  const done = tasks.getDone();
  const activeList = el('activeList');
  const doneList = el('doneList');
  activeList.innerHTML=''; doneList.innerHTML='';

  for(const t of active){
    const li = document.createElement('li');
    li.dataset.id = t.id;
    li.innerHTML = `<div>
      <label><input type="checkbox" class="chk"> <strong>${escapeHtml(t.title)}</strong>
      <div class="meta">${escapeHtml(t.description||'')} • ${t.xp} XP</div></label></div>
      <div><button class="del">❌</button></div>`;
    activeList.appendChild(li);
  }

  for(const t of done){
    const li = document.createElement('li');
    li.classList.add('doneItem');
    li.dataset.id = t.id;
    li.innerHTML = `<div>
      <label><input type="checkbox" class="chk" checked> <strong>${escapeHtml(t.title)}</strong>
      <div class="meta">${escapeHtml(t.description||'')} • ${t.xp} XP • ${new Date(t.doneAt).toLocaleString()}</div></label></div>
      <div><button class="del">❌</button></div>`;
    doneList.appendChild(li);
  }

  // attach handlers
  document.querySelectorAll('.list .chk').forEach(cb=>{
    cb.addEventListener('change', onToggleTask);
  });
  document.querySelectorAll('.list .del').forEach(b=>b.addEventListener('click', onDeleteTask));

  el('statsDone').textContent = tasks.getDone().length;
  el('statsXP').textContent = calculateTotalXP();
}

function escapeHtml(s){return String(s).replace(/[&<>"]+/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]||c));}

function calculateTotalXP(){
  return tasks.getDone().reduce((sum,t)=>sum + (Number(t.xp)||0),0);
}

function onToggleTask(e){
  const li = e.target.closest('li');
  const id = li.dataset.id;
  if(e.target.checked){
    const t = tasks.completeTask(id);
    if(t){
      const ev = character.addExperience(t.xp);
      renderCharacter();
      if(ev.leveled) showLevelUp(ev.levelsGained);
      flashXP(t.xp);
    }
  } else {
    tasks.uncompleteTask(id);
  }
  saveState();
  renderTasks();
}

function onDeleteTask(e){
  const li = e.target.closest('li');
  const id = li.dataset.id;
  tasks.removeTask(id);
  saveState();
  renderTasks();
}

function flashXP(xp){
  const notice = document.createElement('div');
  notice.textContent = `+${xp} XP`;
  notice.style.position='fixed';notice.style.right='16px';notice.style.top='80px';notice.style.background='rgba(0,0,0,0.6)';notice.style.padding='8px 12px';notice.style.borderRadius='8px';
  document.body.appendChild(notice);
  setTimeout(()=>notice.style.opacity='0',1400);
  setTimeout(()=>notice.remove(),2000);
}

function showLevelUp(levels){
  const elNotice = el('levelUpNotice');
  elNotice.classList.add('show');
  setTimeout(()=>elNotice.classList.remove('show'),1800);
}

function bindUI(){
  el('taskForm').addEventListener('submit', e=>{
    e.preventDefault();
    const title = el('taskTitle').value.trim();
    if(!title) return;
    const desc = el('taskDesc').value.trim();
    const diff = Number(document.querySelector('input[name="difficulty"]:checked').value);
    const t = new Task({title,description:desc,xp:diff});
    tasks.addTask(t);
    el('taskTitle').value='';el('taskDesc').value='';
    saveState();renderTasks();
  });

  el('charName').addEventListener('change', ()=>{character.name = el('charName').value.trim(); if(!character.createdAt) character.createdAt = new Date().toISOString(); saveState(); renderCharacter();});

  document.querySelectorAll('.avatar-options button').forEach(b=>{
    b.addEventListener('click', ()=>{
      const src = b.dataset.src; character.avatar = src; el('avatarImage').src = src; saveState();
    });
  });

  el('resetBtn').addEventListener('click', ()=>{
    if(confirm('Сбросить весь прогресс? Это действие необратимо.')){
      storage.clear(); location.reload();
    }
  });
}

function init(){
  loadState();
  bindUI();
  renderCharacter();
  renderTasks();
  // if no name set, focus input
  if(!character.name){ el('charName').focus(); }
}

init();
