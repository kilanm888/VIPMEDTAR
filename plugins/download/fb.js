import axios from 'axios'
import * as cheerio from 'cheerio'

const handler = async (m, { conn, text, command }) => {
  if (!text) {
    throw `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 🎭 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐃𝐋 🎬 〕━━━╮
┃ 💙 ضع رابط فيديو فيسبوك بعد الأمر
┃
┃ 🌐 مثال:
┃ /${command} https://facebook.com/reel/xxxx
╰━━━━━━━━━━━━━━━━━━━━╯`
  }

  await m.react('🎩')

  let loading

  try {
    loading = await conn.sendMessage(
      m.chat,
      {
        text: `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ⏳ 𝐊𝐀𝐈𝐓𝐎 𝐌𝐎𝐃𝐄 🎩 〕━━━╮
┃ 🎬 جاري جلب الفيديو...
┃ ⏳ انتظر قليلاً
╰━━━━━━━━━━━━━━━━━━━━╯`
      },
      { quoted: m }
    )

    // تنظيف الرابط
    const fbUrl = text.trim()

    if (!/^(https?:\/\/)?(www\.|m\.|mbasic\.|web\.)?(facebook\.com|fb\.watch)\//i.test(fbUrl)) {
      throw new Error('رابط فيسبوك غير صالح')
    }

    /*
     * FDownloader الحالي:
     * نستخدم ajaxSearch مباشرة بدون userVerify
     */
    const response = await axios.post(
      'https://v3.fdownloader.net/api/ajaxSearch',
      new URLSearchParams({
        q: fbUrl,
        lang: 'en',
        web: 'fdownloader.net',
        v: 'v2',
        w: ''
      }).toString(),
      {
        timeout: 30000,
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': '*/*',
          'Origin': 'https://fdownloader.net',
          'Referer': 'https://fdownloader.net/',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36'
        }
      }
    )

    /*
     * بعض الإصدارات ترجع:
     * { data: "HTML..." }
     *
     * وبعضها قد ترجع HTML مباشرة.
     */
    const html =
      typeof response.data?.data === 'string'
        ? response.data.data
        : typeof response.data === 'string'
          ? response.data
          : ''

    if (!html) {
      throw new Error('لم يتم الحصول على نتائج من FDownloader')
    }

    const $ = cheerio.load(html)

    const title =
      $('.detail h3').first().text().trim() ||
      $('.content h3').first().text().trim() ||
      'Facebook Video'

    const duration =
      $('.content p').first().text().trim() ||
      $('.detail p').first().text().trim() ||
      'غير معروف'

    const thumb =
      $('.thumbnail img').attr('src') ||
      $('.detail .thumbnail img').attr('src') ||
      ''

    /*
     * جمع جميع روابط الفيديو
     */
    const downloads = []

    $('.download-link-fb').each((_, el) => {
      const url = $(el).attr('href')

      if (!url) return

      let quality =
        $(el).attr('title') ||
        $(el).find('.video-quality').text() ||
        $(el).text()

      quality = quality
        .replace(/download/gi, '')
        .trim()

      downloads.push({
        quality: quality || 'Video',
        url
      })
    })

    /*
     * fallback إذا تغير HTML
     */
    if (!downloads.length) {
      $('a[href]').each((_, el) => {
        const url = $(el).attr('href') || ''

        if (
          url.includes('.mp4') ||
          url.includes('download') ||
          url.includes('video')
        ) {
          downloads.push({
            quality: $(el).text().trim() || 'Video',
            url
          })
        }
      })
    }

    if (!downloads.length) {
      throw new Error(
        'لم يتم العثور على رابط فيديو صالح. قد يكون الفيديو خاصًا أو الرابط غير مدعوم.'
      )
    }

    /*
     * نفضل HD ثم SD
     */
    const sorted = [...downloads].sort((a, b) => {
      const ahd = /hd|1080|720|high/i.test(a.quality)
      const bhd = /hd|1080|720|high/i.test(b.quality)

      if (ahd && !bhd) return -1
      if (!ahd && bhd) return 1

      return 0
    })

    let videoBuffer = null
    let selected = null

    /*
     * لا نرسل الرابط مباشرة إلى Baileys.
     *
     * نقوم بتنزيل الملف أولاً والتحقق من أنه
     * فيديو فعلي، وهذا يمنع مشكلة الفيديو التالف.
     */
    for (const item of sorted) {
      try {
        const videoResponse = await axios.get(item.url, {
          responseType: 'arraybuffer',
          timeout: 120000,
          maxContentLength: 100 * 1024 * 1024,
          maxBodyLength: 100 * 1024 * 1024,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36',
            'Accept':
              'video/mp4,video/*;q=0.9,*/*;q=0.8',
            'Referer':
              'https://fdownloader.net/'
          },
          validateStatus: status =>
            status >= 200 && status < 400
        })

        const contentType =
          videoResponse.headers['content-type'] || ''

        const buffer = Buffer.from(videoResponse.data)

        /*
         * التحقق من MP4:
         * ملف MP4 يحتوي غالبًا على ftyp
         * في أول 32 بايت تقريبًا.
         */
        const header = buffer
          .subarray(0, 64)
          .toString('latin1')

        const isMp4 =
          header.includes('ftyp') ||
          contentType.includes('video/')

        /*
         * إذا كان الرد HTML فهذا ليس فيديو.
         */
        const isHtml =
          contentType.includes('text/html') ||
          header.includes('<html') ||
          header.includes('<!DOCTYPE')

        if (!isHtml && isMp4 && buffer.length > 10000) {
          videoBuffer = buffer
          selected = item
          break
        }

      } catch (err) {
        console.log(
          'Facebook quality failed:',
          item.quality,
          err.message
        )
      }
    }

    if (!videoBuffer) {
      throw new Error(
        'روابط التحميل التي أعادها الموقع غير صالحة أو انتهت صلاحيتها.'
      )
    }

    const caption = `
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 🎬 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐕𝐈𝐃𝐄𝐎 🎬 〕━━━╮
┃ 📌 الـعـنـوان:
┃ ${title.slice(0, 300)}
┃
┃ ⏳ الـمـدة:
┃ ${duration || 'غير معروف'}
┃
┃ 🎞️ الـجـودة:
┃ ${selected.quality || 'أفضل جودة'}
┃
┃ 👤 بـواسـطـة:
┃ ${m.pushName || 'Kaito'}
╰━━━━━━━━━━━━━━━━━━━━╯`

    /*
     * إرسال Buffer حقيقي إلى واتساب
     * بدل إرسال رابط CDN قد ينتهي أو يرجع HTML.
     */
    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        mimetype: 'video/mp4',
        fileName: 'facebook.mp4',
        caption,

        ...(thumb
          ? {
              jpegThumbnail: await getThumbnail(thumb)
            }
          : {})
      },
      {
        quoted: m
      }
    )

    await m.react('✨')

  } catch (e) {

    console.log(
      'Facebook Downloader Error:',
      e?.response?.data || e?.message || e
    )

    await m.react('❌')

    await m.reply(`
✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️

╭━━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 ❌ 〕━━━╮
┃ 💔 تعذر تحميل الفيديو
┃
┃ 🔄 تأكد أن الرابط عام ويحتوي على فيديو
┃
┃ ⚠️ بعض الفيديوهات الخاصة أو المقيدة
┃    لا يمكن تحميلها بدون صلاحية الوصول.
╰━━━━━━━━━━━━━━━━━━━━╯`)
  }
}

handler.usage = ['فيس']
handler.category = 'downloads'
handler.command =
  /^(فيس|فيسبوك|fb|fbdl|facebook)$/i

export default handler


/*
 * تحميل الصورة المصغرة كـ Buffer
 */
async function getThumbnail(url) {
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      maxContentLength: 5 * 1024 * 1024,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36'
      }
    })

    return Buffer.from(res.data)
  } catch {
    return undefined
  }
}
