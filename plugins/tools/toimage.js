const toimg = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🖼️ رد على صورة / ملصق
╰━━━━━━━━━━━━━━━━━━╯`);
    }

    const buffer = await m.quoted.download();

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🖼️ تـم الإرسـال بـنـجـاح
┃ ───────────────
┃ ✨ IMAGE READY
╰━━━━━━━━━━━━━━━━━━╯`
    });

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ خطأ
┃ ───────────────
┃ ${e.message}
╰━━━━━━━━━━━━━━━━━━╯`
    });
  }
};

toimg.usage = ["لصوره"];
toimg.category = "tools";
toimg.command = ["لصوره", "toimage", "toimg"];

export default toimg;