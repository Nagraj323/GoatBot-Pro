module.exports = {
  config: {
    name: "adminmention",
    version: "1.3.2",
    author: "MOHAMMAD AKASH",
    countDown: 0,
    role: 0,
    shortDescription: "Replies angrily when someone tags admins",
    longDescription: "If anyone mentions an admin, bot will angrily reply with random messages.",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const adminIDs = ["100028959431665", "61591654275272", "100028959431665"].map(String);

    // Skip if sender is admin
    if (adminIDs.includes(String(event.senderID))) return;

    // যদি কেউ মেনশন দেয়
    const mentionedIDs = event.mentions ? Object.keys(event.mentions).map(String) : [];
    const isMentioningAdmin = adminIDs.some(id => mentionedIDs.includes(id));

    if (!isMentioningAdmin) return;

    // র‍্যান্ডম রাগী রিপ্লাই
    const REPLIES = [
      " ওরে মেনশন দিস না নাগীন নিয়া চিপায় গেছে 😩🐸",
      "বস এক আবাল তুমারে ডাকতেছে 😂😏",
      " বুকাচুদা তুই মেনশন দিবি না আমার বস রে 🥹",
      "মেনশন দিছস আর বেচে যাবি? দারা বলতাছি 😠",
      "Boss এখন নাগীনের সাথে বিজি আছে 😌🥱"
      "নাগরাজ নাগরানীর সাথে বিজি আছে 🐍🌚"
    ];

    const randomReply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    return message.reply(randomReply);
  }
};
