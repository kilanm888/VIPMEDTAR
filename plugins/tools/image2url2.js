import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { uploadToCatbox } from "../../system/utils.js";

const handler = async (m, { conn, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';

  if (!mime) throw `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ اعـمـل ريـبـلاي عـلـى مـلـف
┃ 🖼️ صـورة / 🎥 فـيـديـو / 🎧 صـوت
╰━━━━━━━━━━━━━━━━━━╯`;

  const media = await q.download();
  const link = await uploadToCatbox(media);

  await conn.sendButton(m.chat, {
    imageUrl: link,
    bodyText: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🇲🇷 تـم الرفـع بـنـجـاح
┃ ───────────────
┃ 🔗 الـرابـط:
┃ \`\`\`${link}\`\`\`
┃ ───────────────
┃ 🕵️‍♂️ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 ~ 𝐔𝐏𝐋𝐎𝐀𝐃
╰━━━━━━━━━━━━━━━━━━╯`,
    footerText: "✨ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 ~ 𝐁𝐎𝐓 ✨",
    buttons: [
      { name: "cta_copy", params: { display_text: "📋 نسخ الرابط", copy_code: link } },
    ],
    mentions: [m.sender],
    newsletter: {
      name: '𝐌𝐄𝐃 𝐓𝐀𝐑 😇',
      jid: '120363431514573259@newsletter'
    },
    interactiveConfig: {
      buttons_limits: 10,
      list_title: "✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃✨️",
      button_title: "Open",
      canonical_url: "https://vxv-profile.vercel.app"
    }
  }, m);
};

handler.usage = ["لرابط2"];
handler.category = "tools";
handler.command = ['لرابط2', 'image2url2'];

export default handler;