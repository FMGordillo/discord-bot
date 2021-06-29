const client = new Discord.Client();
const Discord = require("discord.js");
const Sentry = require("@sentry/node");

const watson = require("./watson");
const shuffle = require("./random");
const talkingToBot = require("./talking-to-bot");
const netflixSuggestionsAPI = require("./netflix-suggestions").default;
const weather = require("./weather");

const prefix = "papurri";
const assistantId = process.env.WATSON_ASSISTANT_ID;

const ACTIONS = {
  // aiuda: help,
  nefli: netflixSuggestionsAPI,
  random: shuffle,
};

/**
 * [
 * { userId: {
 * sessionId: String,
 * lastMessage: Date
 * }]
 */
let sessionHolder = [];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  // Exit!!
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  if (msg.content.startsWith("papurri clima")) {
    let weatherInfo = await weather.getCurrentWeather();
    msg.reply(
      `PARA QUE QUERES SABER ESO GORDITO SI ESTAS EN CUARENTENA DIOSS: ${weatherInfo}`,
      {
        embed: {
          image: {
            url: `http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`,
          },
        },
      }
    );
    return;
  }

  if (msg.content.startsWith(`${prefix} bot`)) {
    const removeThis = "papurri bot";
    const text = msg.content.slice(removeThis.length);

    const aut = await watson.updateSessionHolder(sessionHolder, msg);
    if (aut) {
      await watson.sendMessageToWatson(aut, text, msg);
    }
    return;
  }

  /**
   * QUE CARAJO HICE ACA?!?!?!?!
   */
  const [_, action] = msg.content.split(" ");
  if (!action || action == "" || !Object.keys(ACTIONS).includes(action)) return;
  ACTIONS[action](msg)
    .then((response) => msg.reply(response))
    .catch((error) => {
      Sentry.captureException(error);
      msg.reply(
        `Hubo un error con el comando **${action}**:
      \`${error.message}\``
      );
    }
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
  return;
});

client
  .login(process.env.BOT_TOKEN)
  .then(() => {
    const mainChannel = client.channels.get(process.env.MAIN_TEXT_CHANNEL);
    console.log(`Logged at: ${mainChannel}`);
  })
  .catch((error) => {
    console.error(`LOGIN() error`, error);
    Sentry.captureException(error);
  });

exports.talkingToBot = talkingToBot;
module.exports = client;
