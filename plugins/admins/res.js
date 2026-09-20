const kaito = `
╭━━━〔 🎩✨ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✨🎩 〕━━━╮
┃ ⚡ نظام إدارة المجموعات المتطور ⚡
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

`;

const handler = async (m, { conn }) => {

const req = await conn.groupRequestParticipantsList(m.chat);

if (!req?.length) {
return m.reply(
kaito + `
╭━━━〔 📭 الـطـلـبـات 📭 〕━━━╮
┃ ✦ لا توجد ريكوستات حالياً
╰━━━━━━━━━━━━━━━━━━━━╯
`
);
}

let text = req.map((r, i) =>
`┃ ✦ ${i + 1} ↬ @${r.phone_number.split("@")[0]}`
).join("\n");

await conn.sendMessage(m.chat, {
text:
kaito + `
╭━━━〔 📥 قـائـمـة الـريـكـوسـتـات 📥 〕━━━╮
${text}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📊 الإحـصـائـيـات 📊 〕━━━╮
┃ ✦ عدد الطلبات : ${req.length}
╰━━━━━━━━━━━━━━━━━━━━╯
`,
mentions: req.map(r => r.phone_number)
}, { quoted: global.reply_status });

};

handler.command = ["الريكوستات", "الطلبات"];
handler.usage = ['الريكوستات'];
handler.category = "admin";
handler.admin = true;
handler.botAdmin = true;

export default handler;