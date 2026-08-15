"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = exports.Guard = void 0;
const audit_1 = require("../utils/audit");
const whitelist_1 = require("../utils/whitelist");
const punish_1 = require("../utils/punish");
const db_1 = require("../utils/db");
const log_1 = require("../utils/log");
const config_1 = require("../config/config");
class Guard {
    async actor(guild, type, targetId, maxAge) {
        if (!this.enabled(guild))
            return null;
        const e = await (0, audit_1.executor)(guild, type, targetId, maxAge);
        if (!e?.executor)
            return null;
        const m = await guild.members.fetch(e.executor.id).catch(() => null);
        if (!m || (0, whitelist_1.isWhitelisted)(m))
            return null;
        return { entry: e, member: m };
    }
    async ban(guild, id, action, targetId) {
        const ok = await (0, punish_1.banExecutor)(guild, id, `Guard: ${action}`);
        (0, db_1.recordIncident)(guild.id, action, id, targetId);
        return ok;
    }
    async jail(guild, id, action, targetId) {
        const s = (0, db_1.setting)(guild.id);
        const role = s?.jail_role_id || config_1.config.jailRoleId;
        const ok = role ? await (0, punish_1.jailExecutor)(guild, id, role, `Guard: ${action}`) : false;
        (0, db_1.recordIncident)(guild.id, action, id, targetId, { jailRole: role || null });
        return ok;
    }
    async report(guild, title, text, color = 0xff3344) {
        await (0, log_1.log)(guild.client, title, text, color);
    }
    enabled(guild) { return Number((0, db_1.setting)(guild.id)?.enabled ?? 1) === 1; }
}
exports.Guard = Guard;
exports.guard = new Guard();
