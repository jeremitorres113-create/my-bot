const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(3000);

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log("Bot listo ✅");
});

client.login(process.env.TOKEN);
