"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
const limit_1 = require("../utils/limit");
exports.default = [
    { name: discord_js_1.Events.GuildBanAdd, once: false, async execute(ban) {
            const x = await guard_1.guard.actor(ban.guild, discord_js_1.AuditLogEvent.MemberBanAdd, ban.user.id);
            if (!x)
                return;
            const h = limit_1.limits.hit(`mass:${ban.guild.id}:${x.member.id}:ban`, 10000, 5);
            if (h.exceeded)
                await guard_1.guard.ban(ban.guild, x.member.id, "Mass ban");
        } },
    { name: discord_js_1.Events.GuildMemberRemove, once: false, async execute(member) {
            const x = await guard_1.guard.actor(member.guild, discord_js_1.AuditLogEvent.MemberKick, member.id, 6000);
            if (!x)
                return;
            const h = limit_1.limits.hit(`mass:${member.guild.id}:${x.member.id}:kick`, 10000, 5);
            if (h.exceeded)
                await guard_1.guard.ban(member.guild, x.member.id, "Mass kick");
        } },
    { name: discord_js_1.Events.ChannelDelete, once: false, async execute(channel) {
            if (!channel.guild)
                return;
            const x = await guard_1.guard.actor(channel.guild, discord_js_1.AuditLogEvent.ChannelDelete, channel.id);
            if (!x)
                return;
            const h = limit_1.limits.hit(`mass:${channel.guild.id}:${x.member.id}:channel-delete`, 10000, 3);
            if (h.exceeded)
                await guard_1.guard.ban(channel.guild, x.member.id, "Mass channel delete");
        } },
    { name: discord_js_1.Events.GuildRoleDelete, once: false, async execute(role) {
            const x = await guard_1.guard.actor(role.guild, discord_js_1.AuditLogEvent.RoleDelete, role.id);
            if (!x)
                return;
            const h = limit_1.limits.hit(`mass:${role.guild.id}:${x.member.id}:role-delete`, 10000, 3);
            if (h.exceeded)
                await guard_1.guard.ban(role.guild, x.member.id, "Mass role delete");
        } }
];
