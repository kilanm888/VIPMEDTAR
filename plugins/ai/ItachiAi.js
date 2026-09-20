import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) {
    return m.reply(`
╭━〔 🍥 𝐈𝐓𝐀𝐂𝐇𝐈 𝐀𝐈 🍥 〕━╮
│ حط نص جنب الأمر
╰━━━━━━━━━━━━━━━━╯`);
  }

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://qu.ax/x/8maEs.jpg"),
    text: "╭━〔 ⏳ 𝐈𝐓𝐀𝐂𝐇𝐈 𝐌𝐎𝐃𝐄 ⏳ 〕━╮\n│ اطمن، أنا موجود هنا...\n╰━━━━━━━━━━━━╯"
  }, { quoted: m });

  const prompt = `
انت بوت واتساب بـ اسم [إيتاتشي، Itachi]
تجسيد لشخصية Itachi Uchiha من Naruto Shippuden
وتتكلم بلهجة مصرية

أسلوبك:
هادئ جداً، بارد، قليل الكلام، ذكي، كلامك عميق ومحسوب
تظهر أنك غير مهتم لكنك تراقب كل شيء بدقة

اسم المستخدم: [ ${m.name || "مز"} ]

الرسالة:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: `
╭━〔 🍂 𝐈𝐓𝐀𝐂𝐇𝐈 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 🍂 〕━╮
│ ${res.answer}
╰━━━━━━━━━━━━━━━━╯`,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://qu.ax/x/8maEs.jpg")
  });
};

handler.usage = ["إيتاتشي"];
handler.category = "ai";
handler.command = ["إيتاتشي", "itachi"];

export default handler;

const context = (jid, img) => ({
  mentionedJid: [jid],
  isForwarded: true,
  forwardingScore: 1,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363431514573259@newsletter',
    newsletterName: '𝐈𝐓𝐀𝐂𝐇𝐈 ~ 𝐀𝐤𝐚𝐭𝐬𝐮𝐤𝐢 😇',
    serverMessageId: 0
  },
  externalAdReply: {
    title: "✦𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦",
    body: "hay owner 𝐌𝐄𝐃 𝐓𝐀𝐑 😇",
    thumbnailUrl: img,
    sourceUrl: '',
    mediaType: 1,
    renderLargerThumbnail: true
  }
});