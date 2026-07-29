import { AuditLogEvent, Events, GuildBan } from 'discord.js';
import { getExecutor } from '../utils/audit';
import { punishMember } from '../utils/punish';
import { guardLog } from '../utils/log';
import { config } from '../config/config';

const banLimits = new Map<string, number[]>();

export default {
  name: Events.GuildBanAdd,
  once: false,
  async execute(ban: GuildBan) {
    const executor = await getExecutor(ban.guild, AuditLogEvent.MemberBanAdd);
    if (!executor || executor.id === config.ownerId) return;

    const now = Date.now();
    const list = (banLimits.get(executor.id) || []).filter(time => now - time < 5000);
    list.push(now);
    banLimits.set(executor.id, list);

    if (list.length >= 3) {
      const banned = await punishMember(ban.guild, executor.id, 'Guard: 5 saniyede 3 ban koruması');
      await guardLog(
        ban.client,
        '🚨 Ban Limit Koruması',
        `İşlemi yapan: <@${executor.id}>\n5 saniyede ${list.length} ban attı.\nCeza: ${banned ? 'Banlandı' : 'Banlanamadı'}`
      );
    }
  },
};
