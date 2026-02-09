export class Character {
  constructor(data = {}){
    this.name = data.name || '';
    this.level = data.level || 1;
    this.xp = data.xp || 0;
    this.avatar = data.avatar || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  getXpToNext(){
    return 100 * this.level;
  }

  addExperience(amount){
    this.xp += Number(amount||0);
    const events = {leveled:false,levelsGained:0};
    while(this.xp >= this.getXpToNext()){
      this.xp -= this.getXpToNext();
      this.level += 1;
      events.leveled = true;
      events.levelsGained += 1;
    }
    return events;
  }

  toJSON(){
    return {name:this.name,level:this.level,xp:this.xp,avatar:this.avatar,createdAt:this.createdAt};
  }
}
