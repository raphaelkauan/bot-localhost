import { ApplicationCommandType, EmbedBuilder, formatEmoji } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../../utils/functions/playMusic";
import ytdl from "@distube/ytdl-core";
import dotenv from "dotenv";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";

dotenv.config();

export default new Command({
  name: "fila",
  type: ApplicationCommandType.ChatInput,
  description: "Exibe as músicas que estão na fila.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    if (!musicState.queue.length) {
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

    interaction.deferReply({ ephemeral: true });

    const songTitles: string[] = [];

    for (const [index, song] of musicState.queue.entries()) {
      const songInfo = await ytdl.getInfo(song);
      const title = songInfo.videoDetails.title;
      songTitles.push(`**#${index + 1} - ${title}\n**`);
    }

    const embed = new EmbedBuilder()
      .setColor("#1DB954")
      .setTitle("🎶 Fila de Músicas")
      .setDescription(
        `${formatEmoji(
          "1328450336888848486",
          true
        )} Música(s) que estão na fila no momento:\n\n ${songTitles.join("\n")}`
      )
      //   .setFields({ name: "\n", value: "💡 Dica: Digite '/skip' para pular de música" })
      .setFooter({
        text: `Total: ${musicState.queue.length} música(s)`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
});
