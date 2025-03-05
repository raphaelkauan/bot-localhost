import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import { validationChannel } from "../../manager/function/validation/validationChannel";
import { createEmbedInformation } from "../../manager/function/components/createEmbedInformation";
import { colors } from "../../manager/styles/colors.json";
import MyPlayer from "../../manager/classes/MyPlayer";
import { manager } from "../..";

dotenv.config();

export default new Command({
  name: "pause",
  type: ApplicationCommandType.ChatInput,
  description: "Pausa música que está tocando no momento.",

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
          createEmbedInformation(colors.yellow, "Informação", "Não há nenhuma música tocando no momento!"),
        ],
      });
      return;
    }

    const pause = player.pause();

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
