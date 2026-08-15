"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
const snapshot_1 = require("../core/snapshot");
exports.default = { name: discord_js_1.Events.GuildUpdate, once: false, async execute(oldG, newG) {
        const x = await guard_1.guard.actor(newG, discord_js_1.AuditLogEvent.GuildUpdate, newG.id);
        if (!x)
            return;
        const e = x.entry;
        const changes = e.changes ?? [];
        await snapshot_1.snapshot.restoreGuild(newG, changes);
        const punished = await guard_1.guard.ban(newG, x.member.id, "Anti Guild Update", newG.id);
        await guard_1.guard.report(newG, "🚨 Anti Guild Update", `Sunucu ayarı değiştirildi ve geri alındı.\nSaldırgan: <@${x.member.id}>\nCeza: ${punished ? "Ban" : "Başarısız"}`);
    } };
