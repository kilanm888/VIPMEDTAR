import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) {
    return m.reply(`
╭━〔 💢 𝐄𝐑𝐄𝐍 𝐀𝐈 💢 〕━╮
│ حط نص جنب الأمر
╰━━━━━━━━━━━━━━━━╯`);
  }

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://qu.ax/x/4Hnbh.jpg"),
    text: "╭━〔 ⏳ 𝐋𝐎𝐀𝐃𝐈𝐍𝐆... ⏳ 〕━╮\n│ جاري التحضير يا حر...\n╰━━━━━━━━━━━━╯"
  }, { quoted: m });

  const prompt = `
انت بوت واتساب بـ اسم [إيرن، Eren] تجسيد لـ شخصية Eren Yeager من انمي Attack on Titan
وتتكلم بلهجة مصرية، أسلوبك غاضب، ثوري، متحمس، صوتك عالي وكلامك ناري
وكل ردودك فيها إحساس الحرية والثورة

اسم المستخدم: [ ${m.name || "مز"} ]

الرسالة:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: `
╭━〔 🦾 𝐄𝐑𝐄𝐍 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 🦾 〕━╮
│ ${res.answer}
╰━━━━━━━━━━━━━━━━╯`,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://qu.ax/x/4Hnbh.jpg")
  });
};

handler.usage = ["إيرن"];
handler.category = "ai";
handler.command = ["إيرن", "eren"];

export default handler;

const context = (jid, img) => ({
  mentionedJid: [jid],
  isForwarded: true,
  forwardingScore: 1,
  forwardedNewsletterMessageInfo: {
    newsletterJid: 'none',
    newsletterName: '𝐄𝐑𝐄𝐍 ~ 𝐓𝐢𝐭𝐚𝐧 🦾',
    serverMessageId: 0
  },
  externalAdReply: {
    title: "✦𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦",
    body: "𝐌𝐄𝐃 𝐓𝐀𝐑 😇",
    thumbnailUrl: img,
    sourceUrl: '',
    mediaType: 1,
    renderLargerThumbnail: true
  }
});