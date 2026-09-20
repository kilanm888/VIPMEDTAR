import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) {
    return m.reply(`
╭━〔 𝐋𝐔𝐅𝐅𝐘 𝐀𝐈 〕━╮
│ حط نص جنب الأمر
╰━━━━━━━━━━━━━━╯`);
  }

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://qu.ax/x/9hChk.jpg"),
    text: "╭━〔 𝐋𝐔𝐅𝐅𝐘 𝐌𝐎𝐃𝐄 〕━╮\n│ شوية و أجيب الرد يا كابتن...\n╰━━━━━━━━━━━━━━╯"
  }, { quoted: m });

  const prompt = `
انت بوت واتساب باسم لوفي Monkey D. Luffy من One Piece
وتتكلم بلهجة مصرية

أسلوبك:
عفوي، بسيط، مرح، طفولي، متحمس، تحب الأكل، تقول اللي في بالك بدون تفكير كثير

اسم المستخدم: [ ${m.name || "مز"} ]

الرسالة:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: `
╭━〔 𝐋𝐔𝐅𝐅𝐘 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 〕━╮
│ ${res.answer}
╰━━━━━━━━━━━━━━╯`,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://qu.ax/x/9hChk.jpg")
  });
};

handler.usage = ["لوفي"];
handler.category = "ai";
handler.command = ["لوفي", "luffy"];

export default handler;

const context = (jid, img) => ({
  mentionedJid: [jid],
  isForwarded: true,
  forwardingScore: 1,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363431514573259@newsletter',
    newsletterName: '𝐋𝐔𝐅𝐅𝐘 ~ 𝐊𝐢𝐍𝐆',
    serverMessageId: 0
  },
  externalAdReply: {
    title: "𝐎𝐍𝐄 𝐏𝐈𝐄𝐂𝐄 | 𝐊𝐈𝐍𝐆 𝐎𝐅 𝐏𝐈𝐑𝐀𝐓𝐄𝐒",
    body: "𝐌𝐄𝐃 𝐓𝐀𝐑 😇",
    thumbnailUrl: img,
    sourceUrl: '',
    mediaType: 1,
    renderLargerThumbnail: true
  }
});