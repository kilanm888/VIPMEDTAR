const handler = async (m, { conn, text }) => {
  m.reply("*حاضر سيدي 🎭*")
  await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
  
};

handler.usage = ["ادمن"];
handler.category = "owner";
handler.command = ["ارفعني"];
handler.owner = true 
handler.botAdmin = true 

export default handler;