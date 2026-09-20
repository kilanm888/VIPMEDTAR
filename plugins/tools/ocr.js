import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn }) => {
  try {
    if (!m.quoted) return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ ابعت صورة ورد عليها
┃ 🧠 عشان أقدر أقرأ النص
╰━━━━━━━━━━━━━━━━━━╯`);

    const buffer = await m.quoted.download();
    const form = new FormData();
    form.append('image', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

    const res = await axios.post(
      'https://emam-api.web.id/home/sections/Tools/api/ocr-image',
      form,
      { headers: form.getHeaders() }
    );

    await conn.sendMessage(m.chat, {
      text: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 📝 النـص المستخرج:
╰━━━━━━━━━━━━━━━━━━╯

${res.data.result}
`,
    }, { quoted: m });

  } catch (error) {
    await conn.sendMessage(m.chat, {
      text: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ حدث خطأ أثناء الاستخراج
┃ ⚠️ ${error.message}
╰━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
  }
};

handler.usage = ["نسخ"];
handler.command = ["نسخ", "ocr"];
handler.category = "tools";

export default handler;