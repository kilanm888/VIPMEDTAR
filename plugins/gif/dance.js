import { Scrapy } from "meowsab";
import { gifToMp4 } from "../../system/utils.js";

let handler = async (m, { conn }) => {
    try {
        let target = m.mentionedJid?.[0] || m.quoted?.sender;

        if (!target)
            return m.reply(`
╭━━━〔 💙 تنبيه 〕━━━╮
┃ منشن شخص لاستخدام الأمر
┃ مثال: /ارقص @user
╰━━━━━━━━━━━━━━━━━━━━╯
`);

        let group = await conn.groupMetadata(m.chat);

        if (!group.participants.find(p => p.id === target)) {
            return m.reply(`
╭━━━〔 🕸️ خطأ 〕━━━╮
┃ العضو غير موجود في الجروب
╰━━━━━━━━━━━━━━━━━━━━╯
`);
        }

        const res = await Scrapy.AnimeGif("dance");
        const { url, anime_name } = res.results[0];
        const video = await gifToMp4(url);

        await conn.sendMessage(m.chat, {
            video: video,
            gifPlayback: true,
            caption: `
╭━━━〔 💃 رقصة أنمي 〕━━━╮
┃ @${m.sender.split('@')[0]} يقول:
┃ “ارقص/ي يا @${target.split('@')[0]}”
╰━━━━━━━━━━━━━━━━━━━━╯

🎬 الأنمي: ${anime_name}
`,
            mentions: [target, m.sender]
        });

    } catch (e) {
        m.reply(`❌ خطأ: ${e.message}`);
    }
};

handler.usage = ["ارقص @منشن"];
handler.category = "gif";
handler.command = ["ارقص"];

export default handler;