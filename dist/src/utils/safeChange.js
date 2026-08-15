"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markSafeRoleChange = markSafeRoleChange;
exports.isSafeRoleChange = isSafeRoleChange;
const safe = new Map();
function markSafeRoleChange(guildId, userId) {
    safe.set(`${guildId}:${userId}`, Date.now());
}
function isSafeRoleChange(guildId, userId) {
    const t = safe.get(`${guildId}:${userId}`);
    if (t && Date.now() - t < 8000) {
        safe.delete(`${guildId}:${userId}`);
        return true;
    }
    return false;
}
