const cache = new Map()

const MAX_CACHE = 1500
const CACHE_TIME = 24 * 60 * 60 * 1000

function getText(msg) {
    return (
        msg?.conversation ||
        msg?.extendedTextMessage?.text ||
        msg?.imageMessage?.caption ||
        msg?.videoMessage?.caption ||
        msg?.documentMessage?.caption ||
        ''
    )
}

function getMedia(msg) {
    if (!msg) return null

    if (msg.imageMessage)
        return { type: 'image', data: msg.imageMessage }

    if (msg.videoMessage)
        return { type: 'video', data: msg.videoMessage }

    if (msg.audioMessage)
        return { type: 'audio', data: msg.audioMessage }

    if (msg.documentMessage)
        return { type: 'document', data: msg.documentMessage }

    if (msg.stickerMessage)
        return { type: 'sticker', data: msg.stickerMessage }

    return null
}

async function sendDeleted(conn, key, saved) {
    try {
        const botJid = conn?.user?.id

        if (!botJid) return

        if (!saved) {
            await conn.sendMessage(botJid, {
                text:
                    `🗑️ *تم حذف رسالة*\n\n` +
                    `👤 المرسل: ${key?.participant || key?.remoteJid || 'غير معروف'}\n` +
                    `⚠️ لم يتم حفظ محتوى الرسالة قبل حذفها.`
            })
            return
        }

        const msg = saved.message
        const text = getText(msg)
        const media = getMedia(msg)

        let info =
            `🗑️ *رسالة محذوفة*\n\n` +
            `👤 المرسل: ${key?.participant || key?.remoteJid || 'غير معروف'}\n` +
            `💬 المحادثة: ${key?.remoteJid || 'غير معروف'}\n`

        if (text)
            info += `\n📝 ${text}`

        await conn.sendMessage(botJid, {
            text: info
        })

        /*
         * إذا كانت الرسالة تحتوي على وسائط،
         * نحاول إعادة إرسال الرسالة الأصلية نفسها.
         */
        if (media && saved.raw && typeof conn.copyNForward === 'function') {
            try {
                await conn.copyNForward(
                    botJid,
                    saved.raw,
                    true
                )

                return
            } catch (e) {
                console.error(
                    '[deleted.js] copyNForward:',
                    e
                )
            }
        }

        /*
         * محاولة إرسال الوسائط مباشرة
         * إذا كان framework يوفر download().
         */
        if (media && typeof conn.download === 'function') {
            try {
                const buffer = await conn.download(saved.raw)

                if (buffer) {
                    if (media.type === 'image') {
                        await conn.sendMessage(botJid, {
                            image: buffer,
                            caption: media.data.caption || ''
                        })
                    }

                    else if (media.type === 'video') {
                        await conn.sendMessage(botJid, {
                            video: buffer,
                            caption: media.data.caption || ''
                        })
                    }

                    else if (media.type === 'audio') {
                        await conn.sendMessage(botJid, {
                            audio: buffer,
                            mimetype: media.data.mimetype || 'audio/mp4',
                            ptt: media.data.ptt || false
                        })
                    }

                    else if (media.type === 'document') {
                        await conn.sendMessage(botJid, {
                            document: buffer,
                            mimetype:
                                media.data.mimetype ||
                                'application/octet-stream',
                            fileName:
                                media.data.fileName ||
                                'deleted-file'
                        })
                    }

                    return
                }
            } catch (e) {
                console.error(
                    '[deleted.js] download:',
                    e
                )
            }
        }

        /*
         * إذا فشل استرجاع الملف، نوضح السبب.
         */
        if (media) {
            await conn.sendMessage(botJid, {
                text:
                    `⚠️ تم العثور على رسالة محذوفة تحتوي على ${media.type}، ` +
                    `لكن لم أستطع استرجاع الملف نفسه.`
            })
        }

    } catch (e) {
        console.error(
            '[deleted.js] sendDeleted:',
            e
        )
    }
}

export function installDeletedMessages(conn) {
    if (!conn?.ev) {
        console.error('[deleted.js] conn.ev غير موجود')
        return
    }

    /*
     * منع تركيب listener أكثر من مرة
     */
    if (conn.__deletedMessagesInstalled)
        return

    conn.__deletedMessagesInstalled = true

    console.log('✅ Deleted messages listener installed')

    /*
     * استقبال الرسائل وحفظها
     */
    conn.ev.on(
        'messages.upsert',
        ({ messages }) => {
            try {
                for (const msg of messages || []) {
                    if (!msg?.key?.id) continue
                    if (!msg?.message) continue
                    if (msg?.message?.protocolMessage) continue

                    cache.set(msg.key.id, {
                        message: msg.message,
                        raw: msg,
                        timestamp: Date.now()
                    })
                }

                /*
                 * تنظيف الذاكرة
                 */
                while (cache.size > MAX_CACHE) {
                    const first =
                        cache.keys().next().value

                    if (!first) break

                    cache.delete(first)
                }

            } catch (e) {
                console.error(
                    '[deleted.js] cache:',
                    e
                )
            }
        }
    )

    /*
     * استقبال إشعار حذف الرسالة
     */
    conn.ev.on(
        'messages.delete',
        async event => {
            try {
                let keys = []

                if (Array.isArray(event)) {
                    keys = event
                }

                else if (Array.isArray(event?.keys)) {
                    keys = event.keys
                }

                else if (event?.key) {
                    keys = [event.key]
                }

                for (const key of keys) {
                    if (!key?.id) continue

                    const saved = cache.get(key.id)

                    await sendDeleted(
                        conn,
                        key,
                        saved
                    )

                    cache.delete(key.id)
                }

            } catch (e) {
                console.error(
                    '[deleted.js] messages.delete:',
                    e
                )
            }
        }
    )

    /*
     * تنظيف الرسائل القديمة كل 10 دقائق
     */
    setInterval(() => {
        const now = Date.now()

        for (const [id, value] of cache) {
            if (
                now - value.timestamp >
                CACHE_TIME
            ) {
                cache.delete(id)
            }
        }
    }, 10 * 60 * 1000)
}

export default async function before() {
    return false
}