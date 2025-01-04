import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../../utils/functions/play-music";
import ytdl from "@distube/ytdl-core";

export default new Command({
  name: "fila",
  type: ApplicationCommandType.ChatInput,
  description: "Exibe as músicas que estão na fila.",

  async run({ interaction }) {
    if (!musicState.queue.length) {
      await interaction.reply({
        ephemeral: true,
        content: "A fila está vazia! Adicione músicas usando o comando `/play`.",
      });
      return;
    }

    interaction.deferReply();

    const songTitles: string[] = [];

    for (const [index, song] of musicState.queue.entries()) {
      const songInfo = await ytdl.getInfo(song);
      const title = songInfo.videoDetails.title;
      songTitles.push(`**#${index + 1} - ${title}\n**`);
    }

    const embed = new EmbedBuilder()
      .setColor("#1DB954")
      .setTitle("🎶 Fila de Músicas")
      .setDescription(`🦘 Música(s) que estão na fila no momento:\n\n ${songTitles.join("\n")}`)
      //   .setFields({ name: "\n", value: "💡 Dica: Digite '/skip' para pular de música" })
      .setFooter({
        text: `Total: ${musicState.queue.length} música(s)`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
});
