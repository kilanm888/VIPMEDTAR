import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';
import { Convert } from "meowsab";

let handler = async (m, { conn, text, command }) => {

  if (!m.quoted) return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🪽 رد على الاستيكر أولاً
╰━━━━━━━━━━━━━━━━━━╯`);

  if (!/webp/.test(m.quoted.mimetype)) return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ ده مش استيكر
╰━━━━━━━━━━━━━━━━━━╯`);

  const buffer = await m.quoted.download();
  let smp4 = await Convert.WebpToMp4(buffer);

  await conn.sendMessage(m.chat, {
    video: { url: smp4 },
    caption: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🎬 تـم الـتـحـويـل بـنـجـاح
┃ ───────────────
┃ ✅ DONE
╰━━━━━━━━━━━━━━━━━━╯`,
  }, { quoted: m });
};

handler.usage = ["لفيديو"];
handler.category = "tools";
handler.command = /^(tovideo|tovid|tomp4|لفيديو)$/i;

export default handler;