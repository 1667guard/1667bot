import { Guild, ChannelType, PermissionFlagsBits } from "discord.js";
import { db } from "../utils/db";

type Snap={
 channels:any[]; roles:any[]; guild:{name:string;icon:string|null;banner:string|null};
 emojis:any[]; stickers:any[];
};
export class Snapshot {
  capture(guild:Guild) {
    const data:Snap={
      guild:{name:guild.name,icon:guild.iconURL({extension:"png",size:1024}),banner:guild.bannerURL({extension:"png",size:1024})},
      channels:guild.channels.cache.map(c=>({
        id:c.id,name:c.name,type:c.type,parentId:"parentId" in c ? c.parentId:null,
        position:"rawPosition" in c ? c.rawPosition:0,topic:"topic" in c ? c.topic:null,
        nsfw:"nsfw" in c ? c.nsfw:false,
        rateLimitPerUser:"rateLimitPerUser" in c ? c.rateLimitPerUser:0
      })),
      roles:guild.roles.cache.filter(r=>r.id!==guild.id).map(r=>({
        id:r.id,name:r.name,color:r.color,hoist:r.hoist,mentionable:r.mentionable,
        permissions:r.permissions.bitfield.toString(),position:r.position
      })),
      emojis:guild.emojis.cache.map(e=>({id:e.id,name:e.name,url:e.imageURL()})),
      stickers:guild.stickers.cache.map(s=>({id:s.id,name:s.name,description:s.description,tags:s.tags,format:s.format,url:s.url}))
    };
    db.prepare(`INSERT OR REPLACE INTO snapshots(guild_id,payload,updated_at) VALUES(?,?,?)`)
      .run(guild.id,JSON.stringify(data),Date.now());
    return data;
  }
  get(guildId:string):Snap|null {
    const x=db.prepare(`SELECT payload FROM snapshots WHERE guild_id=?`).get(guildId) as any;
    return x?JSON.parse(x.payload):null;
  }
  async restoreChannel(guild:Guild,id:string) {
    const s=this.get(guild.id)?.channels.find(x=>x.id===id); if(!s) return null;
    return guild.channels.create({name:s.name,type:s.type,parent:s.parentId??undefined,topic:s.topic??undefined,nsfw:s.nsfw,rateLimitPerUser:s.rateLimitPerUser,reason:"Guard restore"})
      .catch(()=>null);
  }
  async restoreRole(guild:Guild,id:string) {
    const s=this.get(guild.id)?.roles.find(x=>x.id===id); if(!s) return null;
    return guild.roles.create({name:s.name,color:s.color,hoist:s.hoist,mentionable:s.mentionable,permissions:BigInt(s.permissions),reason:"Guard restore"})
      .catch(()=>null);
  }
  async restoreGuild(guild:Guild,changes:any[]) {
    const s=this.get(guild.id)?.guild; if(!s) return false;
    const patch:any={};
    if(changes.some(c=>c.key==="name")) patch.name=s.name;
    if(changes.some(c=>c.key==="icon")) patch.icon=s.icon;
    if(changes.some(c=>c.key==="banner")) patch.banner=s.banner;
    if(!Object.keys(patch).length) return false;
    await guild.edit(patch).catch(()=>null); return true;
  }
}
export const snapshot=new Snapshot();
