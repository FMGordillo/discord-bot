import "https://deno.land/x/denv/mod.ts";
import { Client, Message } from "https://deno.land/x/cordeno/mod.ts";
import { Weather } from "./util/index.ts";

const client = new Client({
  token: Deno.env.toObject().DISCORD_BOT_TOKEN,
});

const weather = new Weather(Deno.env.toObject().WEATHER_APIKEY);

console.log(`Running v${client.version}`);

for await (const ctx of client) {
  switch (ctx.event) {
    case "READY":
      console.log("Discord server is ready!");
      break;

    case "MESSAGE_CREATE":
      const msg: Message = ctx;

      if (msg.content.includes("clima")) {
        console.log(await weather.getWeather("Buenos Aires"));
      }
      console.log(
        "The message is",
        msg.content,
        "and the author is",
        msg.author,
      );
      break;
    default:
      console.log("IDK", ctx.event);
      break;
  }
}
