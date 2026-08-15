import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard"; import { limits } from "../utils/limit";

export default [
 {name:Events.GuildBanAdd,once:false,async execute(ban:any){
  const x=await guard.actor(ban.guild,AuditLogEvent.MemberBanAdd,ban.user.id);if(!x)return;
  const h=limits.hit(`mass:${ban.guild.id}:${x.member.id}:ban`,10000,5);
  if(h.exceeded)await guard.ban(ban.guild,x.member.id,"Mass ban");
 }},
 {name:Events.GuildMemberRemove,once:false,async execute(member:any){
  const x=await guard.actor(member.guild,AuditLogEvent.MemberKick,member.id,6000);if(!x)return;
  const h=limits.hit(`mass:${member.guild.id}:${x.member.id}:kick`,10000,5);
  if(h.exceeded)await guard.ban(member.guild,x.member.id,"Mass kick");
 }},
 {name:Events.ChannelDelete,once:false,async execute(channel:any){
  if(!channel.guild)return;
  const x=await guard.actor(channel.guild,AuditLogEvent.ChannelDelete,channel.id);if(!x)return;
  const h=limits.hit(`mass:${channel.guild.id}:${x.member.id}:channel-delete`,10000,3);
  if(h.exceeded)await guard.ban(channel.guild,x.member.id,"Mass channel delete");
 }},
 {name:Events.GuildRoleDelete,once:false,async execute(role:any){
  const x=await guard.actor(role.guild,AuditLogEvent.RoleDelete,role.id);if(!x)return;
  const h=limits.hit(`mass:${role.guild.id}:${x.member.id}:role-delete`,10000,3);
  if(h.exceeded)await guard.ban(role.guild,x.member.id,"Mass role delete");
 }}
];
