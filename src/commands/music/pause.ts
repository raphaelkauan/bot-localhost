import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import { musicState } from "../music/play";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";

dotenv.config();

export default new Command({
  name: "pause",
  type: ApplicationCommandType.ChatInput,
  description: "Pausa música que está tocando no momento.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    if (!musicState.playerAudio) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbedInformation(colors.yellow, "Informação", "Não há nenhuma música tocando no momento!"),
        ],
      });
      return;
    }

    const pause = musicState.playerAudio.pause();

    if (pause) {
      await interaction.reply({
        embeds: [createEmbedInformation(colors.blue, "Informação", "⏸️ A música foi pausada!")],
      });
      return;
    }
    await interaction.reply({
      ephemeral: true,
      embeds: [createEmbedInformation(colors.red, "Aviso", "Houve um erro ao tentar pausar a música.")],
    });
  },
});
