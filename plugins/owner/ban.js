import fs from 'fs';
import path from 'path';

const ff = async (m, { conn, text, command }) => {
    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    
    if (!target && text?.includes('@')) {
        target = text.replace('@', '') + '@s.whatsapp.net';
    }
    
    if (!target) {
        return m.reply(`*🤞 منشن شخص يا سيدي 🪀 مثال : /${command} @${m.sender.split('@')[0]} 🎭*`);
    }
    
    const jid = await m.lid2jid(target);
    const user = global.db.users[jid] || {};
    
    const isUnban = command === "حمار" || command === "فك";
    
    if (isUnban) {
        if (user.banned) {
            delete user.banned;
            await conn.sendMessage(m.chat, { 
                text: `*سيدي الحمار دا ماينفع يترد ثاني للبوت بس بأمرك هردو 🤞 @${target.split('@')[0]}*\n> *لقد عفا عنك سيدي مرحبا بك مرة اخرى في نظام ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ استمتع*`, 
                mentions: [target] 
            });
        } else {
            m.reply(`*❌ ~هذا المستخدم ليس محظوراً*`);
        }
        return;
    }
    
    user.banned = true;
    await conn.sendMessage(m.chat, { 
        text: `*حاضر مطوري تم حظره @${target.split('@')[0]}*\n> *يا حمار اخرج من نظام ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ امر مطوري 🫡*`, 
        mentions: [target] 
    });
};

ff.usage = ["حمار", "فك"];
ff.category = "owner";
ff.command = ["حمار", "فك", "فتح"];
ff.owner = true;

export default ff;