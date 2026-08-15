import { AuditLogEvent, Guild } from 'discord.js';

export async function getExecutor(guild: Guild, type: AuditLogEvent) {
  const logs = await guild.fetchAuditLogs({ type, limit: 1 }).catch(() => null);
  const entry = logs?.entries.first();
  return entry?.executor || null;
}
