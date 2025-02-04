import { ApplicationCommandType, EmbedBuilder, formatEmoji } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";
import MyPlayer from "../../utils/classes/MyPlayer";
import { manager } from "../..";
import { info } from "./play";

dotenv.config();

export default new Command({
  name: "fila",
  type: ApplicationCommandType.ChatInput,
  description: "Exibe as músicas que estão na fila.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    const myPlayer = new MyPlayer(await manager);
    const player = myPlayer.createMyPlayer(info.guildId, info.voiceChannelId, info.channelId, false);

    if (player.queue.size === 0) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbedInformation(
            colors.yellow,
            "Informação",
            "A fila está vazia! Adicione músicas usando o comando `/play`."
          ),
        ],
      });
      return;
    }

    const songTitles: string[] = [];

    for (let i = 0; i < player.queue.tracks.length; i++) {
      let title = player.queue.tracks[i].title;
      songTitles.push(`**#${i + 1} - ${title.slice(0, 3)}...\n**`);
    }

    const embed = new EmbedBuilder()
      .setColor("#1DB954")
      .setTitle("🎶 Fila de Músicas (O título permanece oculto para maior privacidade)")
      .setDescription(
        `${formatEmoji(
          "1328450336888848486",
          true
        )} Música(s) que estão na fila no momento:\n\n ${songTitles.join("\n")}`
      )
      //   .setFields({ name: "\n", value: "💡 Dica: Digite '/skip' para pular de música" })
      .setFooter({
        text: `Total: ${player.queue.size} música(s)`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({ ephemeral: true, embeds: [embed] });
  },
});
