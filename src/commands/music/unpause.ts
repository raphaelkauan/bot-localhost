import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../../utils/functions/play-music";

export default new Command({
  name: "unpause",
  type: ApplicationCommandType.ChatInput,
  description: "Retoma a música pausada no canal de voz.",

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
      await interaction.reply({ ephemeral: true, content: "Não há nenhuma música pausada no momento!" });
      return;
    }

    if (musicState.player.state.status === "paused") {
      musicState.player.unpause();

      await interaction.reply({ content: "▶️ A música foi retomada!" });
      return;
    }
    await interaction.reply({ ephemeral: true, content: "A música já está tocando!" });
  },
});
