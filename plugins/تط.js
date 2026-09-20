import axios from 'axios'
import * as cheerio from 'cheerio'

const BASE = 'https://traidmodz.org'

const http = axios.create({
  timeout: 30000,
  maxRedirects: 10,
  responseType: 'text',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36',
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
  }
})

function absoluteUrl(url, base = BASE) {
  if (!url) return null

  try {
    return new URL(url, base).href
  } catch {
    return null
  }
}

function isApk(url) {
  return /\.apk(?:[?#].*)?$/i.test(url || '')
}

function findDownloadLinks(html, currentUrl) {
  const $ = cheerio.load(html)
  const links = []

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    const text = $(el).text().replace(/\s+/g, ' ').trim()

    if (!href) return

    const url = absoluteUrl(href, currentUrl)

    if (!url) return

    links.push({
      url,
      text
    })
  })

  return links
}

function chooseAppLink(links, query) {
  const q = query.toLowerCase()

  const candidates = links.filter(x => {
    try {
      const u = new URL(x.url)

      if (u.hostname !== 'traidmodz.org') return false
      if (x.url.includes('?s=')) return false

      return true
    } catch {
      return false
    }
  })

  const scored = candidates.map(x => {
    let score = 0

    const text = x.text.toLowerCase()
    const url = x.url.toLowerCase()

    if (text.includes(q)) score += 10
    if (url.includes(q.replace(/\s+/g, '-'))) score += 8
    if (text.includes('تحميل')) score += 3
    if (text.includes('apk')) score += 2

    return {
      ...x,
      score
    }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored[0]?.url || null
}

async function getPage(url, referer = BASE) {
  return await http.get(url, {
    headers: {
      Referer: referer
    }
  })
}

const handler = async (m, { conn, text }) => {
  try {
    if (!text?.trim()) {
      return m.reply(
        '📦 أرسل اسم التطبيق بعد الأمر\n\nمثال:\n.تط WhatsApp'
      )
    }

    const query = text.trim()

    await m.reply(`🔎 جاري البحث عن: ${query}`)

    // البحث في TraidModz
    const searchUrl =
      `${BASE}/?s=${encodeURIComponent(query)}`

    const searchResponse = await getPage(searchUrl)

    if (searchResponse.status !== 200) {
      throw new Error(
        `فشل الوصول إلى الموقع HTTP ${searchResponse.status}`
      )
    }

    const searchLinks = findDownloadLinks(
      searchResponse.data,
      searchUrl
    )

    const appUrl = chooseAppLink(searchLinks, query)

    if (!appUrl) {
      return m.reply(
        `❌ لم أجد تطبيقًا باسم: ${query}`
      )
    }

    await m.reply('📄 تم العثور على التطبيق، جاري استخراج رابط التحميل...')

    // فتح صفحة التطبيق
    const appResponse = await getPage(appUrl, searchUrl)

    if (appResponse.status !== 200) {
      throw new Error(
        `تعذر فتح صفحة التطبيق HTTP ${appResponse.status}`
      )
    }

    let currentUrl = appResponse.request?.res?.responseUrl || appUrl
    let html = appResponse.data

    // البحث عن APK مباشر أولاً
    let links = findDownloadLinks(html, currentUrl)

    let apkUrl =
      links.find(x => isApk(x.url))?.url || null

    /*
     * الموقع يضع زر "تحميل" يقود إلى صفحة تجهيز التحميل.
     * نبحث عن الروابط المرتبطة بالتحميل.
     */
    if (!apkUrl) {
      const downloadCandidates = links.filter(x => {
        const text = x.text.toLowerCase()

        return (
          text.includes('تحميل') ||
          text.includes('download') ||
          text.includes('apk')
        )
      })

      if (downloadCandidates.length) {
        const downloadPage = downloadCandidates[0].url

        const downloadResponse =
          await getPage(downloadPage, currentUrl)

        currentUrl =
          downloadResponse.request?.res?.responseUrl ||
          downloadPage

        html = downloadResponse.data

        links = findDownloadLinks(
          html,
          currentUrl
        )

        apkUrl =
          links.find(x => isApk(x.url))?.url || null
      }
    }

    /*
     * بعض صفحات التحميل تستخدم:
     * meta refresh
     * canonical
     * og:url
     * أو رابطًا داخل JavaScript.
     */
    if (!apkUrl) {
      const $ = cheerio.load(html)

      const metaUrls = []

      $('meta[http-equiv="refresh"]').each((_, el) => {
        const content = $(el).attr('content') || ''
        const match = content.match(/url\s*=\s*(.+)$/i)

        if (match) {
          const url = absoluteUrl(
            match[1].trim().replace(/^['"]|['"]$/g, ''),
            currentUrl
          )

          if (url) metaUrls.push(url)
        }
      })

      $('link[rel="canonical"]').each((_, el) => {
        const url = absoluteUrl(
          $(el).attr('href'),
          currentUrl
        )

        if (url) metaUrls.push(url)
      })

      $('meta[property="og:url"]').each((_, el) => {
        const url = absoluteUrl(
          $(el).attr('content'),
          currentUrl
        )

        if (url) metaUrls.push(url)
      })

      const text = html || ''

      const apkMatches =
        text.match(
          /https?:\/\/[^"'<>\\\s]+\.apk(?:\?[^"'<>\\\s]*)?/gi
        ) || []

      for (const url of apkMatches) {
        const clean = url.replace(/&amp;/g, '&')

        if (isApk(clean)) {
          apkUrl = clean
          break
        }
      }

      /*
       * إذا وجدنا رابطًا وسيطًا، نفتحه مرة أخرى.
       */
      if (!apkUrl && metaUrls.length) {
        for (const nextUrl of metaUrls) {
          try {
            const r = await getPage(
              nextUrl,
              currentUrl
            )

            const nextCurrent =
              r.request?.res?.responseUrl ||
              nextUrl

            const nextLinks =
              findDownloadLinks(
                r.data,
                nextCurrent
              )

            const found =
              nextLinks.find(x =>
                isApk(x.url)
              )

            if (found) {
              apkUrl = found.url
              break
            }
          } catch {}
        }
      }
    }

    if (!apkUrl) {
      return m.reply(
        '❌ وجدت صفحة التطبيق لكن لم أستطع استخراج رابط APK مباشر.\n\n' +
        'السبب المحتمل أن صفحة التحميل تحتاج JavaScript أو انتظارًا قبل إنشاء الرابط.'
      )
    }

    await m.reply('⬇️ جاري تنزيل ملف APK...')

    // تنزيل APK كـ Buffer
    const apkResponse = await axios.get(apkUrl, {
      responseType: 'arraybuffer',
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36',
        Referer: currentUrl,
        Accept:
          'application/vnd.android.package-archive,application/octet-stream,*/*'
      }
    })

    const buffer = Buffer.from(apkResponse.data)

    if (!buffer.length) {
      throw new Error('تم تنزيل ملف فارغ.')
    }

    // APK عبارة عن ZIP ويبدأ عادةً بـ PK
    if (
      buffer[0] !== 0x50 ||
      buffer[1] !== 0x4b
    ) {
      throw new Error(
        'الرابط لم يرجع ملف APK. ربما أعاد صفحة HTML بدل الملف.'
      )
    }

    const fileName =
      query
        .replace(/[\\/:*?"<>|]/g, '')
        .trim()
        .slice(0, 70) || 'app'

    await conn.sendMessage(
      m.chat,
      {
        document: buffer,
        fileName: `${fileName}.apk`,
        mimetype:
          'application/vnd.android.package-archive'
      },
      {
        quoted: m
      }
    )

  } catch (error) {
    console.error('TRAIDMODZ ERROR:', error)

    await m.reply(
      `❌ فشل أمر .تط\n\n${error?.message || error}`
    )
  }
}

handler.command = ['تط']
handler.category = 'download'

export default handler