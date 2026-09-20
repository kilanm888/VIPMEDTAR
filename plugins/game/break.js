handler.before = async (m, { conn }) => {
    if (!m.text || !global.break?.games[m.chat] || !global.break?.scores[m.chat]) return;

    const game = global.break.games[m.chat];
    const player = m.sender;
    
    if (m.text.trim() !== game.answer) return;

    clearTimeout(game.timeout);
    delete global.break.games[m.chat];

    if (!global.break.scores[m.chat][player]) global.break.scores[m.chat][player] = 0;
    global.break.scores[m.chat][player]++;
    
    let total = 0;
    for (let id in global.break.scores[m.chat]) {
        total += global.break.scores[m.chat][id];
    }
    
    if (total >= 20) {
        const entries = Object.entries(global.break.scores[m.chat])
            .sort((a, b) => b[1] - a[1]);
        
        const sorted = entries.map(([id, score], i) => 
            `${i+1}. @${id.split('@')[0]} - ${score} نقطة`
        );
        
        const mentions = entries.map(([id]) => id);
        
        const winner = entries[0][0];
        if (global.db?.users[winner]) {
            global.db.users[winner].xp = (global.db.users[winner].xp || 0) + 500;
            global.db.users[winner].cookies = (global.db.users[winner].cookies || 0) + 10;
        }
        
        await conn.sendMessage(m.chat, { 
            text: `╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ 🏆 نتائج لعبة التفكيك
╰━━━━━━━━━━━━━━━━━━━━━━╯

${sorted.join('\n')}

╭━━━〔 🎉 الفائز 🎉 〕━━━╮
┃ @${winner.split('@')[0]}
┃ 💰 +500 XP
┃ 🍪 +10 كوكيز
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            mentions
        });

        delete global.break.scores[m.chat];
        return;
    }

    await m.reply(`╭━━━〔 🎯 نقطة جديدة 🎯 〕━━━╮
┃ ✅ إجابة صحيحة!
┃ 📊 نقاطك: ${global.break.scores[m.chat][player]}
╰━━━━━━━━━━━━━━━━━━━━━━╯`);

    handler(m, { conn });
};

async function handler(m, { conn }) {
    if (!global.break) global.break = { games: {}, scores: {} };

    if (global.break.games[m.chat]) {
        clearTimeout(global.break.games[m.chat].timeout);
        delete global.break.games[m.chat];
    }

    const data = await (await fetch("https://raw.githubusercontent.com/Xov445447533/Xov11111/master/src/JSON/venom-تفكيك.json")).json();
    const q = data[Math.floor(Math.random() * data.length)];
    
    m.reply(`
╭━━━〔 🔨 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 🔨 〕━━━╮
┃ ❓ ${q.question}
╰━━━━━━━━━━━━━━━━━━━━━━╯

┃ ⏱️ لديك 30 ثانية للإجابة
┃ 🎯 اكتب الإجابة بسرعة
╰━━━━━━━━━━━━━━━━━━━━━━╯`);

    if (!global.break.scores[m.chat]) global.break.scores[m.chat] = {};
    
    global.break.games[m.chat] = {
        answer: q.response,
        timeout: setTimeout(() => {
            if (global.break.games[m.chat]) {
                delete global.break.games[m.chat];
                delete global.break.scores[m.chat];
                m.reply(`╭━━━〔 ⏰ انتهى الوقت ⏰ 〕━━━╮
┃ ❌ لم يتم العثور على فائز
╰━━━━━━━━━━━━━━━━━━━━━━╯`);
            }
        }, 30000)
    };
}

handler.usage = ["تفكيك"];
handler.category = "games";
handler.command = ['تفكيك'];
export default handler;