"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const db_1 = require("../utils/db");
exports.data = new discord_js_1.SlashCommandBuilder().setName("guard").setDescription("Guard aç/kapat")
    .addSubcommand(s => s.setName("on").setDescription("Guardı aç"))
    .addSubcommand(s => s.setName("off").setDescription("Guardı kapat"))
    .addSubcommand(s => s.setName("status").setDescription("Durum"));
async function execute(i) {
    if (i.user.id !== i.guild?.ownerId)
        return i.reply({ content: "Sadece sunucu sahibi.", ephemeral: true });
    const sub = i.options.getSubcommand();
    if (sub === "on")
        (0, db_1.setSetting)(i.guild.id, "enabled", 1);
    if (sub === "off")
        (0, db_1.setSetting)(i.guild.id, "enabled", 0);
    await i.reply(`🛡️ Guard: **${sub === "status" ? (Number((0, db_1.setting)(i.guild.id)?.enabled ?? 1) ? "AÇIK" : "KAPALI") : sub.toUpperCase()}**`);
}
