const run = async (m, { args, conn, bot }) => {
/*
if (subBots.list().length >= 30) {
  return m.reply("خلاص العدد اكتمل");
} // عدد البوتات الي مسموح ب ربطهم فقط
*/
  if (global.db.noSub) return m.reply("المطور قافل التنصيب")
  try {
    const num = m.sender.split("@")[0].replace(/[+\s-]/g, '');

    if (!/^\d+$/.test(num)) return m.reply("⚠️ رقم الهاتف غير صالح");

    const sub = global.subBots;
    if (!sub) return m.reply("❌ نظام البوتات الفرعية غير متاح");

    const init = await m.reply(`⏳ جاري تنصيب 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 للرقم *${num}*...`);

    const state = { uid: null, pairDone: false, resolved: false, pending: null };

    const { images: img } = bot.config.info;

    const cleanup = () => {
      sub.off('pair', handlers.pair);
      sub.off('ready', handlers.ready);
      sub.off('error', handlers.error);
    };

    const handlers = {
      pair: (id, code) => {
        if (state.pairDone) return;
        if (!state.uid) { 
          state.pending = { id, code }; 
          return; 
        }
        if (id !== state.uid) return;
        state.pairDone = true;
        Func.pair(conn, code, num, m, init);
      },
      ready: (id) => {
        if (id !== state.uid || state.resolved) return;
        state.resolved = true;
        Func.ready(conn, num, m, img[Math.floor(Math.random() * img.length)]);
        cleanup();
      },
      error: (id, err) => {
        if (id !== state.uid || state.resolved) return;
        state.resolved = true;
        Func.error(conn, num, err, m);
        cleanup();
      },
    };

    sub.on('pair', handlers.pair);
    sub.on('ready', handlers.ready);
    sub.on('error', handlers.error);

    state.uid = await sub.add(num);

    if (state.pending?.id === state.uid && !state.pairDone) {
      state.pairDone = true;
      Func.pair(conn, state.pending.code, num, m, init);
    }

    setTimeout(() => {
      if (state.resolved) return;
      state.resolved = true;
      Func.timeout(conn, m, state.pairDone);
      cleanup();
    }, 120000);

  } catch (error) {
    await m.reply(error.message);
  }
};

run.command = ["تنصيب"];
run.noSub = true;
run.usage = ["تنصيب"];
run.category = "sub";
export default run;



const Func = {
  pair: async (conn, code, num, m, reply_status) => {
    await conn.sendButton(m.chat, {
      videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663618157387/swKhuOMbakQoDpfA.mp4",
      bodyText: `☠️⤿ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ➤ نظام البوتات الفرعية
╭━━━〔 ✦𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦ 〕━━━╮
🎭 — 𝑹𝑬𝑪𝑬𝑰𝑽𝑬𝑫 𝑵𝑼𝑴𝑩𝑬𝑹: ${num}
🪀 — 𝑨𝑪𝑪𝑬𝑺𝑺 𝑪𝑶𝑫𝑬: ${code}
⊱⋅ ──────────── ⋅⊰
> *𓆩⚙️𓆪 𝐓𝐀𝐒𝐊 𝐈𝐍𝐒𝐓𝐑𝐔𝐂𝐓𝐈𝐎𝐍
▸ افتح واتساب
▸ ادخل إلى الأجهزة المرتبطة
▸ اختر ربط جهاز برقم الهاتف
▸ ثم أدخل الكود
⌬ 𝐍𝐎𝐓𝐄: تأكد من إدخال الكود بشكل صحيح قبل المتابعة ✔️*`,
      footerText: "𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 ~ 𝐒𝐔𝐁 𝐒𝐘𝐒𝐓𝐄𝐌",
      buttons: [
        { name: "cta_copy", params: { display_text: "انسخ الكود 🎭", copy_code: code } },
        { name: "cta_url", params: { display_text: "تواصل مع المطور ✨️", url: "https://wa.me/22242203253" } },
      ],
      mentions: [m.sender],
      newsletter: {
        name: '𝐌𝐄𝐃 𝐓𝐀𝐑 😇',
        jid: '120363431514573259@newsletter'
      },
      interactiveConfig: {
        buttons_limits: 10,
        list_title: "𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓",
        button_title: "Click Here",
        canonical_url: `https://code.com/${code}`
      }
    }, global.reply_status);
  },

  ready: async (conn, num, m, img) => {
    await m.react("✅");
    await conn.sendMessage(m.chat, {
      text: `✅ — 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓\n\n📱 الرقم: ${num}\n> تم الاتصال بنجاح مرحبا بك في 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓 `,
      contextInfo: {
        externalAdReply: {
          title: "𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓",
          body: "بوت واتساب احترافي وسريع",
          thumbnailUrl: img,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  },

  error: async (conn, num, err, m) => {
    await m.reply(`❌ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓\n\n📱 الرقم: ${num}\n⚠️ الخطأ: ${err?.message || 'غير معروف'}`);
  },

  timeout: async (conn, m, pairDone) => {
    await m.reply(pairDone
      ? `⏰ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓\nتم إرسال الكود لكن لم يتم تأكيد الاتصال`
      : `⏰ 𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓\nلم يتم استلام الكود خلال 120 ثانية`
    );
  }
};