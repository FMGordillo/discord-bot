const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

const assistant = new AssistantV2({
  version: "2020-02-05",
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_ASSISTANT_APIKEY
  }),
  url: "https://api.us-south.assistant.watson.cloud.ibm.com"
});

module.exports = assistant;
