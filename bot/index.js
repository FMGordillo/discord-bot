const Discord = require("discord.js");
const client = new Discord.Client();

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
  random: shuffle
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
    /*AUTHoR: SANTU
  ------
  1) papurri bot <alguna frase o algo>
  2) se ejecuta un metodo llamado actualizarSesion, que chequea todo el quilombo de abajo
    2-1-1) Se chequea que no tiene sesion y se le crea una;
    2-1-2) Se ejecuta el paso 3);

    2-2-1) Se chequea que tiene pero paso mas de un minuto del ultimo mensaje;
    2-2-2) Se renueva la sesión, y no se le da mas pelota hasta que ingrese otro comando;

    2-3-1) Se chequea que tiene sesion y paso menos de un minuto del ultimo mensaje;
    2-3-2) Se ejecuta el paso 3)
  3) Se responde a lo ingresado despues del papurri bot;
  */
  if(msg.content.startsWith("papurri clima")){
    let temp= await weather.getTemperature();
    msg.reply(`la calor: ${temp}`);
    return;
  }
  
  if (msg.content.startsWith(`${prefix} bot`)) {
    
    const removeThis = "papurri bot";
    const text = msg.content.slice(removeThis.length);

    const aut= await watson.updateSessionHolder(sessionHolder,msg)
    if(aut){
      await watson.sendMessageToWatson(aut,text,msg);
    }
    return;
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
  return;
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
