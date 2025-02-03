import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { musicState } from "../music/play";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";
import MyPlayer from "../../utils/classes/MyPlayer";
import { manager } from "../..";

export default new Command({
  name: "unpause",
  type: ApplicationCommandType.ChatInput,
  description: "Retoma a música pausada no canal de voz.",

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
