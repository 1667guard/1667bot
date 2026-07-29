import { AuditLogEvent, Channel, Events } from 'discord.js';
import { getExecutor } from '../utils/audit';
import { punishMember } from '../utils/punish';
import { guardLog } from '../utils/log';
import { config } from '../config/config';

export default {
  name: Events.ChannelDelete,
  once: false,
  async execute(channel: Channel) {
    if (!('guild' in channel)) return;

    const executor = await getExecutor(channel.guild, AuditLogEvent.ChannelDelete);
    if (!executor || executor.id === config.ownerId) return;

    const banned = await punishMember(channel.guild, executor.id, 'Guard: Kanal silme koruması');
    await guardLog(
      channel.client,
      '🚨 Kanal Silme Koruması',
      `Silinen kanal: **${channel.id}**\nİşlemi yapan: <@${executor.id}>\nCeza: ${banned ? 'Banlandı' : 'Banlanamadı'}`
    );
  },
};
