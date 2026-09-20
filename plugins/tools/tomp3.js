import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const toAudio = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🎬 رد على فيديو أولاً
╰━━━━━━━━━━━━━━━━━━╯`);
    }

    const tmp = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

    const video = path.join(tmp, `${Date.now()}.mp4`);
    const audio = path.join(tmp, `${Date.now()}.mp3`);

    fs.writeFileSync(video, await m.quoted.download());

    await execAsync(`ffmpeg -i "${video}" -vn -acodec libmp3lame "${audio}" -y`);

    await conn.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(audio),
        mimetype: "audio/mpeg",
        caption: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🎧 تـم الـتـحـويـل بـنـجـاح
┃ ───────────────
┃ 🔊 Audio Ready
╰━━━━━━━━━━━━━━━━━━╯`
      },
      { quoted: m }
    );

    fs.unlinkSync(video);
    fs.unlinkSync(audio);
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ خطأ في التحويل
┃ ───────────────
┃ ${e.message}
╰━━━━━━━━━━━━━━━━━━╯`
    });
  }
};

toAudio.usage = ["لصوت"];
toAudio.category = "tools";
toAudio.command = ["لصوت", "tomp3"];

export default toAudio;