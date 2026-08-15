"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executor = executor;
async function executor(guild, type, targetId, maxAge = 12_000) {
    const logs = await guild.fetchAuditLogs({ type, limit: 20 }).catch(() => null);
    if (!logs)
        return null;
    const now = Date.now();
    for (const e of logs.entries.values()) {
        if (!e.executor)
            continue;
        if (now - e.createdTimestamp > maxAge)
            continue;
        const target = e.target?.id;
        if (targetId && target !== targetId)
            continue;
        return e;
    }
    return null;
}
