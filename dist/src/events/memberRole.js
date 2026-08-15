"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
const safeChange_1 = require("../utils/safeChange");
exports.default = { name: discord_js_1.Events.GuildMemberUpdate, once: false, async execute(oldM, newM) {
        if (!guard_1.guard.enabled(newM.guild))
            return;
        if (newM.id === newM.guild.client.user.id)
            return;
        const oldIds = new Set(oldM.roles.cache.keys()), newIds = new Set(newM.roles.cache.keys());
        const changed = oldIds.size !== newIds.size || [...oldIds].some(x => !newIds.has(x)) || [...newIds].some(x => !oldIds.has(x));
        if (!changed)
            return;
        if ((0, safeChange_1.isSafeRoleChange)(newM.guild.id, newM.id))
            return;
        const x = await guard_1.guard.actor(newM.guild, discord_js_1.AuditLogEvent.MemberRoleUpdate, newM.id);
        if (!x)
            return;
        if (x.member.id === newM.guild.client.user.id)
            return;
        const banned = await guard_1.guard.ban(newM.guild, x.member.id, "Yetkisiz rol değişimi", newM.id);
        await guard_1.guard.report(newM.guild, "🚨 Anti Rol Değişimi", `Hedef: <@${newM.id}>\nİşlemi yapan: <@${x.member.id}>\nCeza: ${banned ? "BANLANDI ✅" : "Başarısız ❌"}\n\nKural: Rol değişimi **yalnızca** \`/rolver\` komutu ile yapılabilir.`);
    } };
