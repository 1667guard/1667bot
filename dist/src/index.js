"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("./config/config");
const snapshot_1 = require("./core/snapshot");
const db_1 = require("./utils/db");
const log_1 = require("./utils/log");
const db_2 = require("./utils/db");
if (!config_1.config.token) {
    console.error("DISCORD_TOKEN eksik");
    process.exit(1);
}
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildModeration,
        discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.GuildWebhooks
    ],
    partials: [discord_js_1.Partials.Channel]
});
const commands = new discord_js_1.Collection();
const commandData = [];
for (const f of node_fs_1.default.readdirSync(node_path_1.default.join(__dirname, "commands")).filter(x => x.endsWith(".js"))) {
    const c = require(node_path_1.default.join(__dirname, "commands", f));
    commands.set(c.data.name, c);
    commandData.push(c.data.toJSON());
}
const eventsDir = node_path_1.default.join(__dirname, "events");
for (const f of node_fs_1.default.readdirSync(eventsDir).filter(x => x.endsWith(".js"))) {
    const loaded = require(node_path_1.default.join(eventsDir, f)).default;
    const list = Array.isArray(loaded) ? loaded : [loaded];
    for (const e of list)
        client[e.once ? "once" : "on"](e.name, (...args) => e.execute(...args));
}
client.on("interactionCreate", async (i) => {
    if (!i.isChatInputCommand())
        return;
    const c = commands.get(i.commandName);
    if (c)
        await c.execute(i).catch(async (e) => { console.error(e); if (!i.replied)
            await i.reply({ content: "❌ Komut hatası.", ephemeral: true }); });
});
client.once("ready", async () => {
    console.log(`🛡️ Hoowers Guard 3.0: ${client.user?.tag}`);
    for (const g of client.guilds.cache.values()) {
        (0, db_1.ensureGuild)(g.id);
        snapshot_1.snapshot.capture(g);
    }
    if (config_1.config.guildId) {
        const rest = new discord_js_1.REST({ version: "10" }).setToken(config_1.config.token);
        await rest.put(discord_js_1.Routes.applicationGuildCommands(client.user.id, config_1.config.guildId), { body: commandData }).catch(console.error);
    }
    await (0, log_1.log)(client, "🛡️ Guard Aktif", `${client.user?.tag} tüm koruma motorlarıyla başladı.`, 0x22cc66);
    setInterval(() => { for (const g of client.guilds.cache.values())
        snapshot_1.snapshot.capture(g); }, 5 * 60 * 1000);
});
client.on("error", e => console.error("Discord error", e));
process.on("unhandledRejection", e => console.error("Unhandled rejection", e));
client.login(config_1.config.token);
process.on("SIGTERM", () => { db_2.db.close(); client.destroy(); process.exit(0); });
process.on("SIGINT", () => { db_2.db.close(); client.destroy(); process.exit(0); });
