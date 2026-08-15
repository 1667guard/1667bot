"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
exports.default = { name: discord_js_1.Events.GuildMemberRemove, once: false, async execute(member) {
        const x = await guard_1.guard.actor(member.guild, discord_js_1.AuditLogEvent.MemberKick, member.id, 6000);
        if (!x)
            return;
        const punished = await guard_1.guard.ban(member.guild, x.member.id, "Anti Kick", member.id);
        await guard_1.guard.report(member.guild, "🚨 Anti Kick", `Kicklenen: <@${member.id}>\nYapan: <@${x.member.id}>\nYapan banlandı: ${punished ? "✅" : "❌"}`);
    } };
