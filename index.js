import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';
import { installDeletedMessages } from './plugins/deleted.js';


/* =========== Client ========== */
const client = new Client({
  phoneNumber: '380675002394', // Bot number
  prefix: [".", "/", "!"],
  fromMe: null, 
  owners: [
    // المطور 1
    { name: "🎭𝐌𝐄𝐃 𝐓𝐀𝐑🎭", lid: "247579682029763@lid", jid: "22248682208@s.whatsapp.net" },

    // المطور 2
    { name: "🎭𝐌𝐄𝐃 𝐓𝐀𝐑🎭", lid: "221307316789354@lid", jid: "380675002394@s.whatsapp.net" },

    // المطور 3
    { name: "🎭𝐌𝐄𝐃 𝐓𝐀𝐑🎭", jid: "22242203253@s.whatsapp.net", lid: "50414477168824@lid" },

    // المطور 4
    { name: "🎭𝐌𝐄𝐃 𝐓𝐀𝐑🎭", jid: "22248682208@s.whatsapp.net", lid: "51664513925368@lid" }
  ],

  settings: { noWelcome: false },
  commandsPath: './plugins'
});


client.onGroupEvent(group);
client.onCommandAccess(access);


/* =========== Database ========== */
if (!global.db) {
    global.db = new UltraDB();
}


/* =========== Config ========== */
const { config } = client;

config.info = { 
  nameBot: "✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️", 
  nameChannel: "𝐌𝐄𝐃 𝐓𝐀𝐑 😇", 
  idChannel: "120363431514573259@newsletter",

  urls: {
    repo: "https://github.com/medtarvip/Ht",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029Vb8pXI9AInPbwdJ1mi3o"
  },

  copyright: { 
    pack: '✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️', 
    author: '✨️𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✨️',
  },

  images: [
    "https://cdn.phototourl.com/free/2026-08-25-28312268-4aea-4cc2-9c7e-bf74877de3fd.jpg",
    "https://cdn.phototourl.com/free/2026-08-25-28312268-4aea-4cc2-9c7e-bf74877de3fd.jpg",
    "https://cdn.phototourl.com/free/2026-08-25-28312268-4aea-4cc2-9c7e-bf74877de3fd.jpg"
  ]
};


/* =========== Deleted Messages ========== */

config.onConnected = async () => {
    try {
        const conn = client.sock;

        if (!conn) {
            console.error('❌ لم يتم العثور على اتصال WhatsApp');
            return;
        }

        installDeletedMessages(conn);

        console.log('✅ تم تفعيل مراقبة الرسائل المحذوفة');

    } catch (e) {
        console.error(
            '❌ خطأ في مراقبة الرسائل المحذوفة:',
            e
        );
    }
};


/* =========== Start ========== */
client.start();


setTimeout(async () => {
  if (client.commandSystem) { 
    sub(client);
  }
}, 2000);


/* =========== Catch Errors ========== */

process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) {}
});


process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});


/*
 =========== Memory Monitor ========== 

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024;

    if (used > 800) {
        console.log(
            `🔄 Bot memory full (${used.toFixed(1)}MB), restarting...`
        );

        process.exit(1);
    }
}, 300_000);

*/