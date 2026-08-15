import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard"; import { snapshot } from "../core/snapshot";
export default {name:Events.GuildRoleDelete,once:false,async execute(role:any){
 const x=await guard.actor(role.guild,AuditLogEvent.RoleDelete,role.id);if(!x)return;
 const ban=await guard.ban(role.guild,x.member.id,"Role Delete",role.id);
 const restored=await snapshot.restoreRole(role.guild,role.id);
 await guard.report(role.guild,"🚨 Anti Role Delete",`Rol: **${role.name}**\nSaldırgan: <@${x.member.id}>\nBan: ${ban?"✅":"❌"}\nRestore: ${restored?"✅":"❌"}`);
} };
