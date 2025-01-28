import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../music/play";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";

export default new Command({
  name: "stop",
  type: ApplicationCommandType.ChatInput,
  description: "Parar de tocar música(s). Atenção, este comando limpará toda a fila de músicas.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    if (musicState.connection) {
      musicState.connection.destroy();
      musicState.connection = null;

      while (musicState.queue.length) {
        musicState.queue.pop();
      }
    }

    interaction.reply({
      embeds: [
        createEmbedInformation(colors.red, "Informação", `Música parada e fila de reprodução esvaziada!`),
      ],
    });
  },
});
