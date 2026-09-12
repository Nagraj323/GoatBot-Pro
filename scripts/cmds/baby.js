const axios = require("axios");

const API_URL = "https://vireonix.ai/v1/chat/completions";

// ==========================================
// 🤖 ARIYAN AI
// বাংলা + English + Banglish
// Proper Reply Chain + Conversation Memory
// ==========================================

const chatHistory = new Map();

const MAX_HISTORY = 12;
const HISTORY_TIMEOUT = 30 * 60 * 1000;


// ==========================================
// ⌨️ Typing Indicator
// ==========================================
async function typing(api, threadID) {
  try {
    if (api.sendTypingIndicator) {
      await api.sendTypingIndicator(threadID, true);

      setTimeout(async () => {
        try {
          await api.sendTypingIndicator(threadID, false);
        } catch {}
      }, 1200);
    }
  } catch {}
}


// ==========================================
// 🧠 Conversation Memory
// ==========================================
function getHistory(key) {
  const data = chatHistory.get(key);

  if (!data) return [];

  if (Date.now() - data.updatedAt > HISTORY_TIMEOUT) {
    chatHistory.delete(key);
    return [];
  }

  return data.messages || [];
}


function saveHistory(key, messages) {
  chatHistory.set(key, {
    messages: messages.slice(-MAX_HISTORY),
    updatedAt: Date.now()
  });
}


// ==========================================
// 🔗 Proper Reply Chain
// ==========================================
function setReply(info, event, historyKey) {
  if (!info?.messageID) return;

  global.GoatBot.onReply.set(info.messageID, {
    commandName: "baby",

    // Bot-এর message ID
    messageID: info.messageID,

    author: event.senderID,
    threadID: event.threadID,

    type: "reply",

    historyKey
  });
}


// ==========================================
// 😂 Random Replies
// ==========================================
const randomReplies = [
  "𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐰𝐚𝐥𝐚𝐢𝐤𝐮𝐦 ♥",
  "বলেন sir__😌",
  "𝐁𝐨𝐥𝐨 𝐣𝐚𝐧 𝐤𝐢 𝐤𝐨𝐫𝐭𝐞 𝐩𝐚𝐫𝐢 𝐭𝐨𝐦𝐫 𝐣𝐨𝐧𝐧𝐨 🐸",
  "𝐋𝐞𝐛𝐮 𝐤𝐡𝐚𝐰 𝐝𝐚𝐤𝐭𝐞 𝐝𝐚𝐤𝐭𝐞 𝐭𝐨 𝐡𝐚𝐩𝐚𝐲 𝐠𝐞𝐬𝐨 🫴🍋",
  "𝐋𝐞𝐦𝐨𝐧 𝐭𝐮𝐬 🍋",
  "মুড়ি খাও 🫥",
  "অন্যকে নই, নিজেকে ভালোবাসতে শিখো প্রিয় 😌",
  "একা বাঁচতে শিখো দেখবে পৃথিবী অনেক সুন্দর ✨",
  "──‎ 𝐇𝐮𝐌..? 👉👈",
  "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🐸",
  "কি হলো, মিস টিস করচ্ছো নাকি 🤣",
  "𝐓𝐫𝐮𝐬𝐭 𝐦𝐞 𝐢𝐚𝐦 ARIYAN 𝐟𝐫𝐨𝐦 SA BB IR 🧃",
  "𝗛𝗲𝘆 𝘅𝗮𝗻 𝗶𝗮𝗺 ARIYAN AI ✨",
  "𝐓𝐨𝐫 𝐣𝐧𝐧𝐨 𝐛𝐬𝐢 𝐚𝐜𝐡𝐢, 𝐣𝐥𝐝𝐢 𝐛𝐨𝐥 𝐤𝐢 𝐝𝐫𝐤𝐚𝐫 ✨",
  "একাকিত্ব মানুষকে ধীরে ধীরে শেষ করে ফেলে 🥀",
  "চা খাবেন, ঢেলে দেবো..? 😙🤏",
  "𝙜𝙤𝙥 𝙜𝙤𝙥 𝙜𝙤𝙥 🙊"
];


