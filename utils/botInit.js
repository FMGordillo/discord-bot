const Discord = require("discord.js");
const client = new Discord.Client();

const netflixSuggestionsAPI = require("./netflix-suggestions");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (
    new RegExp("^!p|-p|pls play").test(msg) &&
    msg.channel.id === process.env.MAIN_TEXT_CHANNEL
  ) {
    msg.reply("PARA ESO EXISTE EL OTRO CANAL, MOGOLIC@");
  }

  const prefix = "papurri";
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  if (msg.content.includes("netflix")) {
    netflixSuggestionsAPI().then(({ data }) => {
      msg.reply(`Te recomiendo ${data.title}`);
      msg.reply(`Se trata de: ${data.overview}`);
    });
  }

  if (
    new RegExp("^papurri metete").test(msg) &&
    client.channels.get(process.env.MAIN_VOICE_CHANNEL).joinable
  ) {
    msg.reply("Ahi me conecto bb");
    client.channels
      .get(process.env.MAIN_VOICE_CHANNEL)
      .join()
      .then(data => {
        msg.reply("Eeeexitoooo");
      })
      .catch(err => {
        msg.reply("Algo falló hdrmp, arreglalo ahre");
        console.log(err);
      });
  }
});

client.login(process.env.BOT_TOKEN).then(done => {
  const mainChannel = client.channels.get(process.env.MAIN_TEXT_CHANNEL);
  // console.log(mainChannel);
});

module.exports = client;
