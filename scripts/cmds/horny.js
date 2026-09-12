const axios = require("axios");
const fs = require("fs");
const path = require("path");

// গ্লোবাল ভ্যারিয়েবল ক্যাশ করার জন্য
let cachedApiUrl = null;

const mahmud = async () => {
  if (cachedApiUrl) return cachedApiUrl; // আগে ফেচ করা থাকলে নতুন করে করবে না
  const response = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  cachedApiUrl = response.data.mahmud;
  return cachedApiUrl;
};

module.exports = {
  config: {
    name: "horny",
    aliases: ["hornyvid", "hvideo"],
    version: "1.8",
    role: 2,
    author: "MahMUD",
    category: "adult",
    guide: {
      en: "Use {pn} to get a random horny video."
    }
  },

  onStart: async function ({ api, event }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }
    
    // ইউনিক ফাইল নেম (যাতে একাধিক ইউজার একসাথে ব্যবহার করতে পারে)
    const filePath = path.join(__dirname, `temp_${event.senderID}_${Date.now()}.mp4`);

    try {
      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/album/videos/horny2?userID=${event.senderID}`);
      
      if (!res.data.success || !res.data.videos.length)
        return api.sendMessage("❌ | No videos found.", event.threadID, event.messageID);

      const url = res.data.videos[Math.floor(Math.random() * res.data.videos.length)];

      const video = await axios({
        url,
        method: "GET",
        responseType: "stream",
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      const writer = fs.createWriteStream(filePath);
      video.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage({
          body: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐇𝐨𝐫𝐧𝐲 𝐯𝐢𝐝𝐞о <😘",
          attachment: fs.createReadStream(filePath)
        }, event.threadID, (err) => {
          // ভিডিও সফলভাবে পাঠানো হোক বা এরর আসুক, ফাইলটি ডিলিট করে দেওয়া হবে
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }, event.messageID);
      });

      writer.on("error", (err) => {
        console.error(err);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        api.sendMessage("❌ | Download error.", event.threadID, event.messageID);
      });
      
    } catch (e) {
      console.error("ERROR:", e);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      api.sendMessage("🥹error, contact MahMUD.", event.threadID, event.messageID);
    }
  }
};
