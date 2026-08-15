import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard";
export default {name:Events.GuildMemberAdd,once:false,async execute(member:any){
 if(!member.user.bot)return;
 const x=await guard.actor(member.guild,AuditLogEvent.BotAdd,member.id);if(!x)return;
 await member.kick("Guard: unauthorized bot").catch(()=>null);
 const punished=await guard.ban(member.guild,x.member.id,"Anti Bot Add",member.id);
 await guard.report(member.guild,"🚨 Anti Bot Add",`Bot: <@${member.id}>\nEkleyen: <@${x.member.id}>\nEkleyen banlandı: ${punished?"✅":"❌"}`);
} };
