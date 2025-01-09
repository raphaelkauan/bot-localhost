import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../../utils/functions/playMusic";
import { validationChannel } from "../../utils/functions/validationChannel";

export default new Command({
  name: "unpause",
  type: ApplicationCommandType.ChatInput,
  description: "Retoma a música pausada no canal de voz.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

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
