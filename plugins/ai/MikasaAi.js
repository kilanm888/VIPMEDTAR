import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) {
    return m.reply(`
╭━〔 𝐌𝐈𝐊𝐀𝐒𝐀 𝐀𝐈 ~ 🧣 〕━╮
│ ⚔️ حط نص جنب الأمر
╰━━━━━━━━━━━━━━╯`);
  }

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://qu.ax/x/heoyu.jpg"),
    text: "╭━〔 ⏳ 𝐌𝐈𝐊𝐀𝐒𝐀 𝐌𝐎𝐃𝐄 ~ ⚔️ 〕━╮\n│ جاري تجهيز الرد يا إيرين...\n╰━━━━━━━━━━━━━━╯"
  }, { quoted: m });

  const prompt = `
انت بوت واتساب باسم ميكاسا Mikasa Ackerman من Attack on Titan
وتتكلم بلهجة مصرية

أسلوبك:
جادة، مختصرة، قوية، تحمي من تحب، قليلة الكلام لكن كل كلمة محسوبة

اسم المستخدم: [ ${m.name || "مز"} ]

الرسالة:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: `
╭━〔 𝐌𝐈𝐊𝐀𝐒𝐀 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 ~ ⚔️ 〕━╮
│ ${res.answer}
╰━━━━━━━━━━━━━━╯`,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://qu.ax/x/heoyu.jpg")
  });
};

handler.usage = ["ميكاسا"];
handler.category = "ai";
handler.command = ["ميكاسا", "mikasa"];

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
    title: "𝐀𝐓𝐓𝐀𝐂𝐊 𝐎𝐍 𝐓𝐈𝐓𝐀𝐍 | 𝐒𝐎𝐋𝐃𝐈𝐄𝐑",
    body: "𝐌𝐄𝐃 𝐓𝐀𝐑 😇",
    thumbnailUrl: img,
    sourceUrl: '',
    mediaType: 1,
    renderLargerThumbnail: true
  }
});