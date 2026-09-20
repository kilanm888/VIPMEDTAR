const handler = async (m, { conn, args }) => {

const metadata = await conn.groupMetadata(m.chat);
const participants = metadata.participants;

const groupAdmins = participants
.filter(p => p.admin)
.map(p => p.id);

const groupMembers = participants
.filter(p => !p.admin)
.map(p => p.id);

const shuffledAdmins = [...groupAdmins]
.sort(() => Math.random() - 0.5);

const shuffledMembers = [...groupMembers]
.sort(() => Math.random() - 0.5);

let messageText = "";

messageText += `
╭━━━〔 🎭 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 🎭 〕━━━╮
┃
┃ 🫠 الـاســم : ${metadata.subject}
┃ 🥱 التـاريـخ : ${new Date().toLocaleDateString('ar-EG')}
┃ 👥 الأعـضـاء : ${participants.length}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

`;

messageText += `
╭━━━〔 👑 الـمـشـرفـيـن 👑 〕━━━╮
`;

shuffledAdmins.forEach((admin, index) => {
messageText += `┃ ✦ ${index + 1} ↬ @${admin.split('@')[0]}\n`;
});

messageText += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

messageText += `
╭━━━〔 👥 الأعـضـاء 👥 〕━━━╮
`;

shuffledMembers.forEach((member, index) => {
messageText += `┃ ✦ ${index + 1} ↬ @${member.split('@')[0]}\n`;
});

messageText += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

messageText += `
╭━━━〔 📊 الإحـصـائـيـات 📊 〕━━━╮
┃
┃ 👑 عدد المشرفين : ${shuffledAdmins.length}
┃ 👥 عدد الأعضاء : ${shuffledMembers.length}
┃ ✨ الإجمالي : ${participants.length}
┃
╰━━━━━━━━━━━━━━━━━━━━╯
`;

return conn.sendMessage(m.chat, {
text: messageText,
mentions: participants.map(p => p.id)
});

};

handler.usage = ["منشن"];
handler.category = "admin";
handler.command = ["منشن", "منشنز", "mention"];
handler.admin = true;

export default handler;