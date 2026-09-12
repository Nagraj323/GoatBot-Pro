const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

const typing = async (api, threadID, ms = 3000) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

// Save reply-chain
const setReply = (info, event) => {
  if (!info?.messageID) return;

  global.GoatBot.onReply.set(info.messageID, {
    commandName: "baby",
    messageID: info.messageID,
    author: event.senderID,
    threadID: event.threadID,
    type: "reply"
  });
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["mari", "maria", "hippi", "xan", "bby", "bbz"],
    version: "3.7",
    author: "rX (fixed by GPT)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI",
    longDescription: "Teachable AI + autoteach + list/msg/edit/remove + typing",
    category: "box chat",
    guide: {
      en:
        "{p}baby [message]\n" +
        "{p}baby teach [q] - [a]\n" +
        "{p}baby autoteach on/off\n" +
        "{p}baby list\n" +
        "{p}baby msg [trigger]\n" +
        "{p}baby edit [q] - [old] - [new]\n" +
        "{p}baby remove/rm [q] - [a]"
    }
  },

  // =========================
  // COMMAND
  // =========================
  onStart: async function ({
    api,
    event,
    args,
    message,
    usersData
  }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;
    const query = args.join(" ").trim().toLowerCase();

    try {
      // =========================
      // NO TEXT
      // =========================
      if (!query) {
        await typing(api, threadID, 2000);

        const ran = [
          "𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐰𝐚𝐥𝐚𝐢𝐤𝐮𝐦 ♥",
          "বলেন sir__😌",
          "𝐁𝐨𝐥𝐨 𝐣𝐚𝐧 𝐤𝐢 𝐤𝐨𝐫𝐭𝐞 𝐩𝐚𝐫𝐢 𝐭𝐨𝐦𝐫 𝐣𝐨𝐧𝐧𝐨 🐸",
          "𝐋𝐞𝐛𝐮 𝐤𝐡𝐚𝐰 𝐝𝐚𝐤𝐭𝐞 𝐝𝐚𝐤𝐭𝐞 𝐭𝐨 𝐡𝐚𝐩𝐚𝐲 𝐠𝐞𝐬𝐨.🫴🍋",
          "𝐋𝐞𝐦𝐨𝐧 𝐭𝐮𝐬 🍋",
          "মুড়ি খাও 🫥",
          "অন্যকে নই, নিজেকে ভালোবাসতে শিখো প্রিয় 😌",
          "একা বাঁচতে শিখো দেখবে পৃথিবী অনেক সুন্দর ✨",
          "──‎ 𝐇𝐮𝐌..? 👉👈",
          "কি হলো, মিস টিস করচ্ছো নাকি 🤣",
          "𝗛𝗲𝘆 𝘅𝗮𝗻 𝗶𝗮𝗺 ARIYAN AI✨",
          "𝐓𝐨𝐫 𝐣𝐧𝐧𝐨 𝐛𝐬𝐢 𝐚𝐜𝐡𝐢, 𝐣𝐥𝐝𝐢 𝐛𝐨𝐥 𝐤𝐢 𝐝𝐫𝐤𝐚𝐫 ✨",
          "একাকিত্ব মানুষকে ধীরে ধীরে শেষ করে ফেলে🥀",
          "চা খাবেন ,ঢেলে দেবো..?😙🤏",
          "𝙜𝙤𝙥 𝙜𝙤𝙥 𝙜𝙤𝙥 🙊",
          "😚",
          "Yes 😀, I am here",
          "What's up?"
        ];

        return message.reply(
          ran[Math.floor(Math.random() * ran.length)],
          (err, info) => {
            if (!err) setReply(info, event);
          }
        );
      }

      // =========================
      // AUTO TEACH
      // =========================
      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();

        if (!["on", "off"].includes(mode)) {
          return message.reply("Use: baby autoteach on/off");
        }

        const status = mode === "on";

        await axios.post(
          `${simsim}/setting`,
          { autoTeach: status },
          { timeout: 10000 }
        );

        return message.reply(
          `✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`
        );
      }

      // =========================
      // LIST
      // =========================
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, {
          timeout: 10000
        });

        return message.reply(
`╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬
├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions || 0}
├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}
╰─╼👤 𝐃𝐞𝐯: rX 𝐀𝐛𝐝𝐮𝐥𝐥𝐚𝐡`
        );
      }

      // =========================
      // MSG
      // =========================
      if (args[0] === "msg") {
        const trigger = args
          .slice(1)
          .join(" ")
          .trim();

        if (!trigger) {
          return message.reply("Use: baby msg [trigger]");
        }

        const res = await axios.get(
          `${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`,
          { timeout: 10000 }
        );

        if (!res.data.replies?.length) {
          return message.reply(
            "❌ No replies found for this trigger."
          );
        }

        const formatted = res.data.replies
          .map((rep, i) => `➤ ${i + 1}. ${rep}`)
          .join("\n");

        return message.reply(
`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}
📋 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}
━━━━━━━━━━━━━━
${formatted}`
        );
      }

      // =========================
      // TEACH
      // =========================
      if (args[0] === "teach") {
        const parts = query
          .replace(/^teach\s+/i, "")
          .split(" - ");

        if (parts.length < 2) {
          return message.reply(
            "Use: baby teach question - answer"
          );
        }

        const [ask, ans] = parts.map(s => s.trim());

        const res = await axios.get(
          `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`,
          { timeout: 10000 }
        );

        return message.reply(
          res.data.message || "✅ Taught successfully!"
        );
      }

      // =========================
      // EDIT
      // =========================
      if (args[0] === "edit") {
        const parts = query
          .replace(/^edit\s+/i, "")
          .split(" - ");

        if (parts.length < 3) {
          return message.reply(
            "Use: baby edit question - old reply - new reply"
          );
        }

        const [ask, oldR, newR] = parts.map(s => s.trim());

        const res = await axios.get(
          `${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`,
          { timeout: 10000 }
        );

        return message.reply(
          res.data.message || "✅ Edited successfully!"
        );
      }

      // =========================
      // REMOVE / RM
      // =========================
      if (["remove", "rm"].includes(args[0])) {
        const parts = query
          .replace(/^(remove|rm)\s+/i, "")
          .split(" - ");

        if (parts.length < 2) {
          return message.reply(
            "Use: baby remove question - answer"
          );
        }

        const [ask, ans] = parts.map(s => s.trim());

        const res = await axios.get(
          `${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`,
          { timeout: 10000 }
        );

        return message.reply(
          res.data.message || "✅ Removed successfully!"
        );
      }

      // =========================
      // NORMAL CHAT
      // =========================
      await typing(api, threadID, 2000);

      const res = await axios.get(
        `${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`,
        { timeout: 15000 }
      );

      const responses = Array.isArray(res.data.response)
        ? res.data.response
        : [res.data.response || "Hmm baby 😚"];

      for (const r of responses) {
        await new Promise(resolve => {
          message.reply(r, (err, info) => {
            if (!err) {
              setReply(info, event);
            }
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("Baby command error:", err.message);

      return message.reply(
        "❌ Error: " +
        (
          err.message.includes("404")
            ? "Feature not available (backend issue)"
            : err.message
        )
      );
    }
  },

  // =========================
  // REPLY SYSTEM
  // =========================
  onReply: async function ({
    api,
    event,
    message,
    usersData,
    Reply
  }) {
    const text = event.body?.trim();

    if (!text) return;

    const senderName = await usersData.getName(
      event.senderID
    );

    try {
      await typing(api, event.threadID, 2000);

      const res = await axios.get(
        `${simsim}/simsimi?text=${encodeURIComponent(text.toLowerCase())}&senderName=${encodeURIComponent(senderName)}`,
        { timeout: 15000 }
      );

      const replies = Array.isArray(res.data.response)
        ? res.data.response
        : [res.data.response || "Hmm baby 😚"];

      for (const r of replies) {
        await new Promise(resolve => {
          message.reply(r, (err, info) => {
            if (!err) {
              setReply(info, event);
            }
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("onReply error:", err.message);

      try {
        message.reply("❌ Error: " + err.message);
      } catch {}
    }
  },

  // =========================
  // AUTO CHAT
  // =========================
  onChat: async function ({
    api,
    event,
    message,
    usersData
  }) {
    const raw = event.body
      ? event.body.toLowerCase().trim()
      : "";

    if (!raw) return;

    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;

    try {

      // =========================
      // TRIGGERS
      // =========================
      const triggers = [
        "baby",
        "bby",
        "xan",
        "bbz",
        "mari",
        "মারিয়া",
        "bot"
      ];

      // শুধু "BOT" / "BABY" লিখলে
      if (triggers.includes(raw)) {

        await typing(api, threadID, 3000);

        const funny = [
          "𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐰𝐚𝐥𝐚𝐢𝐤𝐮𝐦 ♥",
          "বলেন sir__😌",
          "𝐁𝐨𝐥𝐨 𝐣𝐚𝐧 𝐤𝐢 𝐤𝐨𝐫𝐭𝐞 𝐩𝐚𝐫𝐢 𝐭𝐨𝐦𝐫 𝐣𝐨𝐧𝐧𝐨 🐸",
          "𝐋𝐞𝐛𝐮 𝐤𝐡𝐚𝐰 𝐝𝐚𝐤𝐭𝐞 𝐝𝐚𝐤𝐭𝐞 𝐭𝐨 𝐡𝐚𝐩𝐚𝐲 𝐠𝐞𝐬𝐨.🫴🍋",
          "𝐋𝐞𝐦𝐨𝐧 𝐭𝐮𝐬 🍋",
          "মুড়ি খাও 🫥",
          "𝐚𝐦𝐤𝐞 𝐬𝐞𝐫𝐞 𝐝𝐞𝐰 𝐚𝐦𝐢 𝐚𝐦𝐦𝐮𝐫 𝐤𝐚𝐬𝐞 𝐣𝐚𝐛𝐨!!🥺.....😗",
          "অন্যকে নই, নিজেকে ভালোবাসতে শিখো প্রিয় 😌",
          "একা বাঁচতে শিখো দেখবে পৃথিবী অনেক সুন্দর ✨",
          "──‎ 𝐇𝐮𝐌..? 👉👈",
          "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🐸",
          "কি হলো, মিস টিস করচ্ছো নাকি 🤣",
          "𝐓𝐫𝐮𝐬𝐭 𝐦𝐞 𝐢𝐚𝐦 ARIYAN 𝐟𝐫𝐨𝐦 SA BB IR🧃",
          "𝗛𝗲𝘆 𝘅𝗮𝗻 𝗶𝗮𝗺 ARIYAN AI✨",
          "𝐓𝐨𝐫 𝐣𝐧𝐧𝐨 𝐛𝐬𝐢 𝐚𝐜𝐡𝐢, 𝐣𝐥𝐝𝐢 𝐛𝐨𝐥 𝐤𝐢 𝐝𝐫𝐤𝐚𝐫 ✨",
          "একাকিত্ব মানুষকে ধীরে ধীরে শেষ করে ফেলে🥀",
          "চা খাবেন ,ঢেলে দেবো..?😙🤏",
          "𝙜𝙤𝙥 𝙜𝙤𝙥 𝙜𝙤𝙥 🙊",
          "😚",
          "Yes 😀, I am here",
          "What's up?"
        ];

        return message.reply(
          funny[Math.floor(Math.random() * funny.length)],
          (err, info) => {
            if (!err) {
              setReply(info, event);
            }
          }
        );
      }

      // =========================
      // PREFIX CHAT
      // =========================
      const prefixes = [
        "baby ",
        "bby ",
        "xan ",
        "bbz ",
        "mari ",
        "মারিয়া ",
        "bot "
      ];

      const prefix = prefixes.find(p =>
        raw.startsWith(p)
      );

      if (prefix) {

        const q = raw
          .replace(prefix, "")
          .trim();

        if (!q) return;

        await typing(api, threadID, 2000);

        const res = await axios.get(
          `${simsim}/simsimi?text=${encodeURIComponent(q)}&senderName=${encodeURIComponent(senderName)}`,
          { timeout: 15000 }
        );

        const replies = Array.isArray(res.data.response)
          ? res.data.response
          : [res.data.response || "Hmm baby 😚"];

        for (const r of replies) {
          await new Promise(resolve => {
            message.reply(r, (err, info) => {
              if (!err) {
                setReply(info, event);
              }
              resolve();
            });
          });
        }

        return;
      }

      // =========================
      // AUTO TEACH FROM REPLY
      // =========================
      if (event.messageReply) {

        try {
          const setting = await axios.get(
            `${simsim}/setting`,
            { timeout: 8000 }
          );

          if (setting.data?.autoTeach) {

            const ask =
              event.messageReply.body
                ?.toLowerCase()
                .trim();

            const ans = raw.trim();

            if (ask && ans && ask !== ans) {

              setTimeout(async () => {
                try {
                  await axios.get(
                    `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`,
                    { timeout: 10000 }
                  );
                } catch {}
              }, 500);
            }
          }

        } catch {}
      }

    } catch (err) {
      console.error(
        "onChat error:",
        err.message
      );
    }
  }
};
