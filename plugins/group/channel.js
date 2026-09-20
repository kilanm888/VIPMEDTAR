const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ أرسل رابط القناة أو كود الدعوة');

  try {
    const invite = text.includes('https')
      ? text.split('/').pop().split('?')[0]
      : text.trim();

    const res = await conn.newsletterMetadata('invite', invite);
    const meta = res.thread_metadata;

    const name = meta.name?.text || 'غير معروف';
    const desc = meta.description?.text || 'لا يوجد وصف';
    const subs = meta.subscribers_count || '0';

    const created = meta.creation_time
      ? new Date(parseInt(meta.creation_time) * 1000).toLocaleString('ar')
      : 'غير معروف';

    const status = res.state?.type || 'غير معروف';
    const verify = meta.verification || 'غير معروف';
    const jid = res.id;

    let msg = `
╭━━━〔 ✦ 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 𝐈𝐍𝐅𝐎 ✦ 〕━━━╮

📢 الاسم: ${name}
👥 المشتركين: ${subs}
📅 الإنشاء: ${created}
📡 الحالة: ${status}
✔️ التوثيق: ${verify}

📝 الوصف:
${desc}

╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

    const img = meta.preview?.direct_path
      ? 'https://mmg.whatsapp.net' + meta.preview.direct_path
      : null;

    await conn.sendMessage(m.chat, {
      image: img ? { url: img } : undefined,
      text: msg,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: name,
          body: "Channel Info",
          thumbnailUrl: img || undefined,
          sourceUrl: "https://vxv-profile.vercel.app",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

  } catch (e) {
    m.reply('❌ حدث خطأ، تأكد من الرابط أو الكود');
  }
};

handler.command = ['قناة'];
export default handler;