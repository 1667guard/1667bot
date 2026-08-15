"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
const snapshot_1 = require("../core/snapshot");
exports.default = { name: discord_js_1.Events.ChannelDelete, once: false, async execute(channel) {
        if (!channel.guild || !guard_1.guard.enabled(channel.guild))
            return;
        const x = await guard_1.guard.actor(channel.guild, discord_js_1.AuditLogEvent.ChannelDelete, channel.id);
        if (!x)
            return;
        const ban = await guard_1.guard.ban(channel.guild, x.member.id, "Channel Delete", channel.id);
        const restored = await snapshot_1.snapshot.restoreChannel(channel.guild, channel.id);
        await guard_1.guard.report(channel.guild, "🚨 Anti Channel Delete", `Kanal: **${channel.name}**\nSaldırgan: <@${x.member.id}>\nBan: ${ban ? "✅" : "❌"}\nYeniden oluşturma: ${restored ? "✅" : "❌"}`);
    } };
