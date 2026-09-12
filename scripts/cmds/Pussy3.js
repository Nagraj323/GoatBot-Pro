module.exports = {
	config: {
		name: "pussy3",
		aliases: ["18+"],
		version: "1.0",
		author: "Doru fix by kivv",
		countDown: 5,
		role: 2,
		shortDescription: "send you pic of pussy",
		longDescription: "sends u pic of girls pussy",
		category: "NSFW",
		guide: "{pn}"
	},

	onStart: async function ({ message }) {
	 var link = [ 
"https://i.ibb.co.com/whk7zCCm/2064.jpg",
"https://i.ibb.co.com/NnkWmcFw/images-3.jpg",
"https://i.ibb.co.com/qLhCDTPQ/68e98449eb450985331583.jpg",
"https://i.ibb.co.com/GQV0PnSg/24650695.jpg",
"https://i.ibb.co.com/cmWtS6K/52371.jpg",
"https://i.ibb.co.com/BHQ5CqBR/images-4.jpg",
"",
"",
"",
  ]
let img = link[Math.floor(Math.random()*link.length)]
message.send({
  body: 'ã€Œ PussyðŸ’¦ðŸ¥µ ã€',attachment: await global.utils.getStreamFromURL(img)
})
}
}
