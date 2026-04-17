



   
// 🔥 WEB
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

    // 🔹 dividir por comas
    const args = message.content.split(",").map(a => a.trim());

    const user = message.mentions.members.first();
    if (!user) return message.reply("Menciona un usuario.");

    // quitar el comando del primer argumento
    args[0] = args[0].replace("-role", "").trim();

    // roles = todo menos los últimos 2
    const rolesInput = args.slice(1, args.length - 2);

    const region = args[args.length - 2] || "N/A";
    const notes = args[args.length - 1] || "N/A";

    // 🎯 EMBED
    const embed = new EmbedBuilder()
      .setTitle("📊 | Ranking Log")
      .setDescription(
        `**Target**  
${user}

**Rank result**  
${rolesInput.join(" | ") || "N/A"}

**Region**  
${region}

**Notes**  
${notes}`
      )
      .setThumbnail(user.user.displayAvatarURL())
      .setColor("#5865F2")
      .setFooter({
        text: `Evaluated by ${message.author.username} • ${new Date().toLocaleTimeString()}`
      });

    await message.channel.send({ embeds: [embed] });

    // ❌ quitar roles
    const rolesToRemove = [
      "1483990316808798218",
      "1483990317672693901",
      "1483990318809350295",
      "1483990319883358219",
      "1483990321015820412",
      "1483990322508988594",
      "1483990324190773429",
      "1483990326275473610",
      "1483990326979858535",
      "1483990328561369109",
      "1483990332176863314",
      "1483990330851201095",
      "1483990329685311559"
    ];

    for (const roleId of rolesToRemove) {
      const role = message.guild.roles.cache.get(roleId);
      if (role && user.roles.cache.has(roleId)) {
        await user.roles.remove(role);
      }
    }

    // ✅ agregar roles
    const rolesToAdd = [...rolesInput, region];

    for (const roleName of rolesToAdd) {
      const role = message.guild.roles.cache.find(
        r => r.name.toLowerCase() === roleName.toLowerCase()
      );

      if (role) {
        await user.roles.add(role);
      }
    }

    message.delete().catch(() => {});

  } catch (err) {
    console.error("ERROR:", err);
  }
});

client.login(process.env.TOKEN);
