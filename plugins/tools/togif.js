const toGif = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🎬 رد على فيديو أولاً
╰━━━━━━━━━━━━━━━━━━╯`);
    }

    const buffer = await m.quoted.download();

    await conn.sendMessage(m.chat, {
      video: buffer,
      gifPlayback: true,
      caption: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🎞️ تـم تـحـويـل الـفـيـديـو لـجـيـف
┃ ───────────────
┃ ✨ GIF READY
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

toGif.usage = ["لجيف"];
toGif.category = "tools";
toGif.command = ["لجيف", "togif", "لچيف"];

export default toGif;