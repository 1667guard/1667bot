import { Events, Message } from 'discord.js';
import { guardLog } from '../utils/log';
import { config } from '../config/config';

const mentionLimits = new Map<string, number[]>();

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (!message.guild || message.author.bot) return;
    if (message.author.id === config.ownerId) return;

    const hasEveryone = message.content.includes('@everyone') || message.content.includes('@here');
    if (!hasEveryone) return;

    const now = Date.now();
    const list = (mentionLimits.get(message.author.id) || []).filter(time => now - time < 10000);
    list.push(now);
    mentionLimits.set(message.author.id, list);

    if (list.length >= 3) {
      const member = await message.guild.members.fetch(message.author.id).catch(() => null);
      await member?.timeout(10 * 60 * 1000, 'Guard: Everyone spam koruması').catch(() => null);
      await message.delete().catch(() => null);

      await guardLog(
        message.client,
        '🚨 Everyone Spam Koruması',
        `Kullanıcı: <@${message.author.id}>\n10 dakika timeout atıldı.`
      );
    }
  },
};
