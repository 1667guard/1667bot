"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
exports.default = { name: discord_js_1.Events.GuildBanAdd, once: false, async execute(ban) {
        const x = await guard_1.guard.actor(ban.guild, discord_js_1.AuditLogEvent.MemberBanAdd, ban.user.id);
        if (!x)
            return;
        await ban.guild.members.unban(ban.user.id, "Guard: unauthorized ban rollback").catch(() => null);
        const punished = await guard_1.guard.ban(ban.guild, x.member.id, "Anti Ban", ban.user.id);
        await guard_1.guard.report(ban.guild, "🚨 Anti Ban", `Banlanan: <@${ban.user.id}>\nSaldırgan: <@${x.member.id}>\nBan: ${punished ? "✅" : "❌"}\nBan geri açıldı: ✅`);
    } };
