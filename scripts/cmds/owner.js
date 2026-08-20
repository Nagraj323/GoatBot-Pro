const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Mᴏʜᴀᴍᴍᴀᴅ Aᴋᴀsʜ",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       : 𝐒𝐊 𝐒𝐚𝐛𝐛𝐢𝐫
│ 🧸 Nɪᴄᴋ       : 𝐀𝐫𝐢𝐲𝐚𝐧
│ 🎂 Aɢᴇ        : 20+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Sɪɴɢʟᴇ
│ 🎓 Pʀᴏғᴇssɪᴏɴ : 𝐆𝐎𝐑𝐈𝐁𝐒
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : 𝐁𝐎𝐋𝐌𝐔𝐍𝐀𝐇
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : 𝐁𝐫𝐚𝐦𝐦𝐨𝐧𝐁𝐚𝐫𝐢𝐚
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  : fb.com/100028959431665
│ 💬 Messenger: m.me/100028959431665
│ 📞 WhatsApp  : wa.me/01937278213
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/8T48Ddf.png";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
