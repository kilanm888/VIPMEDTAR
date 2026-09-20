import crypto from 'crypto';
import cheerio from 'cheerio';
import axios from 'axios';
import qs from 'qs';

const ff = async (m, { text, conn }) => {

  if (!text) return m.reply(`
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 🎭 𝐓𝐈𝐊𝐓𝐎𝐊 𝐃𝐋 🎬 〕━━━╮
┃ 💖 حـط رابـط الـفـيـديـو جـنـب الأمـر
┃
┃ 🌐 مـثـال:
┃ .تيك https://vt.tiktok.com/xxxx
╰━━━━━━━━━━━━━━━━━━━━╯`);

  try {

    m.react('🎩');

    const loading = await conn.sendMessage(m.chat, {
      text: `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ⏳ 𝐊𝐀𝐈𝐓𝐎 𝐌𝐎𝐃𝐄 🎩 〕━━━╮
┃ 🎬 جـاري سـرقـة فـيـديـو الـتـيـك...
┃ ✨ انـتـظـر قـلـيـلاً OWNER 𝐌𝐄𝐃 𝐓𝐀𝐑 😇
╰━━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });

    const videoData = await downloadTikTok(text);

    if (!videoData.videoUrl && !videoData.audioUrl) {

      m.react('❌');

      return m.reply(`
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃 ❌ 〕━━━╮
┃ 💔 فـشـل تـحـمـيـل الـفـيـديـو
┃ 🔄 حـاول مـرة أخـرى
╰━━━━━━━━━━━━━━━━━━━━╯`);
    }

    if (videoData.videoUrl) {

      await conn.sendMessage(m.chat, {

        video: { url: videoData.videoUrl },

        caption: `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 🎬 𝐓𝐈𝐊𝐓𝐎𝐊 𝐕𝐈𝐃𝐄𝐎 🎭 〕━━━╮
┃ 👤 الـنـاشـر:
┃ ${videoData.author || "Unknown"}
┃
┃ 📝 الـوصـف:
┃ ${videoData.description || "No Description"}
┃
┃ ✨ تـم الـتـحـمـيـل بـنـجـاح
╰━━━━━━━━━━━━━━━━━━━━╯`

      }, {
        quoted: m,
        edit: loading.key
      });

    }

    if (videoData.audioUrl) {

      await conn.sendMessage(m.chat, {

        audio: { url: videoData.audioUrl },

        mimetype: 'audio/mpeg',

        fileName: 'kaito-kid-tiktok.mp3',

        ptt: false

      }, { quoted: m });

    }

    m.react('✨');

  } catch (error) {

    console.error(error.message);

    m.react('❌');

    m.reply(`
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 ❌ 〕━━━╮
┃ 💔 حـدث خـطـأ أثـنـاء الـتـحـمـيـل
┃ 🔄 حـاول لاحـقـاً
╰━━━━━━━━━━━━━━━━━━━━╯`);
  }
};

ff.usage = ["تيك"];
ff.category = "downloads";
ff.command = ["تيك", "tiktok", "tt"];

export default ff;

async function downloadTikTok(url) {

  let data = qs.stringify({
    'id': url,
    'locale': 'en',
    'tt': crypto.randomBytes(8).toString('hex'),
  });

  let config = {
    method: 'POST',
    url: 'https://ssstik.io/abc?url=dl',

    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    },

    data: data
  };

  const response = await axios.request(config);

  const $ = cheerio.load(response.data);

  return {
    author:
      $('h2').first().text().trim(),

    description:
      $('.maintext').text().trim(),

    videoUrl:
      $('a[href*="tikcdn.io"]:not(#hd_download)')
      .first()
      .attr('href'),

    audioUrl:
      $('.download_link.music').attr('href'),

    hdVideo:
      $('#hd_download').attr('href')
  };
}