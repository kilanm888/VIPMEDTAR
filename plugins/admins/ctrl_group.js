const handler = async (m, { conn, command }) => {

  if (command === "قفل") {

    await conn.groupSettingUpdate(m.chat, 'announcement');

    m.reply(`
╭━━━〔 🔒 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 🔒 〕━━━╮
┃
┃ ✦ تم قفل الشـات بنجـاح
┃ ✦ الآن الأعضاء لا يمكنهم الإرسال
┃
╰━━━━━━━━━━━━━━━━━━╯
`);

  } else if (command === "فتح") {

    await conn.groupSettingUpdate(m.chat, 'not_announcement');

    m.reply(`
╭━━━〔 🔓 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 🔓 〕━━━╮
┃
┃ ✦ تم فتح الشـات بنجـاح
┃ ✦ يمكن لجميع الأعضاء الإرسال الآن
┃
╰━━━━━━━━━━━━━━━━━━━━╯
`);

  }

};

handler.usage = ["قفل", "فتح"];
handler.category = "admin";
handler.command = ["قفل", "فتح"];
handler.admin = true;
handler.botAdmin = true;

export default handler;