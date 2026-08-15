import { Events } from "discord.js";
import { guard } from "../core/guard"; import { limits } from "../utils/limit";
export default {name:Events.MessageCreate,once:false,async execute(m:any){
 if(!m.guild||m.author.bot)return;
 if(!guard.enabled(m.guild))return;
 if(m.author.id===m.guild.ownerId)return;
 if(/@(everyone|here)\b/i.test(m.content)){
  await m.delete().catch(()=>null);
  const hit=limits.hit(`mention:${m.guild.id}:${m.author.id}`,10000,3);
  if(hit.exceeded){const member=await m.guild.members.fetch(m.author.id).catch(()=>null);await member?.timeout(600000,"Guard: everyone/here spam").catch(()=>null);}
  await guard.report(m.guild,"🚨 Anti Everyone / Here",`Kullanıcı: <@${m.author.id}>\nSayım: ${hit.count}/3`);
 }
 const invites=(m.content.match(/discord\.gg\/[A-Za-z0-9-]+/gi)||[]);
 if(invites.length){
  const hit=limits.hit(`invite:${m.guild.id}:${m.author.id}`,15000,3);
  if(hit.exceeded){
   const member=await m.guild.members.fetch(m.author.id).catch(()=>null);
   await m.delete().catch(()=>null);
   const banned=await guard.ban(m.guild,m.author.id,"Anti Invite Spam");
   await guard.report(m.guild,"🚨 Anti Invite Spam",`Kullanıcı: <@${m.author.id}>\nCeza: ${banned?"Ban":"Başarısız"}`);
  }
 }
} };
