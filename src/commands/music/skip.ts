import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../music/play";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";
import MyPlayer from "../../utils/classes/MyPlayer";
import { manager } from "../..";

export default new Command({
  name: "skip",
  type: ApplicationCommandType.ChatInput,
  description: "Pular para a próxima música na fila.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    const guildMember = interaction.guild?.members.cache.get(interaction.user.id);
    const voiceChannelId = guildMember?.voice.channelId;

    const myPlayer = new MyPlayer(await manager);
    const player = myPlayer.createMyPlayer(
      interaction.guildId!,
      voiceChannelId!,
      interaction.channelId,
      false
    );

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
      embeds: [createEmbedInformation(colors.blueMusic, "Informação", `Música pulada!`)],
    });
  },
});
