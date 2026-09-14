const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

fs.ensureDirSync(path.join(__dirname, "cache"));

module.exports = {
  config: {
    name: "gcupdate",
    version: "10.0",
    author: "ARIYAN SABBIR",
    description: "ARIYAN Group Update & Call Notification System",
    category: "events"
  },

  onStart: async function ({
    api,
    event,
    usersData,
    threadsData
  }) {
    try {
      const {
        type,
        logMessageType,
        logMessageData,
        author,
        senderID,
        threadID,
        action
      } = event;

      if (!threadID) return;

      // ==============================
      // NORMALIZE EVENT DATA
      // ==============================
      const norm = value =>
        String(value ?? "").toLowerCase();

      const eventType = norm(type);
      const eventAction = norm(action);
      const eventLogType = norm(logMessageType);

      let callData = "";

      try {
        callData = JSON.stringify(
          logMessageData || {}
        ).toLowerCase();
      } catch {
        callData = "";
      }

      const allEventText =
        `${eventType} ${eventAction} ${eventLogType} ${callData}`;

      // ==============================
      // GROUP NAME CHANGE
      // ==============================
      const isNameChange =
        eventType === "change_thread_name" ||
        eventLogType === "log:thread-name" ||
        eventType.includes("thread-name") ||
        eventLogType.includes("thread-name") ||
        eventType.includes("name_change");

      // ==============================
      // GROUP IMAGE CHANGE
      // ==============================
      const isImageChange =
        eventLogType === "log:thread-image" ||
        eventType.includes("thread-image") ||
        eventLogType.includes("thread-image") ||
        eventType.includes("image_change");

      // ==============================
      // CALL START
      // ==============================
      const isCallStart =
        /rtc.*call.*start/.test(allEventText) ||
        /call.*start/.test(allEventText) ||
        /start.*call/.test(allEventText) ||
        allEventText.includes("call_started") ||
        allEventText.includes("callstart");

      // ==============================
      // CALL JOIN
      // ==============================
      const isCallJoin =
        /rtc.*call.*join/.test(allEventText) ||
        /call.*join/.test(allEventText) ||
        /join.*call/.test(allEventText) ||
        /call.*participant/.test(allEventText) ||
        /participant.*call/.test(allEventText) ||
        allEventText.includes("call_joined") ||
        allEventText.includes("calljoined") ||
        allEventText.includes("participant_join");

      // ==============================
      // IGNORE UNRELATED EVENTS
      // ==============================
      if (
        !isNameChange &&
        !isImageChange &&
        !isCallStart &&
        !isCallJoin
      ) {
        return;
      }

      // ==============================
      // DEBUG CALL EVENT
      // ==============================
      if (isCallStart || isCallJoin) {
        console.log(
          "\n========== [GC CALL EVENT] =========="
        );

        console.log("Type:", type);
        console.log("Action:", action);
        console.log("LogMessageType:", logMessageType);
        console.log(
          "LogMessageData:",
          logMessageData
        );

        console.log(
          "Detected:",
          isCallJoin
            ? "CALL JOIN"
            : isCallStart
              ? "CALL START"
              : "CALL EVENT"
        );

        console.log(
          "====================================\n"
        );
      }

      // ==============================
      // GET GROUP NAME
      // ==============================
      let threadName = "Unknown Group";

      try {
        const threadInfo =
          await api.getThreadInfo(threadID);

        threadName =
          threadInfo?.threadName ||
          "Unnamed Group";
      } catch (e) {
        try {
          const tData =
            await threadsData.get(threadID);

          threadName =
            tData?.threadName ||
            "Unnamed Group";
        } catch {}
      }

      // ==============================
      // FIND USER ID
      // ==============================
      let initiatorID =
        author ||
        senderID ||
        logMessageData?.participantId ||
        logMessageData?.participantID ||
        logMessageData?.userID ||
        logMessageData?.participant_id ||
        logMessageData?.user_id ||
        logMessageData?.actorId ||
        logMessageData?.actorID ||
        logMessageData?.actor_id ||
        logMessageData?.callerId ||
        logMessageData?.callerID ||
        logMessageData?.caller_id;

      // Extra call fields
      if (!initiatorID) {
        initiatorID =
          logMessageData?.joinedUserId ||
          logMessageData?.joinedUserID ||
          logMessageData?.joinerId ||
          logMessageData?.joinerID ||
          logMessageData?.memberId ||
          logMessageData?.memberID;
      }

      // ==============================
      // GET USER NAME
      // ==============================
      let userName = "Unknown User";

      if (initiatorID) {
        try {
          const info =
            await api.getUserInfo(
              initiatorID
            );

          if (
            info &&
            info[initiatorID]
          ) {
            userName =
              info[initiatorID].name ||
              "User";
          }
        } catch (e) {
          try {
            const userData =
              await usersData.get(
                initiatorID
              );

            userName =
              userData?.name ||
              "User";
          } catch {}
        }
      }

      // ==============================
      // MESSAGE
      // ==============================
      let title =
        "📢 GROUP UPDATE";

      let statusText = "";

      // ==============================
      // GROUP NAME
      // ==============================
      if (isNameChange) {
        const newName =
          logMessageData?.name ||
          logMessageData?.threadName ||
          event.logMessageData?.name ||
          "New Name";

        title =
          "✏️ GROUP NAME CHANGED";

        statusText =
          `👤 Updated By : ${userName}\n` +
          `👥 Group Name  : ${threadName}\n` +
          `📝 New Name    : ${newName}`;
      }

      // ==============================
      // GROUP IMAGE
      // ==============================
      else if (isImageChange) {
        title =
          "🖼️ GROUP IMAGE CHANGED";

        statusText =
          `👤 Updated By : ${userName}\n` +
          `👥 Group Name  : ${threadName}\n` +
          `📌 Status      : গ্রুপের প্রোফাইল পিকচার আপডেট করা হয়েছে!`;
      }

      // ==============================
      // CALL START
      // ==============================
      else if (isCallStart) {
        title =
          "📞 CALL STARTED";

        statusText =
          `👤 Call Started By : ${userName}\n` +
          `👥 Group Name      : ${threadName}\n` +
          `⏰ Time            : ${new Date().toLocaleString(
            "en-BD",
            {
              timeZone: "Asia/Dhaka"
            }
          )}\n\n` +
          `👉 সবাই দ্রুত গ্রুপ কলে জয়েন করুন!`;
      }

      // ==============================
      // CALL JOIN
      // ==============================
      else if (isCallJoin) {
        title =
          "🎧 CALL JOINED";

        statusText =
          `💝 গ্রুপ কলে স্বাগতম! 🤗\n\n` +
          `👤 Member Name : ${userName}\n` +
          `👥 Group Name  : ${threadName}\n` +
          `📌 Status      : ${userName} গ্রুপ কলে যুক্ত হয়েছেন।\n` +
          `🎉 Enjoy The Call! ❤️`;
      }

      // ==============================
      // SAFETY
      // ==============================
      if (!statusText) return;

      // ==============================
      // FINAL MESSAGE
      // ==============================
      const alertMessage =
        `╭━━━〔 🤖 ${title} 〕━━━╮\n\n` +
        `${statusText}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👑 𝐎𝐖𝐍𝐄𝐑 : 𝐀𝐑𝐈𝐘𝐀𝐍 𝐒𝐀𝔹𝔹𝐈𝐑\n` +
        `🤖 𝐁𝐎𝐓   : 𝐀𝐑𝐈𝐘𝐀𝐍 𝐂𝐇𝐀𝐓 𝐁𝐎𝐓\n` +
        `╰━━━━━━━━━━━━━━━━━━╯`;

      // ==============================
      // SEND TEXT
      // ==============================
      await new Promise(resolve => {
        api.sendMessage(
          alertMessage,
          threadID,
          err => {
            if (err) {
              console.log(
                "[GC Update] Text send error:",
                err.message
              );
            }

            resolve();
          }
        );
      });

      // ==============================
      // SEND IMAGE
      // ==============================
      try {
        const imagePath =
          path.join(
            __dirname,
            "cache",
            `gc_${threadID}_${Date.now()}.jpg`
          );

        const imageUrl =
          "https://i.imgur.com/8Km9tLL.jpg";

        const response =
          await axios.get(
            imageUrl,
            {
              responseType:
                "arraybuffer",
              timeout: 10000
            }
          );

        if (
          response.data &&
          response.data.length > 500
        ) {
          fs.writeFileSync(
            imagePath,
            Buffer.from(
              response.data
            )
          );

          await new Promise(
            resolve => {
              api.sendMessage(
                {
                  attachment:
                    fs.createReadStream(
                      imagePath
                    )
                },
                threadID,
                err => {
                  if (err) {
                    console.log(
                      "[GC Update] Image send error:",
                      err.message
                    );
                  }

                  try {
                    if (
                      fs.existsSync(
                        imagePath
                      )
                    ) {
                      fs.unlinkSync(
                        imagePath
                      );
                    }
                  } catch {}

                  resolve();
                }
              );
            }
          );
        }
      } catch (imageError) {
        console.log(
          "[GC Update] Image failed, text notification kept."
        );
      }

    } catch (error) {
      console.log(
        "[GC Update] Error:",
        error.message
      );
    }
  }
};
