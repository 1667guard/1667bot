import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "../config/config";

fs.mkdirSync(path.dirname(path.resolve(config.databasePath)), { recursive: true });
export const db = new Database(config.databasePath);
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");

db.exec(`
CREATE TABLE IF NOT EXISTS settings (
 guild_id TEXT PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 1,
 jail_role_id TEXT, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS whitelist_users (
 guild_id TEXT NOT NULL, user_id TEXT NOT NULL, created_at INTEGER NOT NULL,
 PRIMARY KEY(guild_id,user_id)
);
CREATE TABLE IF NOT EXISTS whitelist_roles (
 guild_id TEXT NOT NULL, role_id TEXT NOT NULL, created_at INTEGER NOT NULL,
 PRIMARY KEY(guild_id,role_id)
);
CREATE TABLE IF NOT EXISTS safe_roles (
 guild_id TEXT NOT NULL, role_id TEXT NOT NULL, created_at INTEGER NOT NULL,
 PRIMARY KEY(guild_id,role_id)
);
CREATE TABLE IF NOT EXISTS incidents (
 id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL,
 executor_id TEXT, action TEXT NOT NULL, target_id TEXT, details TEXT,
 created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS snapshots (
 guild_id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL
);
`);

export function ensureGuild(guildId: string) {
  db.prepare(`INSERT OR IGNORE INTO settings(guild_id,updated_at) VALUES(?,?)`).run(guildId, Date.now());
}
export function setting(guildId: string) {
  ensureGuild(guildId);
  return db.prepare(`SELECT * FROM settings WHERE guild_id=?`).get(guildId) as any;
}
export function setSetting(guildId: string, key: "enabled"|"jail_role_id", value: string|number) {
  ensureGuild(guildId);
  db.prepare(`UPDATE settings SET ${key}=?,updated_at=? WHERE guild_id=?`).run(value, Date.now(), guildId);
}
export function addWhitelistUser(guildId:string,userId:string) {
  db.prepare(`INSERT OR REPLACE INTO whitelist_users VALUES(?,?,?)`).run(guildId,userId,Date.now());
}
export function removeWhitelistUser(guildId:string,userId:string) {
  db.prepare(`DELETE FROM whitelist_users WHERE guild_id=? AND user_id=?`).run(guildId,userId);
}
export function addWhitelistRole(guildId:string,roleId:string) {
  db.prepare(`INSERT OR REPLACE INTO whitelist_roles VALUES(?,?,?)`).run(guildId,roleId,Date.now());
}
export function removeWhitelistRole(guildId:string,roleId:string) {
  db.prepare(`DELETE FROM whitelist_roles WHERE guild_id=? AND role_id=?`).run(guildId,roleId);
}
export function addSafeRole(guildId:string,roleId:string) {
  db.prepare(`INSERT OR REPLACE INTO safe_roles VALUES(?,?,?)`).run(guildId,roleId,Date.now());
}
export function removeSafeRole(guildId:string,roleId:string) {
  db.prepare(`DELETE FROM safe_roles WHERE guild_id=? AND role_id=?`).run(guildId,roleId);
}
export function isDbWhitelistUser(guildId:string,userId:string) {
  return !!db.prepare(`SELECT 1 FROM whitelist_users WHERE guild_id=? AND user_id=?`).get(guildId,userId);
}
export function isDbWhitelistRole(guildId:string,roleId:string) {
  return !!db.prepare(`SELECT 1 FROM whitelist_roles WHERE guild_id=? AND role_id=?`).get(guildId,roleId);
}
export function isSafeRole(guildId:string,roleId:string) {
  return !!db.prepare(`SELECT 1 FROM safe_roles WHERE guild_id=? AND role_id=?`).get(guildId,roleId);
}
export function recordIncident(guildId:string, action:string, executorId?:string, targetId?:string, details?:unknown) {
  db.prepare(`INSERT INTO incidents(guild_id,executor_id,action,target_id,details,created_at) VALUES(?,?,?,?,?,?)`)
    .run(guildId,executorId ?? null,targetId ?? null,details ? JSON.stringify(details) : null,Date.now());
}
