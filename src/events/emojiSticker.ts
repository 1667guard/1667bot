import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard";
export default [
 {name:Events.GuildEmojiCreate,once:false,async execute(e:any){
   const x=await guard.actor(e.guild,AuditLogEvent.EmojiCreate,e.id);if(!x)return;
   await e.delete("Guard: unauthorized emoji").catch(()=>null);
   await guard.ban(e.guild,x.member.id,"Anti Emoji Create",e.id);
 }},
 {name:Events.GuildEmojiDelete,once:false,async execute(e:any){
   const x=await guard.actor(e.guild,AuditLogEvent.EmojiDelete,e.id);if(!x)return;
   if(e.imageURL() && e.name) await e.guild.emojis.create({attachment:e.imageURL(),name:e.name,reason:"Guard: emoji restore"}).catch(()=>null);
   await guard.ban(e.guild,x.member.id,"Anti Emoji Delete",e.id);
 }},
 {name:Events.GuildEmojiUpdate,once:false,async execute(oldE:any,newE:any){
   const x=await guard.actor(newE.guild,AuditLogEvent.EmojiUpdate,newE.id);if(!x)return;
   await newE.edit({name:oldE.name,reason:"Guard: emoji rollback"}).catch(()=>null);
   await guard.ban(newE.guild,x.member.id,"Anti Emoji Update",newE.id);
 }},
 {name:Events.GuildStickerCreate,once:false,async execute(s:any){
   const x=await guard.actor(s.guild,AuditLogEvent.StickerCreate,s.id);if(!x)return;
   await s.delete("Guard: unauthorized sticker").catch(()=>null);
   await guard.ban(s.guild,x.member.id,"Anti Sticker Create",s.id);
 }},
 {name:Events.GuildStickerDelete,once:false,async execute(s:any){
   const x=await guard.actor(s.guild,AuditLogEvent.StickerDelete,s.id);if(!x)return;
   await guard.ban(s.guild,x.member.id,"Anti Sticker Delete",s.id);
 }},
 {name:Events.GuildStickerUpdate,once:false,async execute(oldS:any,newS:any){
   const x=await guard.actor(newS.guild,AuditLogEvent.StickerUpdate,newS.id);if(!x)return;
   await newS.edit({name:oldS.name,description:oldS.description,tags:oldS.tags,reason:"Guard: sticker rollback"}).catch(()=>null);
   await guard.ban(newS.guild,x.member.id,"Anti Sticker Update",newS.id);
 }}
];