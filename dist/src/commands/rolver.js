"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const safeChange_1 = require("../utils/safeChange");
exports.data = new discord_js_1.SlashCommandBuilder().setName("rolver").setDescription("Kullanıcıya rol ver (tek güvenli yol)")
    .addUserOption(o => o.setName("user").setDescription("Kullanıcı").setRequired(true))
    .addRoleOption(o => o.setName("role").setDescription("Rol").setRequired(true));
async function execute(i) {
    const member = i.member;
    if (!member || !member.permissions?.has?.(discord_js_1.PermissionFlagsBits.ManageRoles)) {
        if (i.user.id !== i.guild?.ownerId)
            return i.reply({ content: "Bu komut için **Manage Roles (Rolleri Yönet)** iznin gerekli.", ephemeral: true });
    }
    const user = i.options.getUser("user", true);
    const role = i.options.getRole("role", true);
    const guild = i.guild;
    if (role.id === guild.id)
        return i.reply({ content: "Sunucu varsayılan rolü verilemez.", ephemeral: true });
    const me = await guild.members.fetchMe().catch(() => null);
    if (!me)
        return i.reply({ content: "Bot bulunamadı.", ephemeral: true });
    if (role.position >= me.roles.highest.position)
        return i.reply({ content: `Botun en yüksek rolü (**${me.roles.highest.name}**) bu rolü veremeyecek kadar aşağıda. Bot rolünü **${role.name}** rolünün üstüne taşı.`, ephemeral: true });
    const target = await guild.members.fetch(user.id).catch(() => null);
    if (!target)
        return i.reply({ content: "Kullanıcı sunucuda bulunamadı.", ephemeral: true });
    if (target.roles.cache.has(role.id))
        return i.reply({ content: `<@${target.id}> kullanıcısında zaten **${role.name}** rolü var.`, ephemeral: true });
    (0, safeChange_1.markSafeRoleChange)(guild.id, target.id);
    const ok = await target.roles.add(role, "/rolver komutu ile").then(() => true).catch(() => false);
    if (!ok)
        return i.reply({ content: "Rol verilemedi (yetki veya bot rolü sorunu olabilir).", ephemeral: true });
    await i.reply({ content: `✅ <@${target.id}> kullanıcısına **${role.name}** rolü verildi.` });
}
