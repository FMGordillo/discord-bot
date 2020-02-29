const Discord = require("discord.js");
const client = new Discord.Client();

const assistantId = process.env.WATSON_ASSISTANT_ID;
const watson = require("./watson");
const shuffle = require("./random");
const talkingToBot = require("./talking-to-bot");
const netflixSuggestionsAPI = require("./netflix-suggestions");

const prefix = "papurri";

const ACTIONS = {
  // aiuda: help,
  nefli: netflixSuggestionsAPI,
  random: shuffle
};

let sessionId = client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  watson.createSession(
    {
      assistantId
    },
    (err, res) => {
      sessionId = res.result.session_id;
    }
  );
});

client.on("message", async msg => {
  /**
   * ESTO ES PARA LA JODA
   */
  if (
    new RegExp("^!p|-p|pls play").test(msg) &&
    msg.channel.id === process.env.MAIN_TEXT_CHANNEL
  ) {
    msg.reply("PARA ESO EXISTE EL OTRO CANAL, MOGOLIC@");
  }

  // Exit!!
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  if (msg.content.startsWith(`${prefix} bot`)) {
    // Aca va nuestro Watson Assistant
    watson
      .message({
        input: { text: msg.content.slice(prefix.length) },
        assistantId,
        sessionId
      })
      .then(res => {
        console.log(res);
        res.result.output.generic.forEach(response => {
          msg.reply(response.text);
        });
      })
      .catch(err => console.error("ERROR, ERROR beep", err));

    // watson.message({
    // input: { text: "What's the weather?" },
    // assistantId: '<assistant id>',
    // sessionId: '<session id>',
    // })
  }

  /**
   * QUE CARAJO HICE ACA?!?!?!?!
   */
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

  // if (
  //   new RegExp("^papurri metete").test(msg) &&
  //   client.channels.get(process.env.MAIN_VOICE_CHANNEL).joinable
  // ) {
  //   msg.reply("Ahi me conecto bb");
  //   client.channels
  //     .get(process.env.MAIN_VOICE_CHANNEL)
  //     .join()
  //     .then(data => {
  //       msg.reply("Eeeexitoooo");
  //     })
  //     .catch(err => {
  //       msg.reply("Algo falló hdrmp, arreglalo ahre");
  //       console.log(err);
  //     });
  // }
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
