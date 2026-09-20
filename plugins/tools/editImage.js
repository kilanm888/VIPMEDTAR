import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { uploadToCatbox } from "../../system/utils.js";

let handler = async (m, { conn, bot, text }) => {
  try {

    if (!m.quoted?.mimetype) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🖼️ رد عـلـى صـورة أولاً
╰━━━━━━━━━━━━━━━━━━╯`);
    }

    if (!m.quoted.mimetype.startsWith('image/')) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ هـذا لـيـس مـلـف صـورة
╰━━━━━━━━━━━━━━━━━━╯`);
    }

    if (!text) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 💬 اكـتـب الـتـعـديـل الـمـطـلـوب
┃
┃ ✨ مثال :
┃ .تعديل خلي الخلفية فضائية
╰━━━━━━━━━━━━━━━━━━╯`);
    }

    m.react("🎨");

    const buffer = await m.quoted.download();
    const imageUrl = await uploadToCatbox(buffer);

    const editRes = await bot.Api.tools.editImage({
      imageUrl: imageUrl,
      prompt: text
    });

    if (!editRes?.status || !editRes?.recordId) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ فـشـل بـدء عـمـلـيـة الـتـعـديـل
╰━━━━━━━━━━━━━━━━━━╯`);
    }

    const waitMsg = await m.reply(`
╭━━━〔 🎨 𝐄𝐃𝐈𝐓 𝐌𝐎𝐃𝐄 〕━━━╮
┃ ⏳ جـاري تـعـديـل الـصـورة...
┃ 🌌 يـرجـى الانـتـظـار قـلـيـلاً
╰━━━━━━━━━━━━━━━━━━╯`);

    let result = null;

    for (let j = 0; j < 30; j++) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const checkRes = await bot.Api.tools.checkResult({
        rid: editRes.recordId
      });

      if (checkRes?.completed && checkRes?.resultUrl) {
        result = checkRes.resultUrl;
        break;
      }
    }

    if (!result) {
      return m.reply(`
╭━━━〔 ⌛ 𝐓𝐈𝐌𝐄 𝐎𝐔𝐓 〕━━━╮
┃ ❌ اسـتـغـرق الـتـعـديـل وقـت طـويـل
┃ 🔄 جـرب مـرة أخـرى
╰━━━━━━━━━━━━━━━━━━╯`);
    }

    await conn.sendMessage(m.chat, {
      image: { url: result },
      caption: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ✅ تـم تـعـديـل الـصـورة بـنـجـاح
┃
┃ 🎨 الـتـعـديـل :
┃ ${text}
╰━━━━━━━━━━━━━━━━━━╯

> 🌌 Powered By 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 ✨`
    }, { quoted: m });

  } catch (error) {
    console.error(error);

    return m.reply(`
╭━━━〔 ⚠️ 𝐄𝐑𝐑𝐎𝐑 〕━━━╮
┃ ❌ حـدث خـطـأ أثـنـاء الـتـعـديـل
┃ 🔧 حـاول لاحـقـاً
╰━━━━━━━━━━━━━━━━━━╯`);
  }
};

handler.usage = ["تعديل"];
handler.command = ["editimage", "تعديل"];
handler.category = "tools";

export default handler;
