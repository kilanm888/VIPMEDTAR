const test = async (m, { conn, bot }) => {
  m.react("🟢")
  
  conn.msgUrl(m.chat, "♤ RESTARTING....", { 
    title: "✦𝐊𝐀𝐈𝐓𝐎 𝐊𝐈𝐃 𝐁𝐎𝐓✦",
    body: "owner 𝐌𝐄𝐃 𝐓𝐀𝐑 😇",
    img: "https://cdn.phototourl.com/free/2026-08-25-28312268-4aea-4cc2-9c7e-bf74877de3fd.jpg",
    big: false 
  });
  
  setTimeout(() => {
    bot.restart();
  }, 1000); 
};

test.usage = ["رستارت"]
test.category = "owner";
test.command = ["رستارت", "restart"];
test.owner = true;
export default test;