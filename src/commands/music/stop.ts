import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";
import { manager } from "../..";
import MyPlayer from "../../utils/classes/MyPlayer";
import { info } from "./play";

export default new Command({
  name: "stop",
  type: ApplicationCommandType.ChatInput,
  description: "Parar de tocar música(s). Atenção, este comando limpará toda a fila de músicas.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    const myPlayer = new MyPlayer(await manager);
    const player = myPlayer.createMyPlayer(info.guildId, info.voiceChannelId, info.channelId, false);

    if (player.playing) {
      player.disconnect();
      player.destroy();
      player.queue.clear();
    }

    interaction.reply({
      embeds: [
        createEmbedInformation(colors.red, "Informação", `Música parada e fila de reprodução esvaziada!`),
      ],
    });
  },
});
