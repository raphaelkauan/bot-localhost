import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { validationChannel } from "../../manager/function/validation/validationChannel";
import { createEmbedInformation } from "../../manager/function/components/createEmbedInformation";
import { colors } from "../../manager/styles/colors.json";
import MyPlayer from "../../manager/classes/MyPlayer";
import { manager } from "../..";
import { info } from "./play";

export default new Command({
  name: "skip",
  type: ApplicationCommandType.ChatInput,
  description: "Pular para a próxima música na fila.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    const myPlayer = new MyPlayer(await manager);
    const player = myPlayer.createMyPlayer(info.guildId, info.voiceChannelId, info.channelId, false);

    if (!player.playing) {
      interaction.reply({
        ephemeral: true,
        embeds: [createEmbedInformation(colors.yellow, "Informação", "Não existe música tocando!")],
      });
      return;
    }

    if (player.queue.tracks.length == 0) {
      interaction.reply({
        ephemeral: true,
        embeds: [createEmbedInformation(colors.yellow, "Informação", "Não existe música na fila!")],
      });
      return;
    }

    player.skip();

    await interaction.reply({
      embeds: [createEmbedInformation(colors.blueMusic, "Informação", `Música pulada com sucesso!`)],
    });
  },
});
