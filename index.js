const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot activo 24/7");
});

app.listen(3000, () => {
  console.log("Web activa");
});
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const PREFIX = "-";

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX + "role")) return;

  const args = message.content.split("|").map(arg => arg.trim());

  const user = message.mentions.members.first();
  if (!user) return message.reply("Menciona un usuario.");

  // 🧠 TODO dinámico
  const rolesInput = args.slice(1, args.length - 2); // todos menos region y nota
  const region = args[args.length - 2];
  const notes = args[args.length - 1];

  // 🎯 EMBED
  const embed = new EmbedBuilder()
    .setTitle("📊 | Ranking Log")
    .setDescription(
      `**Target**\n${user}

**Rank**
${rolesInput.join(" | ")}

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

  // ❌ quitar roles viejos (los tuyos)
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

  // ✅ agregar roles dinámicos
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

  message.delete().catch(() => {});
});

client.login(process.env.TOKEN);
