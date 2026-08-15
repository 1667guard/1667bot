"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
const discord_js_1 = require("discord.js");
const config_1 = require("../config/config");
async function log(client, title, description, color = 0xff3344) {
    if (!config_1.config.logChannelId)
        return;
    const ch = await client.channels.fetch(config_1.config.logChannelId).catch(() => null);
    if (!(ch instanceof discord_js_1.TextChannel))
        return;
    const e = new discord_js_1.EmbedBuilder().setTitle(title).setDescription(description).setColor(color).setTimestamp();
    await ch.send({ embeds: [e] }).catch(() => null);
}
