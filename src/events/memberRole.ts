import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard";
export default {name:Events.GuildMemberUpdate,once:false,async execute(oldM:any,newM:any){
 const oldIds=new Set(oldM.roles.cache.keys()), newIds=new Set(newM.roles.cache.keys());
 const changed=oldIds.size!==newIds.size || [...oldIds].some(x=>!newIds.has(x)) || [...newIds].some(x=>!oldIds.has(x));
 if(!changed)return;
 const x=await guard.actor(newM.guild,AuditLogEvent.MemberRoleUpdate,newM.id);if(!x)return;
 const jail=await guard.jail(newM.guild,x.member.id,"Member Role Update",newM.id);
 await guard.report(newM.guild,"🚨 Anti Member Role Update",`Hedef: <@${newM.id}>\nİşlemi yapan: <@${x.member.id}>\nJail: ${jail?"✅":"❌"}`);
} };
