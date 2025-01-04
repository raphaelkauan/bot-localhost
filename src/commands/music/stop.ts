import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../../utils/functions/play-music";

export default new Command({
  name: "stop",
  type: ApplicationCommandType.ChatInput,
  description: "Parar de tocar música(s). Atenção, este comando limpará toda a fila de músicas.",

  async run({ interaction }) {
    if (musicState.connection) {
      musicState.connection.destroy();
      musicState.connection = null;
      musicState.player = null;

      while (musicState.queue.length) {
        musicState.queue.pop();
      }
    }

    interaction.reply({ content: "Música parada e fila de reprodução esvaziada!" });
  },
});
