import { AuditLogEvent, Events, Role } from 'discord.js';
import { getExecutor } from '../utils/audit';
import { punishMember } from '../utils/punish';
import { guardLog } from '../utils/log';
import { config } from '../config/config';

export default {
  name: Events.GuildRoleDelete,
  once: false,
  async execute(role: Role) {
    const executor = await getExecutor(role.guild, AuditLogEvent.RoleDelete);
    if (!executor || executor.id === config.ownerId) return;

    const banned = await punishMember(role.guild, executor.id, 'Guard: Rol silme koruması');
    await guardLog(
      role.client,
      '🚨 Rol Silme Koruması',
      `Silinen rol: **${role.name}**\nİşlemi yapan: <@${executor.id}>\nCeza: ${banned ? 'Banlandı' : 'Banlanamadı'}`
    );
  },
};
