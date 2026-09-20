const handler = async (m, { conn }) => {
  const participants = await conn.groupMetadata(m.chat)
    .then(m => m.participants);

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

  const love1 = Math.floor(Math.random() * 100) + 1;
  const love2 = Math.floor(Math.random() * 100) + 1;

  return conn.sendMessage(m.chat, {
    text: `
╭━━━〔 💍 𝐌𝐀𝐑𝐑𝐈𝐀𝐆𝐄 𝐀𝐍𝐍𝐎𝐔𝐍𝐂𝐄𝐌𝐄𝐍𝐓 💍 〕━━━╮

🤵 العريس: @${user1.split('@')[0]}
💖 نسبة الحب: ${love1}%

👰 العروسة: @${user2.split('@')[0]}
💖 نسبة الحب: ${love2}%

🎉 مبروك لهم الزواج 🎉

╰━━━━━━━━━━━━━━━━━━━━━━╯
`,
    mentions: [user1, user2]
  }, { quoted: m });
};

handler.usage = ["زواج"];
handler.category = "group";
handler.command = ["زواج"];

export default handler;