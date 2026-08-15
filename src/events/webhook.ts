import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard";
export default {name:Events.WebhooksUpdate,once:false,async execute(channel:any){
 if(!channel.guild)return;
 for(const type of [AuditLogEvent.WebhookCreate,AuditLogEvent.WebhookUpdate,AuditLogEvent.WebhookDelete]){
  const x=await guard.actor(channel.guild,type,undefined,5000); if(!x)continue;
  const hooks=await channel.fetchWebhooks().catch(()=>null);
  if(hooks) for(const h of hooks.values()) {
   if(h.owner?.id===x.member.id) await h.delete("Guard: webhook rollback").catch(()=>null);
  }
  const punished=await guard.ban(channel.guild,x.member.id,"Anti Webhook",channel.id);
  await guard.report(channel.guild,"🚨 Anti Webhook",`Kanal: <#${channel.id}>\nİşlemi yapan: <@${x.member.id}>\nCeza: ${punished?"Ban":"Başarısız"}`);
  break;
 }
} };
