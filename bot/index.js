const Discord = require("discord.js");
const client = new Discord.Client();

const talkingToBot = require("./talking-to-bot");
const shuffle = require("./random");
const netflixSuggestionsAPI = require("./netflix-suggestions");

const prefix = "papurri";

const ACTIONS = {
  // aiuda: help,
  nefli: netflixSuggestionsAPI,
  random: shuffle
};

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

  // Exit!!
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const [_, action] = msg.content.split(" ");
  if (!action || action == "" || !Object.keys(ACTIONS).includes(action)) return;

  ACTIONS[action](msg)
    .then(response => msg.reply(response))
    .catch(error =>
      msg.reply(
        `Hubo un error con el comando **${action}**:
      \`${error.message}\``
      )
    );

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

client
  .login(process.env.BOT_TOKEN)
  .then(done => {
    const mainChannel = client.channels.get(process.env.MAIN_TEXT_CHANNEL);
    // console.log(mainChannel);
  })
  .catch(error => {
    console.error(`LOGIN() error`, error);
  });

exports.talkingToBot = talkingToBot;
module.exports = client;
