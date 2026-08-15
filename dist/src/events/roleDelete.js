"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
const snapshot_1 = require("../core/snapshot");
exports.default = { name: discord_js_1.Events.GuildRoleDelete, once: false, async execute(role) {
        const x = await guard_1.guard.actor(role.guild, discord_js_1.AuditLogEvent.RoleDelete, role.id);
        if (!x)
            return;
        const ban = await guard_1.guard.ban(role.guild, x.member.id, "Role Delete", role.id);
        const restored = await snapshot_1.snapshot.restoreRole(role.guild, role.id);
        await guard_1.guard.report(role.guild, "🚨 Anti Role Delete", `Rol: **${role.name}**\nSaldırgan: <@${x.member.id}>\nBan: ${ban ? "✅" : "❌"}\nRestore: ${restored ? "✅" : "❌"}`);
    } };
