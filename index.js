// 🔥 WEB (OBLIGATORIO PARA RENDER)
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot activo 24/7");
});

app.listen(3000, () => {
  console.log("Web activa");
});

// 🤖 BOT
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = "-";

client.on("ready", () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX + "role")) return;

    const args = message.content.split("|").map(a => a.trim());

    const user = message.mentions.members.first();
    if (!user) return message.reply("Menciona un usuario.");

    const rolesInput = args.slice(1, args.length - 2);
    const region = args[args.length - 2];
    const notes = args[args.length - 1];

    const embed = new EmbedBuilder()
      .setTitle("📊 | Ranking Log")
      .setDescription(
        `**Target**\n${user}

**Rank**
${rolesInput.join(" | ") || "N/A"}

**Region**
${region || "N/A"}

**Notes**
${notes || "N/A"}`
      )
      .setThumbnail(user.user.displayAvatarURL())
      .setColor("#5865F2")
      .setFooter({
        text: `Evaluated by ${message.author.username}`
      });

    await message.channel.send({ embeds: [embed] });

    const rolesToRemove = [
      "1483990316808798218",
      "1483990317672693901",
      "1483990318809350295"
    ];

    for (const roleId of rolesToRemove) {
      const role = message.guild.roles.cache.get(roleId);
      if (role && user.roles.cache.has(roleId)) {
        await user.roles.remove(role);
      }
    }

    const rolesToAdd = [...rolesInput, region];

    for (const roleName of rolesToAdd) {
      if (!roleName) continue;

      const role = message.guild.roles.cache.find(
        r => r.name.toLowerCase() === roleName.toLowerCase()
      );

      if (role) {
        await user.roles.add(role);
      }
    }

  } catch (err) {
    console.error("ERROR:", err);
  }
});

// 🔑 LOGIN
client.login(process.env.TOKEN);
