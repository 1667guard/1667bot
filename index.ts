import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config/config';
import * as fs from 'fs';
import * as path from 'path';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file)).default;
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
  console.log(`Event yüklendi: ${event.name}`);
}

if (!config.token) {
  console.error('DISCORD_TOKEN eksik!');
  process.exit(1);
}

client.login(config.token);
