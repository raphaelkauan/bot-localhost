import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState, playMusic } from "../../utils/functions/play-music";
import { validationChannel } from "../../utils/functions/validation-channel";

export default new Command({
  name: "skip",
  type: ApplicationCommandType.ChatInput,
  description: "Pular para a próxima música na fila.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

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
