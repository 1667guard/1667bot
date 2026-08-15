import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { setSetting } from "../utils/db";
export const data=new SlashCommandBuilder().setName("jailrol").setDescription("Guard jail rolünü ayarla")
 .addRoleOption(o=>o.setName("role").setDescription("Jail rolü").setRequired(true));
export async function execute(i:ChatInputCommandInteraction){
 if(i.user.id!==i.guild?.ownerId)return i.reply({content:"Sadece sunucu sahibi.",ephemeral:true});
 const r=i.options.getRole("role")!;
 setSetting(i.guild!.id,"jail_role_id",r.id);
 await i.reply({content:`🔒 Jail rolü ${r} olarak ayarlandı.`,ephemeral:true});
}