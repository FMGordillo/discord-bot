const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  const isMusic = new RegExp("!p|-p|pls play");

  if (isMusic.test(msg) && msg.channel.id === process.env.MAIN_TEXT_CHANNEL) {
    // console.log("MENSAJE", msg);
    // console.log("data", client);
    msg.reply("PARA ESO EXISTE EL OTRO CANAL, MOGOLIC@");
  }
});

client.login(process.env.BOT_TOKEN).then(done => {
  const mainChannel = client.channels.get(process.env.MAIN_TEXT_CHANNEL);
  // console.log(mainChannel);
});

module.exports = client;
