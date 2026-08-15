import { AuditLogEvent, Events, GuildMember } from 'discord.js';
import { getExecutor } from '../utils/audit';
import { punishMember } from '../utils/punish';
import { guardLog } from '../utils/log';
import { config } from '../config/config';

export default {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: GuildMember) {
    if (!member.user.bot) return;

    const executor = await getExecutor(member.guild, AuditLogEvent.BotAdd);
    if (!executor || executor.id === config.ownerId) return;

    await member.ban({ reason: 'Guard: İzinsiz bot ekleme' }).catch(() => null);
    const banned = await punishMember(member.guild, executor.id, 'Guard: İzinsiz bot ekleme');

    await guardLog(
      member.client,
      '🚨 Bot Ekleme Koruması',
      `Eklenen bot: <@${member.id}>\nEkleyen: <@${executor.id}>\nCeza: ${banned ? 'Ekleyen banlandı' : 'Ekleyen banlanamadı'}`
    );
  },
};
