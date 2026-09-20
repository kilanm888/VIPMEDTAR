const handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply("وين الرسالة ")
  m.quoted.delete()
 // m.delete()
};

handler.command = ["حذف"];
handler.usage = ['حذف'];
handler.category = "admin";
handler.admin = true;

export default handler;