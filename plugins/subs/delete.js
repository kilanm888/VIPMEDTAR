const run = async (m, { args, conn, bot }) => {
  const sub = global.subBots;
  if (!sub) return m.reply("❌ نظام البوتات الفرعية غير متاح");

  if (!args[0]) {
    return m.reply(`
╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ 🗑️ حذف بوت فرعي
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📌 مثال الاستخدام 〕━━━╮
┃ ${bot.config.prefix[0]}حذف_بوت 1
┃ ${bot.config.prefix[0]}حذف_بوت 22242203253
╰━━━━━━━━━━━━━━━━━━━━━━╯
`);
  }

  const input = args[0];
  let deleted = false;

  if (/^\d+$/.test(input) && input.length <= 2) {
    const idx = parseInt(input);
    try {
      await sub.removeByIndex(idx);
      deleted = true;
    } catch (e) {
      return m.reply(`
╭━━━〔 ❌ خطأ 〕━━━╮
┃ ${e.message}
╰━━━━━━━━━━━━━━╯
`);
    }
  } 
  else if (/^\d+$/.test(input)) {
    deleted = await sub.removeByPhone(input);
    if (!deleted) {
      return m.reply(`
╭━━━〔 ❌ غير موجود 〕━━━╮
┃ لا يوجد بوت بهذا الرقم
┃ ${input}
╰━━━━━━━━━━━━━━╯
`);
    }
  }

  if (deleted) {
    await m.reply(`
╭━━━〔 ✅ تم الحذف 〕━━━╮
┃ تم حذف البوت بنجاح
╰━━━━━━━━━━━━━━╯
`);
  }
};

run.command = ["حذف_بوت"];
run.usage = ["حذف_بوت"];
run.category = "sub";
run.noSub = true;
export default run;