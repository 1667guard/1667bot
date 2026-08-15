import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard"; import { snapshot } from "../core/snapshot"; import { config } from "../config/config"; import { isDbWhitelistUser } from "../utils/db";
export default {name:Events.GuildRoleCreate,once:false,async execute(role:any){
 if(config.envSafeRoles.includes(role.id)||isDbWhitelistUser(role.guild.id,role.guild.ownerId))return;
 const x=await guard.actor(role.guild,AuditLogEvent.RoleCreate,role.id);if(!x)return;
 await role.delete("Guard: unauthorized role create").catch(()=>null);
 const ban=await guard.ban(role.guild,x.member.id,"Role Create",role.id);
 await guard.report(role.guild,"🚨 Anti Role Create",`Rol: **${role.name}**\nSaldırgan: <@${x.member.id}>\nBan: ${ban?"✅":"❌"}`);
} };
