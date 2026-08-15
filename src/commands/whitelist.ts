import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { addWhitelistUser,removeWhitelistUser,addWhitelistRole,removeWhitelistRole } from "../utils/db";
export const data=new SlashCommandBuilder().setName("whitelist").setDescription("Whitelist yönet")
 .addSubcommand(s=>s.setName("user-add").setDescription("Kullanıcı ekle").addUserOption(o=>o.setName("user").setDescription("Kullanıcı").setRequired(true)))
 .addSubcommand(s=>s.setName("user-remove").setDescription("Kullanıcı çıkar").addUserOption(o=>o.setName("user").setDescription("Kullanıcı").setRequired(true)))
 .addSubcommand(s=>s.setName("role-add").setDescription("Rol ekle").addRoleOption(o=>o.setName("role").setDescription("Rol").setRequired(true)))
 .addSubcommand(s=>s.setName("role-remove").setDescription("Rol çıkar").addRoleOption(o=>o.setName("role").setDescription("Rol").setRequired(true)));
export async function execute(i:ChatInputCommandInteraction){
 if(i.user.id!==i.guild?.ownerId)return i.reply({content:"Sadece sunucu sahibi.",ephemeral:true});
 const s=i.options.getSubcommand(),u=i.options.getUser("user"),r=i.options.getRole("role");
 if(s==="user-add")addWhitelistUser(i.guild!.id,u!.id);
 if(s==="user-remove")removeWhitelistUser(i.guild!.id,u!.id);
 if(s==="role-add")addWhitelistRole(i.guild!.id,r!.id);
 if(s==="role-remove")removeWhitelistRole(i.guild!.id,r!.id);
 await i.reply({content:"✅ Whitelist güncellendi.",ephemeral:true});
}