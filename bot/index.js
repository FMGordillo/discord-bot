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
  ------
  Yo considero que esto va a tener que hacerse despuesde chequear lo del session Id, y obviamente
  lo del session Id deberia estar todo en una funcion pero eso lo intento despues

  Tipo, siempre que alguien solicite al bot PARA LO QUE SEA, que primero haga eso del sessionId
  y dsp procese la petición
  por ejemplo:

  1) papurri bot <alguna frase o algo>
  2) se ejecuta un metodo llamado actualizarSesion, que chequea todo el quilombo de abajo
  °°°°°°2-1-1) Se chequea que no tiene sesion y se le crea una;
  °°°°°°2-1-2) Se ejecuta el paso 3);

  °°°°°°2-2-1) Se chequea que tiene pero paso mas de un minuto del ultimo mensaje;
  °°°°°°2-2-2) Se renueva la sesión, y no se le da mas pelota hasta que ingrese otro comando;

  °°°°°°2-3-1) Se chequea que tiene sesion y paso menos de un minuto del ultimo mensaje;
  °°°°°°2-3-2) Se ejecuta el paso 3)
  3) Se responde a lo ingresado despues del papurri bot;
  
  Y con respecto a abstraer la logica de actualizar la tabla de sesiones updateSessionHolder()
  yo creo que todas las funcines que tengan que ver con watson van en el modulo de watson porque 
  weno watsonxd, nose tu que opinas
  */

  
  if (msg.content.startsWith(`${prefix} bot`)) {
    // Aca va nuestro Watson Assistant

    /**
     * 1) Chequeamos que el usuario que habló tenga un sessionid.
     * if(!sessionId) 2.1 else 2.2
     * 2.1) Creamos un sessionId
     * 2.2) Chequeamos tiempo del mensaje actual con el último mensaje
     * 2.2.1) if(tiempo_actual - tiempo_guardado > 1min) 2.1 else 3
     * 3)
     */
    
    const removeThis = "papurri bot";
    const text = msg.content.slice(removeThis.length);
    const temp = await weather.getTemperature();

    const author = msg.author.id;
    let authorSessionId = sessionHolder.findIndex(val => val.id === author);
    let authorSession =
      authorSessionId !== -1 ? sessionHolder[authorSessionId] : {};

    if (authorSession.sessionId) {
      const now = Date.now();
      // Seguimos con 2
      console.log("AUTHOR", authorSession);
      if (now - Date.parse(authorSession.lastMessage) > 60000) {
        //TODO: Tomar la fecha de Discord
        const newSession = await watson.createSession({ assistantId });
        authorSession.sessionId = newSession.result.session_id;
        authorSession.lastMessage = new Date();
        sessionHolder[authorSessionId] = authorSession;
        msg.reply("Te hacemos nueva sesion bb, arranca de cero");
        return;
      }
      await sendMessageToWatson(authorSession,text,msg)
    } else {
      const {
        result: { session_id }
      } = await watson.createSession({
        assistantId
      });
      const sessionAuthor = {
        id: author,
        sessionId: session_id,
        lastMessage: new Date() //TODO: Tomar la fecha de Discord
      };
      sessionHolder.push(sessionAuthor);
      await sendMessageToWatson(sessionAuthor, text, msg);
    }

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

async function sendMessageToWatson(author, text, msg) {
  const response = await watson.message({
    input: { text },
    sessionId: author.sessionId,
    assistantId
  });
  response.result.output.generic.forEach(result => {
    result.response_type === "text" && msg.reply(result.text);
  });
}

exports.talkingToBot = talkingToBot;
module.exports = client;