// ==========================================
// 🧠 AI Request
// ==========================================
async function askAI(text, history = []) {
  try {

    const messages = [
      {
        role: "system",
        content:
          "You are ARIYAN AI, a friendly Messenger chatbot. " +
          "You understand Bangla, English and Banglish. " +
          "If the user writes Bangla, answer naturally in Bangla. " +
          "If the user writes English, answer naturally in English. " +
          "If the user mixes Bangla and English, reply naturally in the same style. " +
          "Remember previous conversation context when relevant. " +
          "Keep casual replies reasonably short."
      },

      ...history,

      {
        role: "user",
        content: text
      }
    ];


    const response = await axios.post(
      API_URL,
      {
        model: "auto",
        messages
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );


    const answer =
      response.data?.choices?.[0]?.message?.content;


    if (!answer) return null;

    return answer.trim();

  } catch (error) {

    console.error(
      "❌ ARIYAN AI ERROR:",
      error.response?.status,
      error.response?.data || error.message
    );

    return null;
  }
}


// ==========================================
// 📦 COMMAND
// ==========================================
module.exports = {

  config: {
    name: "baby",

    version: "13.0",

    author: "ARIYAN AHMED SABBIR",

    countDown: 2,

    role: 0,

    shortDescription: {
      en: "Chat with ARIYAN AI"
    },

    longDescription: {
      en:
        "Bangla + English AI with proper reply chain and conversation memory"
    },

    category: "AI",

    guide: {
      en:
        "{pn} hello\n" +
        "{pn} কেমন আছো\n" +
        "{pn} how are you"
    },

    aliases: [
      "bby",
      "bbe",
      "babe",
      "sam",
      "mari",
      "maria",
      "hippi",
      "xan",
      "bbz"
    ]
  },


  // ==========================================
  // ▶️ ON START
  // ==========================================
  onStart: async function ({ api, event, args }) {

    const text = args.join(" ").trim();

    const historyKey =
      `${event.threadID}_${event.senderID}`;


    // ========================================
    // শুধু baby/bot লিখলে
    // ========================================
    if (!text) {

      const reply =
        randomReplies[
          Math.floor(
            Math.random() * randomReplies.length
          )
        ];


      const info = await api.sendMessage(
        reply,
        event.threadID
      );


      setReply(
        info,
        event,
        historyKey
      );

      return;
    }


    await typing(
      api,
      event.threadID
    );


    const history =
      getHistory(historyKey);


    const answer =
      await askAI(
        text,
        history
      );


    if (!answer) {

      return api.sendMessage(
        "⚠️ ARIYAN AI এখন উত্তর দিতে পারছে না। একটু পরে আবার চেষ্টা করো।",
        event.threadID
      );
    }


    // Memory update
    saveHistory(
      historyKey,
      [
        ...history,

        {
          role: "user",
          content: text
        },

        {
          role: "assistant",
          content: answer
        }
      ]
    );


    // ========================================
    // ⭐ USER MESSAGE-এর উপর REPLY
    // ========================================
    const info = await api.sendMessage(
      `🤖 ARIYAN AI\n\n${answer}`,
      event.threadID,
      event.messageID
        ? {
            replyTo: event.messageID
          }
        : undefined
    );


    // পরের chain
    setReply(
      info,
      event,
      historyKey
    );
  },


  // ==========================================
  // 💬 ON REPLY
  // ==========================================
  onReply: async function ({
    api,
    event,
    Reply
  }) {

    const text =
      event.body?.trim();


    if (!text) return;


    const historyKey =
      Reply?.historyKey ||
      `${event.threadID}_${event.senderID}`;


    await typing(
      api,
      event.threadID
    );


    const history =
      getHistory(historyKey);


    const answer =
      await askAI(
        text,
        history
      );


    if (!answer) {

      return api.sendMessage(
        "⚠️ উত্তর দিতে একটু সমস্যা হচ্ছে 😵‍💫",
        event.threadID
      );
    }


    // Memory update
    saveHistory(
      historyKey,
      [
        ...history,

        {
          role: "user",
          content: text
        },

        {
          role: "assistant",
          content: answer
        }
      ]
    );


    // ========================================
    // ⭐ USER-এর REPLY MESSAGE-এর উপর REPLY
    // ========================================
    const info = await api.sendMessage(
      `🤖 ARIYAN AI\n\n${answer}`,
      event.threadID,
      event.messageID
        ? {
            replyTo: event.messageID
          }
        : undefined
    );


    // Chain continue
    setReply(
      info,
      event,
      historyKey
    );
  },


  // ==========================================
  // 👀 ON CHAT
  // ==========================================
  onChat: async function ({
    api,
    event
  }) {

    const body =
      event.body?.trim();


    if (!body) return;


    const lower =
      body.toLowerCase();


    const triggers = [
      "baby",
      "bby",
      "bbe",
      "babe",
      "sam",
      "mari",
      "maria",
      "hippi",
      "xan",
      "bbz",
      "মারিয়া",
      "bot"
    ];


    const prefixes = [
      "baby ",
      "bby ",
      "bbe ",
      "babe ",
      "sam ",
      "mari ",
      "maria ",
      "hippi ",
      "xan ",
      "bbz ",
      "মারিয়া ",
      "bot "
    ];


    // ========================================
    // শুধু trigger
    // ========================================
    if (triggers.includes(lower)) {

      const reply =
        randomReplies[
          Math.floor(
            Math.random() * randomReplies.length
          )
        ];


      const historyKey =
        `${event.threadID}_${event.senderID}`;


      const info = await api.sendMessage(
        reply,
        event.threadID,
        event.messageID
          ? {
              replyTo: event.messageID
            }
          : undefined
      );


      setReply(
        info,
        event,
        historyKey
      );

      return;
    }


    // ========================================
    // Prefix detect
    // ========================================
    let message = null;


    for (const prefix of prefixes) {

      if (lower.startsWith(prefix)) {

        message =
          body.slice(prefix.length).trim();

        break;
      }
    }


    if (!message) return;


    if (!message.length) {

      const reply =
        randomReplies[
          Math.floor(
            Math.random() * randomReplies.length
          )
        ];


      const historyKey =
        `${event.threadID}_${event.senderID}`;


      const info = await api.sendMessage(
        reply,
        event.threadID,
        event.messageID
          ? {
              replyTo: event.messageID
            }
          : undefined
      );


      setReply(
        info,
        event,
        historyKey
      );

      return;
    }


    // ========================================
    // 🧠 AI
    // ========================================
    const historyKey =
      `${event.threadID}_${event.senderID}`;


    await typing(
      api,
      event.threadID
    );


    const history =
      getHistory(historyKey);


    const answer =
      await askAI(
        message,
        history
      );


    if (!answer) {

      return api.sendMessage(
        "⚠️ ARIYAN AI এখন একটু ব্যস্ত 😵‍💫",
        event.threadID
      );
    }


    // Memory
    saveHistory(
      historyKey,
      [
        ...history,

        {
          role: "user",
          content: message
        },

        {
          role: "assistant",
          content: answer
        }
      ]
    );


    // ========================================
    // ⭐ ORIGINAL USER MESSAGE-এর উপর REPLY
    // ========================================
    const info = await api.sendMessage(
      `🤖 ARIYAN AI\n\n${answer}`,
      event.threadID,
      event.messageID
        ? {
            replyTo: event.messageID
          }
        : undefined
    );


    // Chain continue
    setReply(
      info,
      event,
      historyKey
    );
  }
};
