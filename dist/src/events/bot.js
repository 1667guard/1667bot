"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
exports.default = { name: discord_js_1.Events.GuildMemberAdd, once: false, async execute(member) {
        if (!member.user.bot)
            return;
        const x = await guard_1.guard.actor(member.guild, discord_js_1.AuditLogEvent.BotAdd, member.id);
        if (!x)
            return;
        await member.kick("Guard: unauthorized bot").catch(() => null);
        const punished = await guard_1.guard.ban(member.guild, x.member.id, "Anti Bot Add", member.id);
        await guard_1.guard.report(member.guild, "🚨 Anti Bot Add", `Bot: <@${member.id}>\nEkleyen: <@${x.member.id}>\nEkleyen banlandı: ${punished ? "✅" : "❌"}`);
    } };
