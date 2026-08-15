import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard";
export default {name:Events.GuildBanAdd,once:false,async execute(ban:any){
 const x=await guard.actor(ban.guild,AuditLogEvent.MemberBanAdd,ban.user.id);if(!x)return;
 await ban.guild.members.unban(ban.user.id,"Guard: unauthorized ban rollback").catch(()=>null);
 const punished=await guard.ban(ban.guild,x.member.id,"Anti Ban",ban.user.id);
 await guard.report(ban.guild,"🚨 Anti Ban",`Banlanan: <@${ban.user.id}>\nSaldırgan: <@${x.member.id}>\nBan: ${punished?"✅":"❌"}\nBan geri açıldı: ✅`);
} };
