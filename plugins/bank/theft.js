const cooldown = new Map();

const handler = async (m, { conn }) => {
    const target = await m.lid2jid(m.quoted?.sender) || m.mentionedJid?.[0];
    
    if (!target) return m.reply(`╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ 🕊️ رد على رسالة العضو أو منشنه
┃ 📌 مثال: .سرقة @user
╰━━━━━━━━━━━━━━━━━━━━━━╯`);

    if (target === m.sender) return m.reply(`╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ ❌ لا يمكنك سرقة نفسك
╰━━━━━━━━━━━━━━━━━━━━━━╯`);
    
    const userTarget = global.db?.users[target];
    if (!userTarget?.xp) return m.reply(`╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ ❌ هذا العضو ليس لديه نقاط
╰━━━━━━━━━━━━━━━━━━━━━━╯`);

    if (userTarget.xp < 50) return m.reply(`╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ 🤲 هذا حرام هاذا العضو فقير
┃ 💰 لديه فقط ${userTarget.xp} نقطة
┃ 🪙 اجعله يجمع أكثر بدل سرقتهً
╰━━━━━━━━━━━━━━━━━━━━━━╯`);
    
    const now = Date.now();
    const lastSteal = cooldown.get(m.sender) || 0;

    if (now - lastSteal < 3600000) {
        const remaining = Math.ceil((3600000 - (now - lastSteal)) / 60000);
        return m.reply(`╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ ⏳ انتظر ${remaining} دقيقة
┃ 🔒 قبل محاولة السرقة مرة أخرى
╰━━━━━━━━━━━━━━━━━━━━━━╯`);
    }
    
    const userSender = global.db.users[m.sender] || {};
    const stealAmount = Math.floor(Math.random() * 201) + 100;
    const success = Math.random() < 0.7;
    
    cooldown.set(m.sender, now);
    
    if (!success) {
        const penalty = Math.floor(stealAmount / 2);
        userSender.xp = Math.max(0, (userSender.xp || 0) - penalty);

        const pic = await conn.profilePictureUrl(m.sender, 'image')
            .catch(() => 'https://i.postimg.cc/B66Ln6xd/IMG-20260428-WA0076.webp');

        await conn.sendMessage(m.chat, {
            image: { url: pic },
            caption: `╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ ❌ فشلت العملية
┃ 🚨 تم اكتشافك!
┃ 💸 خسرت ${penalty} نقطة
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 ⚠️ تحذير ⚠️ 〕━━━╮
┃ ⏳ حاول مرة أخرى بعد ساعة
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: reply_status });

        return;
    }
    
    if (userTarget.xp < stealAmount) {
        const available = userTarget.xp;
        userSender.xp = (userSender.xp || 0) + available;
        userTarget.xp = 0;

        const pic = await conn.profilePictureUrl(m.sender, 'image')
            .catch(() => 'https://i.postimg.cc/B66Ln6xd/IMG-20260428-WA0076.webp');

        await conn.sendMessage(m.chat, {
            image: { url: pic },
            caption: `╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ ✅ نجحت السرقة
┃ 💰 حصلت على ${available} نقطة
┃ ⚠️ تم أخذ كل ما يملكه
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🎪 نتيجة العملية 🎪 〕━━━╮
┃ 👤 الهدف: @${target.split('@')[0]}
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            contextInfo: { mentionedJid: [m.sender, target] }
        }, { quoted: reply_status });

        return;
    }
    
    userTarget.xp -= stealAmount;
    userSender.xp = (userSender.xp || 0) + stealAmount;
    
    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.pinimg.com/originals/11/26/97/11269786cdb625c60213212aa66273a9.png');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption: `╭━━━〔 ✦ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ✦ 〕━━━╮
┃ ✅ نجحت السرقة
┃ 💰 +${stealAmount} نقطة
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🎯 العملية تمت 🎯 〕━━━╮
┃ 👤 الهدف: @${target.split('@')[0]}
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        contextInfo: { mentionedJid: [m.sender, target] }
    }, { quoted: reply_status });
};

handler.usage = ["سرقة"];
handler.category = "games";
handler.command = ["سرقة", "steal"];

export default handler;