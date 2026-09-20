import fetch from "node-fetch"
import FormData from "form-data"

// Convert bytes to readable size
function formatSize(bytes) {
  if (!bytes) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i]
}

// Upload image to uguu
async function uguuUpload(buffer) {
  const form = new FormData()
  form.append("files[]", buffer, "file.jpg")

  const res = await fetch("https://uguu.se/upload.php", {
    method: "POST",
    headers: {
      accept: "*/*",
      "accept-language": "en-US",
      referer: "https://uguu.se/",
      ...form.getHeaders()
    },
    body: form
  })

  const json = await res.json()

  if (!json.success) {
    return { success: false, error: json }
  }

  const file = json.files[0]

  return {
    success: true,
    url: file.url,
    size: file.size
  }
}

// Send image to jpghd for enhancement
async function jpghdScrape(imageUrl) {
  const fakeIP = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256)
  ).join('.')

  const baseHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'Origin': 'https://jpghd.com',
    'Referer': 'https://jpghd.com/en',
    'Cookie': 'jpghd_lng=en',
    'User-Agent': 'CT Android/1.1.0',
    'X-Forwarded-For': fakeIP,
    'X-Real-IP': fakeIP
  }

  // Create task
  const create = await fetch('https://jpghd.com/api/task/', {
    method: 'POST',
    headers: baseHeaders,
    body: `conf=${JSON.stringify({
      filename: imageUrl.split('/').pop(),
      livephoto: "",
      color: "",
      scratch: "",
      style: "art",
      input: imageUrl
    })}`
  })

  const createJson = await create.json()

  if (createJson.status !== 'ok') {
    return { status: false, message: 'Failed to create task' }
  }

  const tid = createJson.tid

  // Poll result
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2000))

    const check = await fetch(`https://jpghd.com/api/task/${tid}`, {
      headers: {
        'Accept': 'application/json',
        'Referer': 'https://jpghd.com/en',
        'Cookie': 'jpghd_lng=en',
        'User-Agent': 'CT Android/1.1.0',
        'X-Forwarded-For': fakeIP,
        'X-Real-IP': fakeIP
      }
    })

    const checkJson = await check.json()
    const data = checkJson[tid]

    if (data?.status === 'success') {
      return {
        status: true,
        result: data.output.jpghd,
        size: data.output.size
      }
    }
  }

  return { status: false, message: 'Timeout, task not finished' }
}

// Main handler
let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""

    if (!/image/.test(mime)) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ 🖼️ لازم تـرد عـلـى صـورة
╰━━━━━━━━━━━━━━━━━━╯`)
    }

    await conn.sendMessage(m.chat, {
      react: { text: "⏳", key: m.key }
    })

    const buffer = await q.download()

    const upload = await uguuUpload(buffer)
    if (!upload.success) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ فـشـل رفـع الـصـورة
╰━━━━━━━━━━━━━━━━━━╯`)
    }

    const result = await jpghdScrape(upload.url)
    if (!result.status) {
      return m.reply(`
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ فـشـل تـحـسـيـن الـصـورة
┃ ⚠️ ${result.message}
╰━━━━━━━━━━━━━━━━━━╯`)
    }

    const size = formatSize(result.size)

    await conn.sendMessage(m.chat, {
      image: { url: result.result },
      caption: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ✅ تـم تـحـسـيـن الـصـورة
┃ 📦 الـحـجـم: ${size}
╰━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m })

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `
╭━━━〔 ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ 〕━━━╮
┃ ❌ حـدث خـطـأ
┃ ⚠️ ${e.message}
╰━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m })
  }
}

// Command info
handler.usage = ["تحسين"];
handler.command = ["تحسين", "8k"];
handler.category = "tools";

export default handler;
