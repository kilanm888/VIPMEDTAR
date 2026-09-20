import { Scrapy } from "meowsab";
import { gifToMp4 } from "../../system/utils.js";

let handler = async (m, { conn }) => {
    try {
        let target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply(`*𓆩 منشن شخص 𓆪*`);

        let group = await conn.groupMetadata(m.chat);
        if (!group.participants.find(p => p.id === target)) {
            return m.reply(`*𓆩 العضو غير موجود في المجموعة 𓆪*`);
        }

        const res = await Scrapy.AnimeGif("slap");
        const { url, anime_name } = res.results[0];
        const video = await gifToMp4(url);

        await conn.sendMessage(m.chat, {
            video: video,
            gifPlayback: true,
            caption: `
╭━━━〔 ✦ 𝐒𝐋𝐀𝐏 ✦ 〕━━━╮

𓆩 @${m.sender.split('@')[0]} 𓆪
⤷ صفع 𓆩 @${target.split('@')[0]} 𓆪

⟡ 𝙖𝙣𝙞𝙢𝙚: ${anime_name}

╰━━━━━━━━━━━━━━━━━━━━━━╯
`,
            mentions: [target, m.sender]
        });

    } catch (e) {
        m.reply(e.message);
    }
};

handler.usage = ["صفع @منشن"];
handler.category = "gif";
handler.command = ["صفع"];

export default handler;