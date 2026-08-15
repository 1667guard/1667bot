import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { setSetting, setting } from "../utils/db";
export const data=new SlashCommandBuilder().setName("guard").setDescription("Guard aç/kapat")
 .addSubcommand(s=>s.setName("on").setDescription("Guardı aç"))
 .addSubcommand(s=>s.setName("off").setDescription("Guardı kapat"))
 .addSubcommand(s=>s.setName("status").setDescription("Durum"));
export async function execute(i:ChatInputCommandInteraction){
 if(i.user.id!==i.guild?.ownerId)return i.reply({content:"Sadece sunucu sahibi.",ephemeral:true});
 const sub=i.options.getSubcommand();
 if(sub==="on")setSetting(i.guild!.id,"enabled",1);
 if(sub==="off")setSetting(i.guild!.id,"enabled",0);
 await i.reply(`🛡️ Guard: **${sub==="status"?(Number(setting(i.guild!.id)?.enabled??1)?"AÇIK":"KAPALI"):sub.toUpperCase()}**`);
}