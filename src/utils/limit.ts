export class Limit {
  private m = new Map<string, number[]>();
  hit(key:string, windowMs:number, max:number) {
    const now=Date.now();
    const a=(this.m.get(key)??[]).filter(t=>now-t<windowMs);
    a.push(now); this.m.set(key,a);
    return { count:a.length, exceeded:a.length>=max };
  }
  reset(key:string){this.m.delete(key);}
}
export const limits = new Limit();
