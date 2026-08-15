import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard";
import { snapshot } from "../core/snapshot";
export default {name:Events.ChannelDelete,once:false,async execute(channel:any){
 if(!channel.guild||!guard.enabled(channel.guild))return;
 const x=await guard.actor(channel.guild,AuditLogEvent.ChannelDelete,channel.id); if(!x)return;
 const ban=await guard.ban(channel.guild,x.member.id,"Channel Delete",channel.id);
 const restored=await snapshot.restoreChannel(channel.guild,channel.id);
 await guard.report(channel.guild,"🚨 Anti Channel Delete",`Kanal: **${channel.name}**\nSaldırgan: <@${x.member.id}>\nBan: ${ban?"✅":"❌"}\nYeniden oluşturma: ${restored?"✅":"❌"}`);
} };
