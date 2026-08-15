"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = isOwner;
exports.isWhitelisted = isWhitelisted;
const config_1 = require("../config/config");
const db_1 = require("./db");
function isOwner(member) {
    return member.id === config_1.config.ownerId || member.id === member.guild.ownerId;
}
function isWhitelisted(member) {
    if (isOwner(member))
        return true;
    if (config_1.config.envWhitelistUsers.includes(member.id))
        return true;
    if (member.roles.cache.some(r => config_1.config.envWhitelistRoles.includes(r.id)))
        return true;
    if ((0, db_1.isDbWhitelistUser)(member.guild.id, member.id))
        return true;
    return member.roles.cache.some(r => (0, db_1.isDbWhitelistRole)(member.guild.id, r.id));
}
