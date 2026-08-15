"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const db_1 = require("../utils/db");
exports.data = new discord_js_1.SlashCommandBuilder().setName("jailrol").setDescription("Guard jail rolünü ayarla")
    .addRoleOption(o => o.setName("role").setDescription("Jail rolü").setRequired(true));
async function execute(i) {
    if (i.user.id !== i.guild?.ownerId)
        return i.reply({ content: "Sadece sunucu sahibi.", ephemeral: true });
    const r = i.options.getRole("role");
    (0, db_1.setSetting)(i.guild.id, "jail_role_id", r.id);
    await i.reply({ content: `🔒 Jail rolü ${r} olarak ayarlandı.`, ephemeral: true });
}
