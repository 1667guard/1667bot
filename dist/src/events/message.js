"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
const limit_1 = require("../utils/limit");
exports.default = { name: discord_js_1.Events.MessageCreate, once: false, async execute(m) {
        if (!m.guild || m.author.bot)
            return;
        if (!guard_1.guard.enabled(m.guild))
            return;
        if (m.author.id === m.guild.ownerId)
            return;
        if (/@(everyone|here)\b/i.test(m.content)) {
            await m.delete().catch(() => null);
            const hit = limit_1.limits.hit(`mention:${m.guild.id}:${m.author.id}`, 10000, 3);
            if (hit.exceeded) {
                const member = await m.guild.members.fetch(m.author.id).catch(() => null);
                await member?.timeout(600000, "Guard: everyone/here spam").catch(() => null);
            }
            await guard_1.guard.report(m.guild, "🚨 Anti Everyone / Here", `Kullanıcı: <@${m.author.id}>\nSayım: ${hit.count}/3`);
        }
        const invites = (m.content.match(/discord\.gg\/[A-Za-z0-9-]+/gi) || []);
        if (invites.length) {
            const hit = limit_1.limits.hit(`invite:${m.guild.id}:${m.author.id}`, 15000, 3);
            if (hit.exceeded) {
                const member = await m.guild.members.fetch(m.author.id).catch(() => null);
                await m.delete().catch(() => null);
                const banned = await guard_1.guard.ban(m.guild, m.author.id, "Anti Invite Spam");
                await guard_1.guard.report(m.guild, "🚨 Anti Invite Spam", `Kullanıcı: <@${m.author.id}>\nCeza: ${banned ? "Ban" : "Başarısız"}`);
            }
        }
    } };
