const handler = async (m, { conn }) => {
  const participants = await conn.groupMetadata(m.chat)
    .then(metadata => metadata.participants);

  const jids = participants.map(p => p.id);

  if (jids.length < 2) {
    return conn.sendMessage(m.chat, { text: "المجموعة صغيرة جداً" });
  }

  let i1 = Math.floor(Math.random() * jids.length);
  let i2;

  do {
    i2 = Math.floor(Math.random() * jids.length);
  } while (i2 === i1 && jids.length > 1);

  const user1 = jids[i1];
  const user2 = jids[i2];

  return conn.sendMessage(m.chat, {
    text: `
╭━━━〔 ✦ 𝐂𝐎𝐔𝐑𝐓 𝐕𝐄𝐑𝐃𝐈𝐂𝐓 ✦ 〕━━━╮

⚖️ تم إصدار حكم "انفصال رسمي"

👤 العروس ✨️: @${user1.split('@')[0]}
👤 العريس 🫟: @${user2.split('@')[0]}

💔 القرار: انفصال نهائي بدون استئناف

💸 النفقة على الطرفين حسب المزاج

╰━━━━━━━━━━━━━━━━━━━━━━╯
`,
    mentions: [user1, user2]
  }, { quoted: m });
};

handler.usage = ["طلاق"];
handler.category = "group";
handler.command = ["طلاق"];

export default handler;