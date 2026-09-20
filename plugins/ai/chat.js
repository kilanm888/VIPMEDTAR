import { AiChat } from "../../system/utils.js";

const handler = async (m, { conn, text, bot }) => {
  if (!text) {
    return m.reply(`
╭━〔 🤖 𝐀𝐈 𝐒𝐘𝐒𝐓𝐄𝐌 🤖 〕━╮
│ 💙 حط نص جنب الأمر
╰━━━━━━━━━━━━━━━━╯`);
  }

  const res = await AiChat({ text });

  m.reply(`
╭━〔 🧠 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐀𝐈 🧠 〕━╮
│ ✨ الرد:
│ ${res}
╰━━━━━━━━━━━━━━━━╯`);
};

handler.usage = ["بوت"];
handler.category = "ai";
handler.command = ["بوت"];

export default handler;