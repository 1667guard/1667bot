import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { config } from '../config/config';

export async function guardLog(client: Client, title: string, description: string, color = 0xff0000) {
  if (!config.logChannelId) return;

  const channel = await client.channels.fetch(config.logChannelId).catch(() => null);
  if (!channel || !(channel instanceof TextChannel)) return;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => null);
}
