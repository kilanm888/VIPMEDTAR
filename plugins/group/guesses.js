const handler = async (m, { conn, command }) => {
  const participants = await conn.groupMetadata(m.chat)
    .then(m => m.participants);

  const jids = participants.map(p => p.id);

  if (jids.length < 2) {
    return conn.sendMessage(m.chat, { text: "المجموعة صغيرة جداً" });
  }

  const randomUser = jids[Math.floor(Math.random() * jids.length)];
  const percentage = Math.floor(Math.random() * 100) + 1;

  let text = "";

  switch (command) {
    case "بيحبني":
      text = `
╭━━━〔 💖 𝐋𝐎𝐕𝐄 𝐑𝐄𝐀𝐃𝐈𝐍𝐆 💖 〕━━━╮

❤️ أكثر شخص يحبك عشوائياً:
👤 @${randomUser.split('@')[0]}

💘 نسبة الحب: ${percentage}%

╰━━━━━━━━━━━━━━━━━━━━━━╯
`;
      break;

    case "بيكرهني":
      text = `
╭━━━〔 💔 𝐇𝐀𝐓𝐄 𝐒𝐂𝐀𝐍 💔 〕━━━╮

😡 أكثر شخص يكرهك:
👤 @${randomUser.split('@')[0]}

💢 نسبة الكره: ${percentage}%

╰━━━━━━━━━━━━━━━━━━━━━━╯
`;
      break;

    case "بيكراش":
      text = `
╭━━━〔 💘 𝐂𝐑𝐔𝐒𝐇 𝐃𝐄𝐓𝐄𝐂𝐓𝐎𝐑 💘 〕━━━╮

😍 شخص معجب بك:
👤 @${randomUser.split('@')[0]}

💞 نسبة الإعجاب: ${percentage}%

╰━━━━━━━━━━━━━━━━━━━━━━╯
`;
      break;

    default:
      return;
  }

  return conn.sendMessage(m.chat, {
    text,
    mentions: [randomUser]
  }, { quoted: m });
};

handler.usage = ["بيحبني", "بيكرهني", "بيكراش"];
handler.category = "group";
handler.command = ["بيحبني", "بيكرهني", "بيكراش"];

export default handler;