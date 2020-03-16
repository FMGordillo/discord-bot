const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

const assistant = new AssistantV2({
  version: "2020-02-05",
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_ASSISTANT_APIKEY
  }),
  url: "https://api.us-south.assistant.watson.cloud.ibm.com"
});
const assistantId = process.env.WATSON_ASSISTANT_ID;

async function sendMessageToWatson(author, text, msg) {
  const response = await assistant.message({
    input: { text },
    sessionId: author.sessionId,
    assistantId
  });
  let res;
  for(let i=0; i< response.result.output.generic.length;i++){
    res=response.result.output.generic[i];
    if( res === "text" && msg.reply(res.text)){ return;}
  }
}

async function updateSessionHolder(sessionHolder,msg){
  const author = msg.author.id;
  let authorSessionId = sessionHolder.findIndex(val => val.id === author);
  let authorSession =
    authorSessionId !== -1 ? sessionHolder[authorSessionId] : {};

    if (authorSession.sessionId) {
    const now = Date.now();

    if (now - Date.parse(authorSession.lastMessage) > 60000) {
      //TODO: Tomar la fecha de Discord
      const newSession = await assistant.createSession({ assistantId });
      authorSession.sessionId = newSession.result.session_id;
      authorSession.lastMessage = new Date();
      sessionHolder[authorSessionId] = authorSession;
      msg.reply("Te hacemos nueva sesion bb, arranca de cero");
      return ;
    }
    //cuando es menor a un mminuto
    return authorSession;
  }else {
      const {
        result: { session_id }
      } = await assistant.createSession({
        assistantId
      });
      const sessionAuthor = {
        id: author,
        sessionId: session_id,
        lastMessage: new Date() //TODO: Tomar la fecha de Discord
      };
      sessionHolder.push(sessionAuthor);
      return sessionAuthor;
    }
}

module.exports = {assistant,sendMessageToWatson,updateSessionHolder};
