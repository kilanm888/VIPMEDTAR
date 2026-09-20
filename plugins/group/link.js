let handler = async (m, { conn }) => {
    try {
        const meta = await conn.groupMetadata(m.chat);
        const code = await conn.groupInviteCode(m.chat);

        const text = `
╭━━━〔 ✦ 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐕𝐈𝐓𝐄 ✦ 〕━━━╮

🌸 الاسم: ${meta.subject}

🔗 الرابط:
https://chat.whatsapp.com/${code}

🤖 البوت: ${conn.user.name || "Bot"}

╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

        return m.reply(text);

    } catch {
        const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";

        return conn.sendMessage(m.chat, {
            text: `
╭━━━〔 ⚠️ 𝐄𝐑𝐑𝐎𝐑 ⚠️ 〕━━━╮

❌ لا يمكن جلب رابط المجموعة
👮‍♂️ تأكد أن البوت مشرف

╰━━━━━━━━━━━━━━━━━━━━━━╯
`,
            mentions: [botJid]
        });
    }
};

handler.usage = ["لينك"];
handler.category = "group";
handler.command = ["لينك", "link"];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;