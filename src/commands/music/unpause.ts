import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../../utils/functions/playMusic";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";

export default new Command({
  name: "unpause",
  type: ApplicationCommandType.ChatInput,
  description: "Retoma a música pausada no canal de voz.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    if (!musicState.player) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbedInformation(colors.yellow, "Informação", "Não há nenhuma música pausada no momento!"),
        ],
      });
      return;
    }

    if (musicState.player.state.status === "paused") {
      musicState.player.unpause();

      await interaction.reply({
        embeds: [createEmbedInformation(colors.blue, "Informação", "▶️ A música foi retomada!")],
      });
      return;
    }
    await interaction.reply({
      ephemeral: true,
      embeds: [createEmbedInformation(colors.yellow, "Informação", "A música já está tocando!")],
    });
  },
});
