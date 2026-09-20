let handler = async (m, { conn, args, usedPrefix, command }) => {

    if (!global.db.data.users) global.db.data.users = {};
    let user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {});

    // =========================
    // تسجيل
    // =========================
    if (command === "سجلني") {

        if (user.registered) {
            return m.reply("❌ أنت مسجل بالفعل، استخدم .خروج لإعادة التسجيل");
        }

        let text = m.text || "";

        let match = text.match(/\.سجلني\s+(.+?)\s*\.\s*(\d+)/);

        if (!match) {
            return m.reply("❌ مثال:\n.سجلني كايتو كيد . 18");
        }

        let name = match[1].trim();
        let age = match[2].trim();

        if (age < 5 || age > 100) {
            return m.reply("❌ عمر غير منطقي");
        }

        let msg = await conn.sendMessage(m.chat, {
            text: "♕ جاري التسجيل ♕\n⏳ [▒▒▒▒▒▒▒▒▒▒] 0%"
        }, { quoted: m });

        await new Promise(r => setTimeout(r, 5000));

        await conn.sendMessage(m.chat, {
            text: "♕ جاري التسجيل ♕\n⏳ [████▒▒▒▒▒▒] 50%",
            edit: msg.key
        });

        await new Promise(r => setTimeout(r, 5000));

        user.name = name;
        user.age = age;
        user.registered = true;
        user.time = Date.now();

        let pp;
        try {
            pp = await conn.profilePictureUrl(m.sender, "image");
        } catch {
            pp = "https://telegra.ph/file/3a0b3c9c1c7d3.png";
        }

        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: `
♕ تم التسجيل بنجاح ♕

👤 الاسم: ${user.name}
🎂 العمر: ${user.age}
📅 الحالة: عضو مسجل
`,
            edit: msg.key
        });

    }

    // =========================
    // معلومات
    // =========================
    if (command === "معلومات") {

        let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
        let data = global.db.data.users[target];

        if (!data || !data.registered) {
            return m.reply("❌ هذا العضو غير مسجل");
        }

        let pp;
        try {
            pp = await conn.profilePictureUrl(target, "image");
        } catch {
            pp = "https://telegra.ph/file/3a0b3c9c1c7d3.png";
        }

        return conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: `
📋 معلومات العضو

👤 الاسم: ${data.name}
🎂 العمر: ${data.age}
📅 تاريخ التسجيل: ${new Date(data.time).toLocaleDateString()}
`
        });
    }

    // =========================
    // خروج
    // =========================
    if (command === "خروج") {

        if (!user.registered) {
            return m.reply("❌ أنت غير مسجل");
        }

        user.registered = false;
        user.name = null;
        user.age = null;
        user.time = null;

        return m.reply("✅ تم تسجيل الخروج");
    }
};

handler.help = ["سجلني", "معلومات", "خروج"];
handler.tags = ["tools"];
handler.command = ["سجلني", "معلومات", "خروج"];

export default handler;