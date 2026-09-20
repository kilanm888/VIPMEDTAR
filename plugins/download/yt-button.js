const handler = async (m, { conn, text }) => {

    if (!text) return m.reply(`
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 🔎 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐒𝐄𝐀𝐑𝐂𝐇 🎭 〕━━━╮
┃ 💙 اكـتـب اسـم الـفـيـديـو أو الأغـنـيـة
┃
┃ 🎵 مـثـال:
┃ .اغنيه Naruto Blue Bird
╰━━━━━━━━━━━━━━━━━━━━╯`);

    const res = await fetch(
      `https://emam-api.web.id/home/sections/Search/api/YouTube/search?q=${text}`
    );

    const { data } = await res.json();

    const {
      title,
      image,
      timestamp: time,
      url
    } = data[0];

    await conn.sendButton(m.chat, {

        imageUrl: image,

        bodyText: `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 🎬 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐑𝐄𝐒𝐔𝐋𝐓 🎭 〕━━━╮
┃ 📽️ الـعـنـوان:
┃ ${title}
┃
┃ ⏳ الـمـدة:
┃ ${time}
╰━━━━━━━━━━━━━━━━━━━━╯

> ✨ اخـتـر نـوع الـتـحـمـيـل مـن الأزرار بـالأسـفـل`,

        footerText:
          "🎩 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 ~ 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 🎭",

        buttons: [

            {
                name: "quick_reply",
                params: {
                    display_text:
                      "🎼 ╎ تـحـمـيـل صـوت",
                    id:
                      `.يوت_اغنيه ${url}`
                }
            },

            {
                name: "quick_reply",
                params: {
                    display_text:
                      "🎬 ╎ تـحـمـيـل فـيـديـو",
                    id:
                      `.يوتيوب ${url}`
                }
            }

        ],

        mentions: [m.sender],

        newsletter: {
            name:
              "𝐌𝐄𝐃 𝐓𝐀𝐑 😇",
            jid:
              "120363431514573259@newsletter"
        },

        interactiveConfig: {
            buttons_limits: 10,
            list_title: "",
            button_title: "",
            canonical_url: url
        }

    }, m);
};

handler.usage = [
  "فيديو",
  "اغنيه",
  "شغل"
];

handler.category = "downloads";

handler.command = [
  "اغنيه",
  "فيديو",
  "اغنية",
  "play",
  "video"
];

export default handler;