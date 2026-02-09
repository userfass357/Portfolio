const KEY = 'rpg_planner_v1';

export function save(state){
  try{localStorage.setItem(KEY, JSON.stringify(state));}catch(e){console.warn('save failed',e)}
}

export function load(){
  try{const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null}catch(e){console.warn('load failed',e);return null}
}

export function clear(){
  localStorage.removeItem(KEY);
}
