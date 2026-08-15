import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard"; import { limits } from "../utils/limit";
const watched=[
 [Events.GuildBanAdd,AuditLogEvent.MemberBanAdd,"ban",5,10000],
 [Events.GuildMemberRemove,AuditLogEvent.MemberKick,"kick",5,10000],
 [Events.ChannelDelete,AuditLogEvent.ChannelDelete,"channel-delete",3,10000],
 [Events.GuildRoleDelete,AuditLogEvent.RoleDelete,"role-delete",3,10000]
] as const;
export function limitHandler(){ return async function(this:any,...args:any[]){
 const ev=this.eventName; const target=args[0]; const guild=target?.guild??target?.channel?.guild;
 if(!guild)return;
 const spec=watched.find(x=>x[0]===ev);if(!spec)return;
 const x=await guard.actor(guild,spec[1] as AuditLogEvent,target?.id);if(!x)return;
 const h=limits.hit(`mass:${guild.id}:${x.member.id}:${spec[2]}`,spec[4],spec[3]);
 if(h.exceeded)await guard.ban(guild,x.member.id,`Mass ${spec[2]}`);
};}
