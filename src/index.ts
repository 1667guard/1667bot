import { Client, GatewayIntentBits, Partials, REST, Routes, Collection } from "discord.js";
import fs from "node:fs"; import path from "node:path";
import { config } from "./config/config"; import { snapshot } from "./core/snapshot"; import { ensureGuild } from "./utils/db";
import { log } from "./utils/log";
import { db } from "./utils/db";

if(!config.token){console.error("DISCORD_TOKEN eksik");process.exit(1);}
const client=new Client({
 intents:[
  GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildModeration,
  GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildWebhooks
 ],
 partials:[Partials.Channel]
});
const commands=new Collection<string,any>();
const commandData:any[]=[];
for(const f of fs.readdirSync(path.join(__dirname,"commands")).filter(x=>x.endsWith(".js"))){
 const c=require(path.join(__dirname,"commands",f)); commands.set(c.data.name,c); commandData.push(c.data.toJSON());
}
const eventsDir=path.join(__dirname,"events");
for(const f of fs.readdirSync(eventsDir).filter(x=>x.endsWith(".js"))){
 const loaded=require(path.join(eventsDir,f)).default;
 const list=Array.isArray(loaded)?loaded:[loaded];
 for(const e of list) client[e.once?"once":"on"](e.name,(...args:any[])=>e.execute(...args));
}
client.on("interactionCreate",async i=>{
 if(!i.isChatInputCommand())return;
 const c=commands.get(i.commandName); if(c) await c.execute(i).catch(async(e:any)=>{console.error(e);if(!i.replied)await i.reply({content:"❌ Komut hatası.",ephemeral:true});});
});
client.once("ready",async()=>{
 console.log(`🛡️ Hoowers Guard 3.0: ${client.user?.tag}`);
 for(const g of client.guilds.cache.values()){ensureGuild(g.id);snapshot.capture(g);}
 if(config.guildId){
  const rest=new REST({version:"10"}).setToken(config.token);
  await rest.put(Routes.applicationGuildCommands(client.user!.id,config.guildId),{body:commandData}).catch(console.error);
 }
 await log(client,"🛡️ Guard Aktif",`${client.user?.tag} tüm koruma motorlarıyla başladı.`,0x22cc66);
 setInterval(()=>{ for(const g of client.guilds.cache.values()) snapshot.capture(g); }, 5*60*1000);
});
client.on("error",e=>console.error("Discord error",e));
process.on("unhandledRejection",e=>console.error("Unhandled rejection",e));
client.login(config.token);

process.on("SIGTERM",()=>{ db.close(); client.destroy(); process.exit(0); });
process.on("SIGINT",()=>{ db.close(); client.destroy(); process.exit(0); });
