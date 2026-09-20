import axios from 'axios'

const handler = async (m, { conn, text }) => {
  try {
    if (!text?.trim()) {
      return m.reply(
        '📸 أرسل الرابط بعد الأمر\n\nمثال:\n.سكرين https://google.com'
      )
    }

    let url = text.trim()

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    try {
      new URL(url)
    } catch {
      return m.reply('❌ الرابط غير صحيح.')
    }

    await m.reply('📸 جاري أخذ لقطة للشاشة...')

    const api = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1366`

    const response = await axios.get(api, {
      responseType: 'arraybuffer',
      timeout: 90000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const image = Buffer.from(response.data)

    if (!image || image.length < 1000) {
      throw new Error('لم يتم الحصول على صورة من خدمة السكرين.')
    }

    await conn.sendMessage(
      m.chat,
      {
        image,
        caption: `📸 تم أخذ لقطة الشاشة بنجاح\n\n🔗 ${url}`
      },
      { quoted: m }
    )

  } catch (e) {
    console.error('SCREEN ERROR:', e)

    await m.reply(
      `❌ فشل أمر السكرين\n\nالخطأ:\n${e?.message || e}`
    )
  }
}

handler.command = ['سكرين', 'screen', 'screenshot']
handler.category = 'tools'

export default handler