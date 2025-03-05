import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { validationChannel } from "../../manager/function/validation/validationChannel";
import { createEmbedInformation } from "../../manager/function/components/createEmbedInformation";
import { colors } from "../../manager/styles/colors.json";
import MyPlayer from "../../manager/classes/MyPlayer";
import { manager } from "../..";
import { info } from "./play";

export default new Command({
  name: "unpause",
  type: ApplicationCommandType.ChatInput,
  description: "Retoma a música pausada no canal de voz.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    const myPlayer = new MyPlayer(await manager);
    const player = myPlayer.createMyPlayer(info.guildId, info.voiceChannelId, info.channelId, false);

    if (!player.playing) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbedInformation(colors.yellow, "Informação", "Não há nenhuma música pausada no momento!"),
        ],
      });
      return;
    }

    if (player.paused) {
      player.resume();

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
