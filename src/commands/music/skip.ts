import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState, playMusic } from "../../utils/functions/play-music";

export default new Command({
  name: "skip",
  type: ApplicationCommandType.ChatInput,
  description: "Pular para a próxima música na fila.",

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

    if (!musicState.connection) {
      interaction.reply({ ephemeral: true, content: `Não existe música tocando!` });
    }

    if (musicState.queue.length === 0) {
      interaction.reply({ ephemeral: true, content: `Não existe música na fila!` });
    }

    await interaction.reply({ content: `🎶 ${musicState.queue[0]}` });
    playMusic();
  },
});
