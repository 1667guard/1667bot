"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
exports.default = [
    { name: discord_js_1.Events.GuildEmojiCreate, once: false, async execute(e) {
            const x = await guard_1.guard.actor(e.guild, discord_js_1.AuditLogEvent.EmojiCreate, e.id);
            if (!x)
                return;
            await e.delete("Guard: unauthorized emoji").catch(() => null);
            await guard_1.guard.ban(e.guild, x.member.id, "Anti Emoji Create", e.id);
        } },
    { name: discord_js_1.Events.GuildEmojiDelete, once: false, async execute(e) {
            const x = await guard_1.guard.actor(e.guild, discord_js_1.AuditLogEvent.EmojiDelete, e.id);
            if (!x)
                return;
            if (e.imageURL() && e.name)
                await e.guild.emojis.create({ attachment: e.imageURL(), name: e.name, reason: "Guard: emoji restore" }).catch(() => null);
            await guard_1.guard.ban(e.guild, x.member.id, "Anti Emoji Delete", e.id);
        } },
    { name: discord_js_1.Events.GuildEmojiUpdate, once: false, async execute(oldE, newE) {
            const x = await guard_1.guard.actor(newE.guild, discord_js_1.AuditLogEvent.EmojiUpdate, newE.id);
            if (!x)
                return;
            await newE.edit({ name: oldE.name, reason: "Guard: emoji rollback" }).catch(() => null);
            await guard_1.guard.ban(newE.guild, x.member.id, "Anti Emoji Update", newE.id);
        } },
    { name: discord_js_1.Events.GuildStickerCreate, once: false, async execute(s) {
            const x = await guard_1.guard.actor(s.guild, discord_js_1.AuditLogEvent.StickerCreate, s.id);
            if (!x)
                return;
            await s.delete("Guard: unauthorized sticker").catch(() => null);
            await guard_1.guard.ban(s.guild, x.member.id, "Anti Sticker Create", s.id);
        } },
    { name: discord_js_1.Events.GuildStickerDelete, once: false, async execute(s) {
            const x = await guard_1.guard.actor(s.guild, discord_js_1.AuditLogEvent.StickerDelete, s.id);
            if (!x)
                return;
            await guard_1.guard.ban(s.guild, x.member.id, "Anti Sticker Delete", s.id);
        } },
    { name: discord_js_1.Events.GuildStickerUpdate, once: false, async execute(oldS, newS) {
            const x = await guard_1.guard.actor(newS.guild, discord_js_1.AuditLogEvent.StickerUpdate, newS.id);
            if (!x)
                return;
            await newS.edit({ name: oldS.name, description: oldS.description, tags: oldS.tags, reason: "Guard: sticker rollback" }).catch(() => null);
            await guard_1.guard.ban(newS.guild, x.member.id, "Anti Sticker Update", newS.id);
        } }
];
