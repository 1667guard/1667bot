import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { config } from "../config/config";

export async function log(client:Client,title:string,description:string,color=0xff3344) {
  if(!config.logChannelId) return;
  const ch=await client.channels.fetch(config.logChannelId).catch(()=>null);
  if(!(ch instanceof TextChannel)) return;
  const e=new EmbedBuilder().setTitle(title).setDescription(description).setColor(color).setTimestamp();
  await ch.send({embeds:[e]}).catch(()=>null);
}
