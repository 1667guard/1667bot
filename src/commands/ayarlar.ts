import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { setting, setSetting, addSafeRole, removeSafeRole } from "../utils/db";
export const data=new SlashCommandBuilder().setName("ayarlar").setDescription("Guard ayarları")
 .addSubcommand(s=>s.setName("durum").setDescription("Guard durumunu göster"))
 .addSubcommand(s=>s.setName("aktif").setDescription("Guardı aç/kapat").addBooleanOption(o=>o.setName("deger").setDescription("Aktif").setRequired(true)))
 .addSubcommand(s=>s.setName("safe-role-add").setDescription("Güvenli rol ekle").addRoleOption(o=>o.setName("role").setDescription("Rol").setRequired(true)))
 .addSubcommand(s=>s.setName("safe-role-remove").setDescription("Güvenli rol çıkar").addRoleOption(o=>o.setName("role").setDescription("Rol").setRequired(true)));
export async function execute(i:ChatInputCommandInteraction){
 if(i.user.id!==i.guild?.ownerId)return i.reply({content:"Sadece sunucu sahibi.",ephemeral:true});
 const sub=i.options.getSubcommand(),g=i.guild!;
 if(sub==="aktif"){const v=i.options.getBoolean("deger",true);setSetting(g.id,"enabled",v?1:0);}
 if(sub==="safe-role-add")addSafeRole(g.id,i.options.getRole("role",true).id);
 if(sub==="safe-role-remove")removeSafeRole(g.id,i.options.getRole("role",true).id);
 const s=setting(g.id);
 await i.reply({content:`🛡️ Guard: **${Number(s?.enabled)?"Açık":"Kapalı"}**\n🔒 Jail: ${s?.jail_role_id?`<@&${s.jail_role_id}>`:"ayarlanmadı"}`,ephemeral:true});
}