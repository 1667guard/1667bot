import { Guild, GuildMember } from "discord.js";
import { config } from "../config/config";
import { isWhitelisted } from "./whitelist";

export async function banExecutor(guild:Guild,id:string,reason:string) {
  if(!id || id===config.ownerId || id===guild.ownerId || id===guild.client.user?.id) return false;
  const m=await guild.members.fetch(id).catch(()=>null) as GuildMember|null;
  if(!m || !m.bannable || isWhitelisted(m)) return false;
  return !!(await m.ban({reason}).then(()=>true).catch(()=>false));
}
export async function jailExecutor(guild:Guild,id:string,roleId:string,reason:string) {
  if(!id || id===config.ownerId || id===guild.ownerId || id===guild.client.user?.id || !roleId) return false;
  const m=await guild.members.fetch(id).catch(()=>null) as GuildMember|null;
  if(!m || !m.manageable) return false;
  const roles=m.roles.cache.filter(r=>r.id!==guild.id && r.id!==roleId);
  await m.roles.remove(roles,reason).catch(()=>null);
  return !!(await m.roles.add(roleId,reason).then(()=>true).catch(()=>false));
}
