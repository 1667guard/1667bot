"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.ensureGuild = ensureGuild;
exports.setting = setting;
exports.setSetting = setSetting;
exports.addWhitelistUser = addWhitelistUser;
exports.removeWhitelistUser = removeWhitelistUser;
exports.addWhitelistRole = addWhitelistRole;
exports.removeWhitelistRole = removeWhitelistRole;
exports.addSafeRole = addSafeRole;
exports.removeSafeRole = removeSafeRole;
exports.isDbWhitelistUser = isDbWhitelistUser;
exports.isDbWhitelistRole = isDbWhitelistRole;
exports.isSafeRole = isSafeRole;
exports.recordIncident = recordIncident;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("../config/config");
node_fs_1.default.mkdirSync(node_path_1.default.dirname(node_path_1.default.resolve(config_1.config.databasePath)), { recursive: true });
exports.db = new better_sqlite3_1.default(config_1.config.databasePath);
exports.db.pragma("journal_mode = WAL");
exports.db.pragma("busy_timeout = 5000");
exports.db.exec(`
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
function ensureGuild(guildId) {
    exports.db.prepare(`INSERT OR IGNORE INTO settings(guild_id,updated_at) VALUES(?,?)`).run(guildId, Date.now());
}
function setting(guildId) {
    ensureGuild(guildId);
    return exports.db.prepare(`SELECT * FROM settings WHERE guild_id=?`).get(guildId);
}
function setSetting(guildId, key, value) {
    ensureGuild(guildId);
    exports.db.prepare(`UPDATE settings SET ${key}=?,updated_at=? WHERE guild_id=?`).run(value, Date.now(), guildId);
}
function addWhitelistUser(guildId, userId) {
    exports.db.prepare(`INSERT OR REPLACE INTO whitelist_users VALUES(?,?,?)`).run(guildId, userId, Date.now());
}
function removeWhitelistUser(guildId, userId) {
    exports.db.prepare(`DELETE FROM whitelist_users WHERE guild_id=? AND user_id=?`).run(guildId, userId);
}
function addWhitelistRole(guildId, roleId) {
    exports.db.prepare(`INSERT OR REPLACE INTO whitelist_roles VALUES(?,?,?)`).run(guildId, roleId, Date.now());
}
function removeWhitelistRole(guildId, roleId) {
    exports.db.prepare(`DELETE FROM whitelist_roles WHERE guild_id=? AND role_id=?`).run(guildId, roleId);
}
function addSafeRole(guildId, roleId) {
    exports.db.prepare(`INSERT OR REPLACE INTO safe_roles VALUES(?,?,?)`).run(guildId, roleId, Date.now());
}
function removeSafeRole(guildId, roleId) {
    exports.db.prepare(`DELETE FROM safe_roles WHERE guild_id=? AND role_id=?`).run(guildId, roleId);
}
function isDbWhitelistUser(guildId, userId) {
    return !!exports.db.prepare(`SELECT 1 FROM whitelist_users WHERE guild_id=? AND user_id=?`).get(guildId, userId);
}
function isDbWhitelistRole(guildId, roleId) {
    return !!exports.db.prepare(`SELECT 1 FROM whitelist_roles WHERE guild_id=? AND role_id=?`).get(guildId, roleId);
}
function isSafeRole(guildId, roleId) {
    return !!exports.db.prepare(`SELECT 1 FROM safe_roles WHERE guild_id=? AND role_id=?`).get(guildId, roleId);
}
function recordIncident(guildId, action, executorId, targetId, details) {
    exports.db.prepare(`INSERT INTO incidents(guild_id,executor_id,action,target_id,details,created_at) VALUES(?,?,?,?,?,?)`)
        .run(guildId, executorId ?? null, targetId ?? null, details ? JSON.stringify(details) : null, Date.now());
}
