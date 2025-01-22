import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState, playMusic } from "../../utils/functions/playMusic";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";

export default new Command({
  name: "skip",
  type: ApplicationCommandType.ChatInput,
  description: "Pular para a próxima música na fila.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    if (!musicState.connection) {
      interaction.reply({
        ephemeral: true,
        embeds: [createEmbedInformation(colors.yellow, "Informação", "Não existe música tocando!")],
      });
    }

    if (musicState.queue.length === 0) {
      interaction.reply({
        ephemeral: true,
        embeds: [createEmbedInformation(colors.yellow, "Informação", "Não existe música na fila!")],
      });
    }

    await playMusic();

    await interaction.reply({
      embeds: [
        createEmbedInformation(
          colors.blueMusic,
          "Informação",
          `${interaction.user.displayName} música tocando!`
        ),
      ],
    });
  },
});
