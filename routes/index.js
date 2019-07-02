const router = require("express").Router();

module.exports = bot => {
  router.get("/", (req, res) => {
    console.log(bot.channels.TextChannels);

    res.render("index", { title: "Welcome", channels: bot.channels.array() });
  });
  return router;
};
