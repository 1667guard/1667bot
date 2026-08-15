import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard";
export default {name:Events.GuildMemberRemove,once:false,async execute(member:any){
 const x=await guard.actor(member.guild,AuditLogEvent.MemberKick,member.id,6000);if(!x)return;
 const punished=await guard.ban(member.guild,x.member.id,"Anti Kick",member.id);
 await guard.report(member.guild,"🚨 Anti Kick",`Kicklenen: <@${member.id}>\nYapan: <@${x.member.id}>\nYapan banlandı: ${punished?"✅":"❌"}`);
} };
