import "dotenv/config";

const csv = (v = "") => v.split(",").map(x => x.trim()).filter(Boolean);

export const config = {
  token: process.env.DISCORD_TOKEN ?? "",
  ownerId: process.env.OWNER_ID ?? "",
  guildId: process.env.GUILD_ID ?? "",
  logChannelId: process.env.LOG_CHANNEL_ID ?? "",
  databasePath: process.env.DATABASE_PATH ?? "./data/guard.sqlite",
  jailRoleId: process.env.JAIL_ROLE_ID ?? "",
  envWhitelistUsers: csv(process.env.WHITELIST_USER_IDS),
  envWhitelistRoles: csv(process.env.WHITELIST_ROLE_IDS),
  envSafeRoles: csv(process.env.SAFE_ROLE_IDS)
};
