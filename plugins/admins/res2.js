const kaito = `
╭━━━〔 🎩✨ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✨🎩 〕━━━╮
┃ ⚡ نظام إدارة الطلبات ⚡
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

`;

const handler = async (m, { conn }) => {

const req = await conn.groupRequestParticipantsList(m.chat);

if (!req?.length) {
return m.reply(
kaito + `
╭━━━〔 📭 الـطـلـبـات 📭 〕━━━╮
┃ ✦ لا توجد طلبات حالياً
╰━━━━━━━━━━━━━━━━━━━━╯
`
);
}

const arg = parseInt(m.text.split(" ")[1]);
const limit = Number.isFinite(arg) && arg > 0 ? arg : req.length;

const list = req.slice(0, limit);

for (let r of list) {
await conn.groupRequestParticipantsUpdate(
m.chat,
[r.phone_number],
"approve"
);
}

m.reply(
kaito + `
╭━━━〔 ✅ تـم الـقـبـول ✅ 〕━━━╮
┃
┃ ✦ تم قبول ${list.length} طلب
┃ 📊 إجمالي الطلبات : ${req.length}
┃
╰━━━━━━━━━━━━━━━━━━━━╯
`
);

};

handler.command = ["اقبل_ريكوستات"];
handler.usage = ['اقبل_ريكوستات', 'اقبل_الطلبات'];
handler.category = "admin";
handler.admin = true;
handler.botAdmin = true;

export default handler;