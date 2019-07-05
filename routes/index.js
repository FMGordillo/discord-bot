const router = require("express").Router();

module.exports = bot => {
  router.get("/", (req, res) => {
    console.log(bot.channels);

    if (bot.channels.size <= 0) {
      res.render("index", { title: "Welcome", isLoaded: false });
    } else {
      res.render("index", {
        title: "Welcome",
        isLoaded: true,
        channels: bot.channels.array()
      });
    }
  });
  return router;
};
