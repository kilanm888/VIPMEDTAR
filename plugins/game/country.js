async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};
    
    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }
    
    const res = await fetch("https://gist.githubusercontent.com/Kyutaka101/799d5646ceed992bf862026847473852/raw/dcbecff259b1d94615d7c48079ed1396ed42ef67/gistfile1.txt");
    const data = await res.json();
    const country = data[Math.floor(Math.random() * data.length)];
    
    const msg = await conn.sendMessage(m.chat, {
        image: { url: country.img },
        caption: `╭━━━〔 🌍 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 🌍 〕━━━╮
┃ 🎯 لعبة خمن العلم
╰━━━━━━━━━━━━━━━━━━━━━━╯

┃ ⏳ لديك 30 ثانية للإجابة
┃ ✍️ اكتب اسم الدولة فقط
╰━━━━━━━━━━━━━━━━━━━━━━╯`
    });
    
    global.gameActive[m.chat] = {
        answer: country.name.toLowerCase(),
        image: country.img,
        msgId: msg.key.id,
        timeout: setTimeout(() => {
            if (global.gameActive[m.chat]) {
                const answer = global.gameActive[m.chat].answer;
                delete global.gameActive[m.chat];
                conn.sendMessage(m.chat, { 
                    text: `╭━━━〔 ⏰ انتهى الوقت ⏰ 〕━━━╮
┃ ❌ لم يتمكن أحد من الإجابة
┃ 🧠 الإجابة الصحيحة: ${answer}
╰━━━━━━━━━━━━━━━━━━━━━━╯`
                });
            }
        }, 30000)
    };
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return;
    if (!global.gameActive?.[m.chat]) return;
    
    const game = global.gameActive[m.chat];
    if (m.quoted.id !== game.msgId) return;
    
    if (m.text.toLowerCase().trim() === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];
        
        if (global.db?.users[m.sender]) {
            global.db.users[m.sender].xp = (global.db.users[m.sender].xp || 0) + 100;
            global.db.users[m.sender].cookies = (global.db.users[m.sender].cookies || 0) + 2;
        }
        
        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `╭━━━〔 🎉 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 🎉 〕━━━╮
┃ ✅ إجابة صحيحة!
┃ 💰 +100 XP
┃ 🍪 +2 كوكيز
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        });
        return true;
    }
    
    await m.reply(`╭━━━〔 ❌ خطأ ❌ 〕━━━╮
┃ حاول مرة أخرى
╰━━━━━━━━━━━━━━━━━━━━━━╯`);
    
    return true;
};

handler.usage = ["علم"];
handler.category = "games";
handler.command = ['علم', 'country'];

export default handler;