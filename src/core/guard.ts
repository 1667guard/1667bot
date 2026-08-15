import { AuditLogEvent, Guild, GuildMember } from "discord.js";
import { executor } from "../utils/audit";
import { isWhitelisted } from "../utils/whitelist";
import { banExecutor, jailExecutor } from "../utils/punish";
import { recordIncident, setting } from "../utils/db";
import { log } from "../utils/log";
import { config } from "../config/config";

export class Guard {
  async actor(guild:Guild,type:AuditLogEvent,targetId?:string,maxAge?:number) {
    if(!this.enabled(guild)) return null;
    const e=await executor(guild,type,targetId,maxAge);
    if(!e?.executor) return null;
    if(e.executor.id===guild.client.user?.id) return null;
    const m=await guild.members.fetch(e.executor.id).catch(()=>null);
    if(!m || isWhitelisted(m)) return null;
    return {entry:e,member:m};
  }
  async ban(guild:Guild,id:string,action:string,targetId?:string) {
    const ok=await banExecutor(guild,id,`Guard: ${action}`);
    recordIncident(guild.id,action,id,targetId);
    return ok;
  }
  async jail(guild:Guild,id:string,action:string,targetId?:string) {
    const s=setting(guild.id);
    const role=s?.jail_role_id || config.jailRoleId;
    const ok=role ? await jailExecutor(guild,id,role,`Guard: ${action}`) : false;
    recordIncident(guild.id,action,id,targetId,{jailRole:role||null});
    return ok;
  }
  async report(guild:Guild,title:string,text:string,color=0xff3344) {
    await log(guild.client,title,text,color);
  }
  enabled(guild:Guild) { return Number(setting(guild.id)?.enabled ?? 1)===1; }
}
export const guard=new Guard();
