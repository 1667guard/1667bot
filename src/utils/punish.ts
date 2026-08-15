import { Guild, GuildMember } from "discord.js";
import { config } from "../config/config";

export async function banExecutor(guild:Guild,id:string,reason:string) {
  if(!id || id===config.ownerId || id===guild.ownerId) return false;
  const m=await guild.members.fetch(id).catch(()=>null) as GuildMember|null;
  if(!m || !m.bannable) return false;
  return !!(await m.ban({reason}).then(()=>true).catch(()=>false));
}
export async function jailExecutor(guild:Guild,id:string,roleId:string,reason:string) {
  if(!id || id===config.ownerId || id===guild.ownerId || !roleId) return false;
  const m=await guild.members.fetch(id).catch(()=>null) as GuildMember|null;
  if(!m || !m.manageable) return false;
  const roles=m.roles.cache.filter(r=>r.id!==guild.id && r.id!==roleId);
  await m.roles.remove(roles,reason).catch(()=>null);
  return !!(await m.roles.add(roleId,reason).then(()=>true).catch(()=>false));
}
