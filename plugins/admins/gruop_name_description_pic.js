const handler = async (m, { conn, text, command }) => {
    if (!m.isGroup) return m.reply('❌ الأمر ده للجروبات بس');

    const actions = {
        'اسم': async () => {
            if (!text) return m.reply('✏️ ~ اكتب الاسم الجديد');
            await conn.groupUpdateSubject(m.chat, text);
            m.reply('╭━〔  𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓  〕━╮\n│ ✅ ~ تم تغيير اسم الجروب\n╰━━━━━━━━━━━━━━━━╯');
        },

        'وصف': async () => {
            if (!text) return m.reply('📝 ~ اكتب الوصف الجديد');
            await conn.groupUpdateDescription(m.chat, text);
            m.reply('╭━〔  𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓  〕━╮\n│ ✅ ~ تم تغيير وصف الجروب\n╰━━━━━━━━━━━━━━━━╯');
        },

        'صوره': async () => {
            const q = m.quoted || m;
            const mime = q.mimetype || '';

            if (!/image/.test(mime)) {
                return m.reply('🖼️ ~ رد على صورة');
            }

            const media = await q.download();
            await conn.updateProfilePicture(m.chat, media);
            m.reply('╭━〔  𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓  〕━╮\n│ ✅ ~ تم تغيير صورة الجروب\n╰━━━━━━━━━━━━━━━━╯');
        }
    };

    const action = actions[command];
    if (!action) return;

    try {
        await action();
    } catch (e) {
        console.error(e);
        m.reply('╭━〔 ⚠️ 𝐄𝐑𝐑𝐎𝐑 ⚠️ 〕━╮\n│ ❌ حدث خطأ\n╰━━━━━━━━━━━━╯');
    }
};

handler.command = ['اسم', 'وصف', 'صوره'];
handler.usage = ['اسم', 'وصف', 'صوره'];
handler.category = "admin";
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;