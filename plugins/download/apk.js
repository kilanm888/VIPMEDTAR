import axios from 'axios';

let handler = async (m, { conn, text, command }) => {

    if (!text) {
        await conn.sendMessage(m.chat, {
            text: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🔍 اكتب اسم التطبيق جنب الأمر
┃
┃ 💡 مثال :
┃ .${command} Instagram
╰━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
        return;
    }

    try {
        await conn.sendMessage(m.chat, {
            react: { text: "📥", key: m.key }
        });

        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(text)}/limit=1`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.datalist || !data.datalist.list || !data.datalist.list.length) {
            await conn.sendMessage(m.chat, {
                text: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ مـلـقـيـتـش أي تـطـبـيـق
┃ 🔎 جرب اسم ثاني
╰━━━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
            return;
        }

        const app = data.datalist.list[0];
        const sizeMB = (app.size / (1024 * 1024)).toFixed(2);

        const caption = `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 📱 الـتـطـبـيـق : ${app.name}
┃ 📦 الـبـاكـج : ${app.package}
┃ 📅 آخـر تـحـديـث : ${app.updated}
┃ 💾 الـحـجـم : ${sizeMB} MB
╰━━━━━━━━━━━━━━━━━━╯

> 🌌 تـم الـتـحـمـيـل بـواسـطـة 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 ✨`;

        await conn.sendMessage(m.chat, {
            react: { text: "⚡", key: m.key }
        });

        await conn.sendMessage(m.chat, {
            document: { url: app.file.path_alt },
            fileName: `${app.name}.apk`,
            mimetype: 'application/vnd.android.package-archive',
            caption: caption,
            contextInfo: {
                externalAdReply: {
                    title: `✨️ ${app.name} APK ✨️`,
                    body: "𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 ~ 𝐀𝐏𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 📥",
                    mediaType: 1,
                    sourceUrl: app.file.path_alt,
                    thumbnailUrl: app.icon,
                    renderLargerThumbnail: true,
                    showAdAttribution: false
                }
            }
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error(e);

        await conn.sendMessage(m.chat, {
            text: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ حـصـل خـطـأ أثـنـاء الـتـحـمـيـل
┃ ⚠️ ${e.message}
╰━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }
}

handler.usage = ["تطبيق", "apk"];
handler.category = "downloads";
handler.command = ["تطبيق", "apk"];
handler.limit = true;
handler.args = true;

export default handler;