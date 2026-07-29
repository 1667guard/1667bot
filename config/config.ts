import 'dotenv/config';

export const config = {
  token: process.env.DISCORD_TOKEN || '',
  ownerId: process.env.OWNER_ID || '',
  logChannelId: process.env.LOG_CHANNEL_ID || '',
  guildId: process.env.GUILD_ID || '',
};
