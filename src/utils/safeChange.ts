const safe=new Map<string,number>();
export function markSafeRoleChange(guildId:string,userId:string){
  safe.set(`${guildId}:${userId}`,Date.now());
}
export function isSafeRoleChange(guildId:string,userId:string){
  const t=safe.get(`${guildId}:${userId}`);
  if(t && Date.now()-t<8000){ safe.delete(`${guildId}:${userId}`); return true; }
  return false;
}
