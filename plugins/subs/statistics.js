const run = async (m, { conn, bot }) => {
  const sub = global.subBots;
  if (!sub) return m.reply("❌ نظام البوتات الفرعية غير متاح");

  const stats = sub.stats();
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  const text = `🏏 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ♧ إحصائيات البوتات الفرعية ✨️
╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦ 〕━━━╮
➤ — الإجمالي: ${stats.total}
➤ — المتصلين: ${stats.connected}
➤ — غير المتصلين: ${stats.disconnected}
➤ — الرسائل: ${stats.totalMessages}
╰━━━━━━━━━━━━━━━━━━━━━━╯
⏱️ — مدة التشغيل: ${days} يوم ${hours} ساعة ${minutes} دقيقة
╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦ 〕━━━╮
🏏 — البوت الرئيسي: ${bot.sock.user.id.split('@')[0]}
╰━━━━━━━━━━━━━━━━━━━━━━╯
> *𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 😇 نظام البوتات الفرعية*`;

  await m.reply(text);
};

run.command = ["احصائيات"];
run.noSub = true;
run.usage = ["احصائيات"];
run.category = "sub";
export default run;