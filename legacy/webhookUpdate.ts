import { AuditLogEvent, Events, GuildChannel } from 'discord.js';
import { getExecutor } from '../utils/audit';
import { punishMember } from '../utils/punish';
import { guardLog } from '../utils/log';
import { config } from '../config/config';

export default {
  name: Events.WebhooksUpdate,
  once: false,
  async execute(channel: GuildChannel) {
    const executor = await getExecutor(channel.guild, AuditLogEvent.WebhookCreate);
    if (!executor || executor.id === config.ownerId) return;

    const banned = await punishMember(channel.guild, executor.id, 'Guard: Webhook koruması');
    await guardLog(
      channel.client,
      '🚨 Webhook Koruması',
      `Kanal: <#${channel.id}>\nİşlemi yapan: <@${executor.id}>\nCeza: ${banned ? 'Banlandı' : 'Banlanamadı'}`
    );
  },
};
