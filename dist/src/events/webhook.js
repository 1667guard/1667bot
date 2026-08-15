"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guard_1 = require("../core/guard");
exports.default = { name: discord_js_1.Events.WebhooksUpdate, once: false, async execute(channel) {
        if (!channel.guild)
            return;
        for (const type of [discord_js_1.AuditLogEvent.WebhookCreate, discord_js_1.AuditLogEvent.WebhookUpdate, discord_js_1.AuditLogEvent.WebhookDelete]) {
            const x = await guard_1.guard.actor(channel.guild, type, undefined, 5000);
            if (!x)
                continue;
            const hooks = await channel.fetchWebhooks().catch(() => null);
            if (hooks)
                for (const h of hooks.values()) {
                    if (h.owner?.id === x.member.id)
                        await h.delete("Guard: webhook rollback").catch(() => null);
                }
            const punished = await guard_1.guard.ban(channel.guild, x.member.id, "Anti Webhook", channel.id);
            await guard_1.guard.report(channel.guild, "🚨 Anti Webhook", `Kanal: <#${channel.id}>\nİşlemi yapan: <@${x.member.id}>\nCeza: ${punished ? "Ban" : "Başarısız"}`);
            break;
        }
    } };
