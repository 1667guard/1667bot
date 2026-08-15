import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard";
export default {name:Events.GuildRoleCreate,once:false,async execute(role:any){
 const x=await guard.actor(role.guild,AuditLogEvent.RoleCreate,role.id);if(!x)return;
 await role.delete("Guard: unauthorized role create").catch(()=>null);
 const ban=await guard.ban(role.guild,x.member.id,"Role Create",role.id);
 await guard.report(role.guild,"🚨 Anti Role Create",`Rol: **${role.name}**\nSaldırgan: <@${x.member.id}>\nBan: ${ban?"✅":"❌"}`);
} };
