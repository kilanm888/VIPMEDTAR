let handler = async (m, { conn }) => {

    try {

        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ""

        if (!mime.includes("video")) {
            return m.reply("📌 رد على فيديو لتحويله إلى ملاحظة")
        }

        await m.reply("⏳ جاري تحويل الفيديو إلى ملاحظة...")

        let media = await q.download()

        await conn.sendMessage(m.chat, {
            video: media,
            mimetype: "video/mp4",
            gifPlayback: false,
            ptv: true, // مهم لبعض النسخ
            caption: "🎥 ملاحظة فيديو"
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply("❌ فشل التحويل، تأكد أن الفيديو مدعوم")
    }
}

handler.usage = ["لملاحظة"];
handler.command = ["لملاحظة", "ملاحظة"];
handler.category = "tools";

export default handler;
