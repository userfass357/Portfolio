export class Task {
  constructor({id=null,title='',description='',xp=10,done=false,createdAt=null,doneAt=null} = {}){
    this.id = id || ('t_'+Date.now()+Math.random().toString(36).slice(2,6));
    this.title = title;
    this.description = description;
    this.xp = Number(xp)||0;
    this.done = !!done;
    this.createdAt = createdAt || new Date().toISOString();
    this.doneAt = doneAt || null;
  }
}

export class TaskManager{
  constructor(list=[]){
    this.tasks = (list||[]).map(t=> new Task(t));
  }

  addTask(task){
    const t = task instanceof Task ? task : new Task(task);
    this.tasks.unshift(t);
    return t;
  }

  removeTask(id){
    const idx = this.tasks.findIndex(t=>t.id===id);
    if(idx>-1) this.tasks.splice(idx,1);
  }

  completeTask(id){
    const t = this.tasks.find(x=>x.id===id);
    if(!t) return null;
    t.done = true;
    t.doneAt = new Date().toISOString();
    return t;
  }

  uncompleteTask(id){
    const t = this.tasks.find(x=>x.id===id);
    if(!t) return null;
    t.done = false;
    t.doneAt = null;
    return t;
  }

  getActive(){return this.tasks.filter(t=>!t.done)}
  getDone(){return this.tasks.filter(t=>t.done)}

  toJSON(){return this.tasks}
}
