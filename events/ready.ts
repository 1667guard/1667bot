import { Client, Events } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { guardLog } from '../utils/log';

const AFK_CHANNEL_ID = '1511779616992526420';

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client: Client) {
    console.log(`Guard aktif: ${client.user?.tag}`);

    try {
      const channel = await client.channels.fetch(AFK_CHANNEL_ID);

      if (!channel || !channel.isVoiceBased()) {
        console.log('AFK ses kanalı bulunamadı veya ses kanalı değil.');
      } else {
        joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
          selfDeaf: true,
          selfMute: true,
        });

        console.log('Guard bot AFK ses kanalına bağlandı.');
      }
    } catch (err) {
      console.log('AFK ses bağlantı hatası:', err);
    }

    try {
      await guardLog(
        client,
        '🛡️ Guard Aktif',
        `${client.user?.tag} başarıyla çalıştı.`,
        0x00ff00
      );
    } catch (err) {
      console.log('Guard log gönderilemedi:', err);
    }
  },
};