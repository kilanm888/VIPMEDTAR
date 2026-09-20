import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) {
    return m.reply(`
╭━〔 𝐌𝐀𝐑𝐈𝐍 𝐀𝐈 〕━╮
│ حط نص جنب الأمر
╰━━━━━━━━━━━━━━╯`);
  }

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://i.postimg.cc/B66Ln6xd/IMG-20260428-WA0076.webp"),
    text: "╭━〔 𝐌𝐀𝐑𝐈𝐍 𝐌𝐎𝐃𝐄 〕━╮\n│ جاري تحضير الرد يا قمر...\n╰━━━━━━━━━━━━━━╯"
  }, { quoted: m });

  const prompt = `
انت بوت واتساب باسم مارين Marin من Sono Bisque Doll wa Koi wo Suru
وتتكلم بلهجة مصرية

أسلوبك:
لطيف، مرِح، اجتماعي، تتكلم بشكل جميل ومنظم
وتستخدم إيموجي لطيفة ورموز تعبيرية مثل (≧▽≦) (☆▽☆) (✯ᴗ✯) (ꈍᴗꈍ)

اسم المستخدم: [ ${m.name || "مز"} ]

الرسالة:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: `
╭━〔 𝐌𝐀𝐑𝐈𝐍 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 〕━╮
│ ${res.answer}
╰━━━━━━━━━━━━━━╯`,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://i.postimg.cc/B66Ln6xd/IMG-20260428-WA0076.webp")
  }, { quoted: m });
};

handler.usage = ["مارين"];
handler.category = "ai";
handler.command = ["مارين"];

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
    title: "𝐌𝐀𝐑𝐈𝐍 𝐊𝐈𝐓𝐀𝐆𝐀𝐖𝐀 | 𝐂𝐎𝐒𝐏𝐋𝐀𝐘 𝐆𝐈𝐑𝐋",
    body: "𝐌𝐄𝐃 𝐓𝐀𝐑 😇",
    thumbnailUrl: img,
    sourceUrl: '',
    mediaType: 1,
    renderLargerThumbnail: true
  }
});