const CATEGORIES = [
    [1, '┃𓆩✨ التـحـمـيـل ✨𓆪', 'downloads', '⏳️'],
    [2, '┃𓆩⚡ الـمـجـمـوعـات ⚡𓆪', 'group', '🪀'],
    [3, '┃𓆩🪄 الـمـلـصـقـات 🪄𓆪', 'sticker', '😗'],
    [4, '┃𓆩🧠 الـمـطـوريـن 🧠𓆪', 'owner', '🧑‍💻'],
    [5, '┃𓆩💠 امـثـلـه 💠𓆪', 'example', '🫟'],
    [6, '┃𓆩🧰 الـادوات 🧰𓆪', 'tools', '💞'],
    [7, '┃𓆩🔎 الـبـحـث 🔎𓆪', 'search', '🥱'],
    [8, '┃𓆩🛡️ الادمــن 🛡️𓆪', 'admin', '🫠'],
    [9, '┃𓆩🎮 الالــعـاب 🎮𓆪', 'games', '🏏'],
    [10, '┃𓆩🍳 الچيف 🍳𓆪', 'gif', '🧧'],
    [11, '┃𓆩💰 الـبــنـك 💰𓆪', 'bank', '🏦'],
    [12, '┃𓆩🧠 الـذكـاء الاصـطـنـاعـي 🧠𓆪', 'ai', '🤖'],
    [13, '┃𓆩🤖 الـبـوتـات الـفـرعـي 🤖𓆪', 'sub', '✨️'],
    [14, '┃𓆩📡 مـعـلومـات الـبـوت 📡𓆪', 'info', '🤷‍♂️'],
    [15, '┃𓆩🏷️ الـالــقــاب 🏷️𓆪', 'nicknames', '🥳'],
    [16, '┃𓆩🎭 الـلـوجـوهــات 🎭𓆪', 'logos', '🎬'],
    [17, '┃𓆩🎧 تـغـيـر الاصـوات 🎧𓆪', 'voices', '🔉'],
    [18, '┃𓆩📁 أخــرى 📁𓆪', 'other', '☠️']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

const getImg = (bot) => {
    const { images } = bot.config.info;
    return Array.isArray(images) ? images[Math.floor(Math.random() * images.length)] : images;
};

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: 'none',
        newsletterName: '✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "✦𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦",
        body: "هاذا بوت واتساب اسمه ✦𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦ تم تطويره بواسطة 𝐌𝐄𝐃 𝐓𝐀𝐑",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

async function handler(m, { conn, bot, command, args }) {
    const selected = parseInt(args[0]);
    const now = new Date();
    const uptimeSeconds = process.uptime();
const hours = Math.floor(uptimeSeconds / 3600);
const minutes = Math.floor((uptimeSeconds % 3600) / 60);
const seconds = Math.floor(uptimeSeconds % 60);
const uptimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    if (!selected && !args[0]) {
        const sections = [{
            title: "✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️",
            rows: CATEGORIES.map(c => ({
                title: `${c[0]} ~ ${c[1]} ${c[3]}`,
                description: `اضغط هنا لعرض اوامر قسم ${c[1]}`,
                id: `.${command} ${c[0]}`
            }))
        }];

        const menuText = `
*مرحبا انا 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 النظام الذكي الذي طورني المطور : 𝐌𝐄𝐃 𝐓𝐀𝐑*
╭━━━〔 ✦𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦ 〕━━━╮
┃ 🪀︙كيفك → *[ @${m.sender.split("@")[0]} ]*
┃ 🥱︙ الوقت الحين → ${uptimeFormatted}
┃ ⏳️︙ الـتـاريـخ الحين → ${date} - ${time}
╰━━━━━━〔 ✦𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦ 〕━━━━━━━━╯
> *مرحبا بك في  𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 المطور : 𝐌𝐄𝐃 𝐓𝐀𝐑 *`;
        
        await conn.sendButtonNormal(m.chat, {
media: { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663618157387/swKhuOMbakQoDpfA.mp4" },
mediaType: 'video',
            caption: menuText,
            buttons: [{
                name: "single_select",
                params: {
                    title: "✨*𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓*✨",
                    sections: sections
                }
            }],
            mentions: [m.sender],
            newsletter: {
                name: '𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓',
                jid: 'none@newsletter'
            }
        }, global.reply_status);
        return;
    }

    const cat = getCat(selected);
    if (!cat) {
        await conn.sendMessage(m.chat, { text: '*〔 ✦اختار من القائمة فقط ✦ 〕*', contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        return;
    }

    const cmds = await bot.getAllCommands();
    const categoryCmds = cmds.filter(c => c.category === cat[2]);
    
    if (!categoryCmds.length) {
        await conn.sendMessage(m.chat, { text: '*✦ لايوجد شيئ هنا ✦ *', contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        return;
    }

    const cmdsList = categoryCmds.map(c => `${cat[3]} /${c.usage?.join(`\n${cat[3]} /`)}`).join('\n');

    await conn.sendMessage(m.chat, { text: `
╭━━━〔 ✦${cat[3]}✦ 〕━━━╮
┃ *🎭︙ قـسـم ${cat[1]} ${cat[3]}*
╰━━━━━━〔 ✦${cat[3]}✦ 〕━━━━━━━━╯

${cmdsList}

╭━━━〔 ✦${cat[3]}✦ 〕━━━╮
┃ *🎭︙𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ${bot?.config?.info?.nameBot || '𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓'}*
╰━━━━━━〔 ✦${cat[3]}✦ 〕━━━━━━━━╯
> *𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓*`.trim(), contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
}

handler.command = ['بوت', 'اوامر'];
export default handler;
