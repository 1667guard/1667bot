"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
const db_1 = require("../utils/db");
const config_1 = require("../config/config");
exports.default = { name: discord_js_1.Events.GuildRoleUpdate, once: false, async execute(oldRole, newRole) {
        if (!(0, db_1.isSafeRole)(newRole.guild.id, newRole.id) && !config_1.config.envSafeRoles.includes(newRole.id))
            return;
        const x = await guard_1.guard.actor(newRole.guild, discord_js_1.AuditLogEvent.RoleUpdate, newRole.id);
        if (!x)
            return;
        await newRole.edit({ name: oldRole.name, color: oldRole.color, hoist: oldRole.hoist, mentionable: oldRole.mentionable, permissions: oldRole.permissions }, "Guard: role rollback").catch(() => null);
        await guard_1.guard.ban(newRole.guild, x.member.id, "Protected Role Update", newRole.id);
        await guard_1.guard.report(newRole.guild, "🚨 Anti Role Update", `Korunan rol geri alındı.\nRol: **${newRole.name}**\nSaldırgan: <@${x.member.id}>`);
    } };
