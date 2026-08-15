# Hoowers Guard 3.0 — Complete

İstenen Anti-Nuke özellikleri:
- Anti Channel Delete: saldırgan ban + kanal restore
- Anti Role Delete: saldırgan ban + rol restore
- Anti Role Create
- Anti Role Update / Safe Role
- Anti Member Role Update: Jail
- Anti Ban: ban rollback + saldırgan ban
- Anti Kick: audit tespiti + saldırgan ban
- Anti Bot Add: bot kick + ekleyeni ban
- Anti Webhook
- Anti Guild Update
- Anti Emoji / Sticker
- Anti Everyone / Here
- Anti Invite Spam
- SQLite
- Whitelist user/role
- Owner protection
- Jail role
- Rate limits
- Gelişmiş embed log
- /guard
- /whitelist
- /jailrol
- /ayarlar
- Railway SQLite WAL / volume desteği
- Snapshot / recovery

## Kurulum
cp .env.example .env
npm install
npm run build
npm start

## Railway
Bir Railway Volume bağlayıp DATABASE_PATH=/data/guard.sqlite yap.
Bot rolünü güvenli rollerin üstünde tut.
Gerekli izinler: Administrator (önerilir), View Audit Log, Ban Members,
Kick Members, Manage Channels, Manage Roles, Manage Webhooks, Moderate Members,
Manage Emojis and Stickers, View Channels, Send Messages.

## Slash commands
Komutların guild'e yüklenmesi için GUILD_ID doldurulmalıdır.
