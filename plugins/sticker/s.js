import { createSticker } from "../../system/utils.js";

const test = async (m, { conn, bot }) => {
  if (!m.quoted) return m.reply(`
╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ يرجى الرد على صورة أو فيديو
┃ لتحويله إلى ملصق
╰━━━━━━━━━━━━━━━━━━━━━━╯`);

  const { pack, author } = bot.config.info.copyright;

  const q = m.quoted;
  const buffer = await createSticker(
    await q.download(),
    { mime: q.mimetype, pack, author }
  );

  await conn.sendMessage(
    m.chat,
    { sticker: buffer },
    { quoted: m }
  );
};

test.usage = ["ملصق"];
test.command = ["ملصق", "s"];
test.category = "sticker";

export default test;