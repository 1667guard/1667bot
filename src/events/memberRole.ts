import { AuditLogEvent, Events } from "discord.js";
import { guard } from "../core/guard"; import { isSafeRoleChange } from "../utils/safeChange";
export default {name:Events.GuildMemberUpdate,once:false,async execute(oldM:any,newM:any){
 if(!guard.enabled(newM.guild))return;
 if(newM.id===newM.guild.client.user.id)return;
 const oldIds=new Set(oldM.roles.cache.keys()), newIds=new Set(newM.roles.cache.keys());
 const changed=oldIds.size!==newIds.size || [...oldIds].some(x=>!newIds.has(x)) || [...newIds].some(x=>!oldIds.has(x));
 if(!changed)return;
 if(isSafeRoleChange(newM.guild.id,newM.id))return;
 const x=await guard.actor(newM.guild,AuditLogEvent.MemberRoleUpdate,newM.id);if(!x)return;
 if(x.member.id===newM.guild.client.user.id)return;
 const banned=await guard.ban(newM.guild,x.member.id,"Yetkisiz rol değişimi",newM.id);
 await guard.report(newM.guild,"🚨 Anti Rol Değişimi",`Hedef: <@${newM.id}>\nİşlemi yapan: <@${x.member.id}>\nCeza: ${banned?"BANLANDI ✅":"Başarısız ❌"}\n\nKural: Rol değişimi **yalnızca** \`/rolver\` komutu ile yapılabilir.`);
} };
