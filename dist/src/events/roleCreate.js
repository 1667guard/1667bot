"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
exports.default = { name: discord_js_1.Events.GuildRoleCreate, once: false, async execute(role) {
        const x = await guard_1.guard.actor(role.guild, discord_js_1.AuditLogEvent.RoleCreate, role.id);
        if (!x)
            return;
        await role.delete("Guard: unauthorized role create").catch(() => null);
        const ban = await guard_1.guard.ban(role.guild, x.member.id, "Role Create", role.id);
        await guard_1.guard.report(role.guild, "🚨 Anti Role Create", `Rol: **${role.name}**\nSaldırgan: <@${x.member.id}>\nBan: ${ban ? "✅" : "❌"}`);
    } };
