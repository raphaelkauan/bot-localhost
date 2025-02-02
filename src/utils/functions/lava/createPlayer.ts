import { CommandInteraction } from "discord.js";
import { manager } from "../../..";

export class MyPlayer {
  public async createPlayer(interaction: CommandInteraction) {
    const guildMember = interaction.guild?.members.cache.get(interaction.user.id);

    const m = await manager;
    return m.createPlayer({
      guildId: interaction.guild?.id!,
      voiceChannelId: guildMember?.voice.channelId!,
      textChannelId: interaction.channelId,
      autoPlay: true,
    });
  }
}
