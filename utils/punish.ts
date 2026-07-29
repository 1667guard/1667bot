import { Guild, GuildMember } from 'discord.js';
import { config } from '../config/config';

export async function punishMember(guild: Guild, userId: string, reason: string) {
  if (!userId || userId === config.ownerId) return false;

  const member: GuildMember | null = await guild.members.fetch(userId).catch(() => null);
  if (!member) return false;
  if (!member.bannable) return false;

  await member.ban({ reason }).catch(() => null);
  return true;
}
