import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard"; import { config } from "../config/config"; import { isWhitelisted } from "../utils/whitelist";
export default {name:Events.GuildMemberAdd,once:false,async execute(member:any){
 if(!member.user.bot)return;
 if(member.id===member.guild.client.user.id)return;
 if(config.allowedBotIds.includes(member.id)||isWhitelisted(member))return;
 const x=await guard.actor(member.guild,AuditLogEvent.BotAdd,member.id);if(!x)return;
 await member.kick("Guard: yetkisiz bot").catch(()=>null);
 const punished=await guard.ban(member.guild,x.member.id,"Anti Bot Add",member.id);
 await guard.report(member.guild,"🚨 Anti Bot Add",`Bot: <@${member.id}>\nEkleyen: <@${x.member.id}>\nEkleyen banlandı: ${punished?"✅":"❌"}`);
} };
