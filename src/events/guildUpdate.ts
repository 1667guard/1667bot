import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard"; import { snapshot } from "../core/snapshot";
export default {name:Events.GuildUpdate,once:false,async execute(oldG:any,newG:any){
 const x=await guard.actor(newG,AuditLogEvent.GuildUpdate,newG.id);if(!x)return;
 const e=x.entry as any; const changes=e.changes??[];
 await snapshot.restoreGuild(newG,changes);
 const punished=await guard.ban(newG,x.member.id,"Anti Guild Update",newG.id);
 await guard.report(newG,"🚨 Anti Guild Update",`Sunucu ayarı değiştirildi ve geri alındı.\nSaldırgan: <@${x.member.id}>\nCeza: ${punished?"Ban":"Başarısız"}`);
} };
