import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard"; import { isSafeRole } from "../utils/db"; import { config } from "../config/config";
export default {name:Events.GuildRoleUpdate,once:false,async execute(oldRole:any,newRole:any){
 if(!isSafeRole(newRole.guild.id,newRole.id)&&!config.envSafeRoles.includes(newRole.id))return;
 const x=await guard.actor(newRole.guild,AuditLogEvent.RoleUpdate,newRole.id);if(!x)return;
 await newRole.edit({name:oldRole.name,color:oldRole.color,hoist:oldRole.hoist,mentionable:oldRole.mentionable,permissions:oldRole.permissions}, "Guard: role rollback").catch(()=>null);
 await guard.ban(newRole.guild,x.member.id,"Protected Role Update",newRole.id);
 await guard.report(newRole.guild,"🚨 Anti Role Update",`Korunan rol geri alındı.\nRol: **${newRole.name}**\nSaldırgan: <@${x.member.id}>`);
} };
