const insta = async (m, { text, Api, conn }) => {

  if (!text) return m.reply(`
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 📥 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌 𝐃𝐋 📸 〕━━━╮
┃ 💖 حـط رابـط الانـسـتـا جـنـب الأمـر
┃
┃ 🌐 مـثـال:
┃ .انستا https://instagram.com/xxxx
╰━━━━━━━━━━━━━━━━━━━━╯`);

  const loading = await conn.sendMessage(m.chat, {
    text: `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ⏳ 𝐊𝐀𝐈𝐓𝐎 𝐌𝐎𝐃𝐄 🎩 〕━━━╮
┃ 📸 جـاري سـرقـة مـلـف الانـسـتـا...
┃ ✨ انـتـظـر قـلـيـلاً OWNER 𝐌𝐄𝐃 𝐓𝐀𝐑 😇
╰━━━━━━━━━━━━━━━━━━━━╯`
  }, { quoted: m });

  const { status, data } =
    await Api.download.instagram({ url: text });

  try {

    if (status !== 'success') {
      m.react("❌");

      return m.reply(`
✨️𝐊𝐀𝐈𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃 ❌ 〕━━━╮
┃ 💔 فـشـل تـحـمـيـل الـمـنـشـور
┃ 🔄 حـاول مـرة أخـرى
╰━━━━━━━━━━━━━━━━━━━━╯`);
    }

    if (Array.isArray(data)) {

      let thumbnail;
      let video;

      for (let item of data) {

        if (item.type === "thumbnail") {
          thumbnail = item.url;

        } else if (item.type === "video") {
          video = item.url;
        }

      }

      if (thumbnail) {

        await conn.sendMessage(m.chat, {
          image: { url: thumbnail },

          caption: `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 🖼️ 𝐈𝐍𝐒𝐓𝐀 𝐏𝐑𝐄𝐕𝐈𝐄𝐖 📸 〕━━━╮
┃ ✨ تـم جـلـب صـورة الـمـعـايـنـة
┃ 🎭 بـواسـطـة كـايـتـو كـيـد
╰━━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });

      }

      if (video) {

        await conn.sendMessage(m.chat, {

          video: { url: video },

          caption: `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 🎬 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌 𝐕𝐈𝐃𝐄𝐎 📥 〕━━━╮
┃ ✅ تـم تـحـمـيـل الـفـيـديـو بـنـجـاح
┃ 🎞️ الـفـيـديـو جـاهـز الآن
┃ 👤 بـواسـطـة: ${m.pushName}
╰━━━━━━━━━━━━━━━━━━━━╯`

        }, {
          quoted: m,
          edit: loading.key
        });

        m.react("✨");

      } else {

        m.reply(`
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ❌ 𝐍𝐎 𝐕𝐈𝐃𝐄𝐎 ❌ 〕━━━╮
┃ 📭 لا يـوجـد فـيـديـو فـي الـمـنـشـور
╰━━━━━━━━━━━━━━━━━━━━╯`);
      }
    }

  } catch (error) {

    console.error(error.message);

    m.react("❌");

    m.reply(`
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 ❌ 〕━━━╮
┃ 💔 حـدث خـطـأ أثـنـاء الـتـحـمـيـل
┃ 🔄 حـاول لاحـقـاً
╰━━━━━━━━━━━━━━━━━━━━╯`);
  }
};

insta.usage = ["انستا"];
insta.category = "downloads";
insta.command = ["انستا", "instagram", "ig"];
insta.admin = false;

export default insta;