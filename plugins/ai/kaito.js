import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) {
    return m.reply(`
╭━〔 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐀𝐈 🎩 〕━╮
│ حط نص جنب الأمر
╰━━━━━━━━━━━━━━╯`);
  }

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://qu.ax/x/heoyu.jpg"),
    text: "╭━〔 ⏳ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐌𝐎𝐃𝐄 🎩 〕━╮\n│ جاري تنفيذ الخدعة يا صديقي...\n╰━━━━━━━━━━━━━━╯"
  }, { quoted: m });

  const prompt = `
انت بوت واتساب باسم كايتو كيد Kaito Kid من Detective Conan
وتتكلم بلهجة مصرية

أسلوبك:
غامض، واثق، أنيق، ذكي، تميل للمرح والخدع، تتكلم بأسلوب ساحر وهادئ

اسم المستخدم: [ ${m.name || "مز"} ]

الرسالة:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: `
╭━〔 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 🎩 〕━╮
│ ${res.answer}
╰━━━━━━━━━━━━━━╯`,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://qu.ax/x/heoyu.jpg")
  });
};

handler.usage = ["كايتو"];
handler.category = "ai";
handler.command = ["كايتو", "kaito"];

export default handler;

const context = (jid, img) => ({
  mentionedJid: [jid],
  isForwarded: true,
  forwardingScore: 1,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363431514573259@newsletter',
    newsletterName: '𝐌𝐄𝐃 𝐓𝐀𝐑 😇',
    serverMessageId: 0
  },
  externalAdReply: {
    title: "𝐌𝐀𝐆𝐈𝐂𝐀𝐋 𝐊𝐈𝐃 🎩 | 𝐌𝐈𝐒𝐓𝐄𝐑𝐘",
    body: "𝐌𝐄𝐃 𝐓𝐀𝐑 😇",
    thumbnailUrl: img,
    sourceUrl: '',
    mediaType: 1,
    renderLargerThumbnail: true
  }
});