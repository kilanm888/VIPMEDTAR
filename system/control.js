import fs from "fs";
import path from "path";

const group = async (ctx, event, eventType) => {
    try {
        if (!event?.participants) return null;

        const participants = event.participants.filter(p => p?.phoneNumber).map(p => p.phoneNumber);
        const author = event.author;
        let txt;

        const users = participants.length 
            ? participants.map(p => '@' + p.split('@')[0]).join(' and ') 
            : 'No users';
        const authorTag = author ? '@' + author.split('@')[0] : 'Unknown';

        const messages = {
            add: `مرحبا بك في نظام ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ تم تطوير البوت ب احترافية استمتع 🎭 ${users}${authorTag === users ? "" : `\n مرحبا بك في نظام ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ ${authorTag}`}`,
            remove: `${users} نأسف على خروجك من المجموعة وداعا مرحبا بك في اي وقت ✨️${authorTag === users ? "" : `\n𝐛𝐲 ${authorTag}`}`,
            promote: `مبروك اصبحت ادمن في نظام ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ ${users}\n بوت ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ ${authorTag}`,
            demote: `اممم نزلت عادي متزعلش 🎭 ${users}\n بوت ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ ${authorTag}`
        };

        txt = messages[eventType];
        if (!txt) return null;
        
        if (global.db.groups[event.chat].noWelcome === true) return 9999;

        const img = ["remove", "add"].includes(eventType) 
            ? (event.userUrl || "https://cdn.phototourl.com/free/2026-08-25-28312268-4aea-4cc2-9c7e-bf74877de3fd.jpg") 
            : "https://cdn.phototourl.com/free/2026-08-25-28312268-4aea-4cc2-9c7e-bf74877de3fd.jpg";

        await ctx.sock.msgUrl(event.chat, txt, {
            img,
            title: ctx.config?.info.nameBot || "✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️",
            body: "نظام كايتو كيد 🎭",
            mentions: author ? [author, ...participants] : participants,
            newsletter: {
                name: '𝐌𝐄𝐃 𝐓𝐀𝐑 😇',
                jid: '120363431514573259@newsletter'
            },
            big: ["remove", "add"].includes(eventType)
        });

    } catch (e) {
        console.erro
    }
    return null;
};

const access = async (msg, checkType, time) => {
    const conn = await msg.client();
    
    const quoted = {
        key: {
            participant: `${msg.sender.split('@')[0]}@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
            fromMe: false,
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg.pushName}\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nEND:VCARD`,
            },
        },
        participant: '0@s.whatsapp.net',
    };
    
    const messages = {
        cooldown: `*🤞 استنى ${time || 'بعد كم ثانية'} وعيد لامر تاني ✨️*\n╭━━━〔 ✦✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️✦ 〕━━━╮\n> *_اصبر شوي ترا ما بلعب هنا ✨️_*`,
        owner: `*🤞الأمر ده لـ المطور فقط 🎭*\n╭━━━〔 ✦✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️✦ 〕━━━╮\n> *_هه ما تخليني اتريق عليك لامر دا ل سيدي فقط 🎭_`,
        group: `*🎭 الأمر ده بيشتغل في الجروب فقط 🎭*\n╭━━━〔 ✦✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️✦ 〕━━━╮\n> *_ي عم دا خاص مش جروب لامر دا يعمل في الجروب فقط _*`,
        admin: `*الأمر دا ل لادمن فقط انت مجرد عبد عادي*\n╭━━━〔 ✦✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️✦ 〕━━━╮\n> *_هه فاكر نفسك ادمن  🤣*`,
        private: `*🪀 الأمر ده يعمل في الخاص فقط اوكي مينفعش هنا  *\n╭━━━〔 ✦✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️✦ 〕━━━╮\n> *_الامر يعمل ف الخاص بس اوكي 🎭_*`,
        botAdmin: `*مطلوب اشراف عشان اقدر انفذ الأمر دا *\n✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️\n> *_اسف سيدي ارفعني ادمن عشان تقدر تستعمل الأمر ده 🤞_*`,
        noSub: `*لامر دا في النظام لاساسي ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ فقط وليس المنصب*\n╭━━━〔 ✦✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️✦ 〕━━━╮\n> *_ادخل الجروب ده و جرب الأمر [ https://whatsapp.com/channel/0029vb7S87W4inohXYTCtn2f ] ياريت ما يكون اتحظر ✨️_*`,
        disabled: `*🎭 الامر متوق سيدي يصلحه *\n╭━━━〔 ✦✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️✦ 〕━━━╮\n> *_لا تقلق هنا في نظام ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️ يصلح سيدي لاوامر بسرعة_*`,
        error: `*ركز مش بفهم لامر دا اظن فيه خطأ عندك مشكلة تواصل مع المطور 🤞*\n╭━━━〔 ✦✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️✦ 〕━━━╮\n*_اكتب  " .المطور "بيبعت لك النظام رقمو_*`
    };
    
    if (conn && messages[checkType]) {
        await conn.msgUrl(msg.chat, messages[checkType], {
            img: "https://cdn.phototourl.com/free/2026-08-25-28312268-4aea-4cc2-9c7e-bf74877de3fd.jpg",
            title: "هنا حيث الفخامة ✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️",
            body: "تم تطوير البوت ب احترافية 🎭",
            newsletter: {
                name: '𝐌𝐄𝐃 𝐓𝐀𝐑 😇',
                jid: '120363431514573259@newsletter'
            },
            big: false
        }, quoted);
        return false;  
    }
    return null;  
};

export { access, group };
