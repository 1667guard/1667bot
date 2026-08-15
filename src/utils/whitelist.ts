import { GuildMember } from "discord.js";
import { config } from "../config/config";
import { isDbWhitelistRole, isDbWhitelistUser } from "./db";

export function isOwner(member: GuildMember) {
  return member.id === config.ownerId || member.id === member.guild.ownerId;
}
export function isWhitelisted(member: GuildMember) {
  if (isOwner(member)) return true;
  if (config.envWhitelistUsers.includes(member.id)) return true;
  if (member.roles.cache.some(r => config.envWhitelistRoles.includes(r.id))) return true;
  if (isDbWhitelistUser(member.guild.id, member.id)) return true;
  return member.roles.cache.some(r => isDbWhitelistRole(member.guild.id, r.id));
}
