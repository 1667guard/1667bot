"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const db_1 = require("../utils/db");
exports.data = new discord_js_1.SlashCommandBuilder().setName("whitelist").setDescription("Whitelist yönet")
    .addSubcommand(s => s.setName("user-add").setDescription("Kullanıcı ekle").addUserOption(o => o.setName("user").setDescription("Kullanıcı").setRequired(true)))
    .addSubcommand(s => s.setName("user-remove").setDescription("Kullanıcı çıkar").addUserOption(o => o.setName("user").setDescription("Kullanıcı").setRequired(true)))
    .addSubcommand(s => s.setName("role-add").setDescription("Rol ekle").addRoleOption(o => o.setName("role").setDescription("Rol").setRequired(true)))
    .addSubcommand(s => s.setName("role-remove").setDescription("Rol çıkar").addRoleOption(o => o.setName("role").setDescription("Rol").setRequired(true)));
async function execute(i) {
    if (i.user.id !== i.guild?.ownerId)
        return i.reply({ content: "Sadece sunucu sahibi.", ephemeral: true });
    const s = i.options.getSubcommand(), u = i.options.getUser("user"), r = i.options.getRole("role");
    if (s === "user-add")
        (0, db_1.addWhitelistUser)(i.guild.id, u.id);
    if (s === "user-remove")
        (0, db_1.removeWhitelistUser)(i.guild.id, u.id);
    if (s === "role-add")
        (0, db_1.addWhitelistRole)(i.guild.id, r.id);
    if (s === "role-remove")
        (0, db_1.removeWhitelistRole)(i.guild.id, r.id);
    await i.reply({ content: "✅ Whitelist güncellendi.", ephemeral: true });
}
