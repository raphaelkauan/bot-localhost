import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import { musicState } from "../../utils/functions/play-music";

dotenv.config();

export default new Command({
  name: "pause",
  type: ApplicationCommandType.ChatInput,
  description: "Pausa música que está tocando no momento.",

  async run({ interaction }) {
    const channelId = process.env.CHANNEL_MUSIC_ID;

    if (interaction.channelId != channelId) {
      await interaction.reply({
        ephemeral: true,
        content:
          "Você está tentando executar este comando no canal errado. Por favor, utilize o canal para pedidos de música.",
      });
      return;
    }

    if (!musicState.player) {
      await interaction.reply({ ephemeral: true, content: "Não há nenhuma música tocando no momento!" });
      return;
    }

    const pause = musicState.player.pause();

    if (pause) {
      await interaction.reply({ content: "⏸️ A música foi pausada!" });
      return;
    }
    await interaction.reply({ ephemeral: true, content: "Houve um erro ao tentar pausar a música." });
  },
});
