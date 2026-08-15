"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banExecutor = banExecutor;
exports.jailExecutor = jailExecutor;
const config_1 = require("../config/config");
async function banExecutor(guild, id, reason) {
    if (!id || id === config_1.config.ownerId || id === guild.ownerId)
        return false;
    const m = await guild.members.fetch(id).catch(() => null);
    if (!m || !m.bannable)
        return false;
    return !!(await m.ban({ reason }).then(() => true).catch(() => false));
}
async function jailExecutor(guild, id, roleId, reason) {
    if (!id || id === config_1.config.ownerId || id === guild.ownerId || !roleId)
        return false;
    const m = await guild.members.fetch(id).catch(() => null);
    if (!m || !m.manageable)
        return false;
    const roles = m.roles.cache.filter(r => r.id !== guild.id && r.id !== roleId);
    await m.roles.remove(roles, reason).catch(() => null);
    return !!(await m.roles.add(roleId, reason).then(() => true).catch(() => false));
}
