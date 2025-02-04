import { Event } from "../../settings/types/Event";
import { info } from "../../commands/music/play";
import MyPlayer from "../../utils/classes/MyPlayer";
import { manager } from "../..";

export default new Event({
  name: "voiceStateUpdate",
  async run(interaction) {
    const botVoiceChannel = interaction.guild.members.me?.voice.channel;
    if (!botVoiceChannel) return;

    const myPlayer = new MyPlayer(await manager);
    const player = myPlayer.createMyPlayer(info.guildId, info.voiceChannelId, info.channelId, false);

    if (botVoiceChannel.members.size == 1) {
      player.disconnect();
      player.destroy();
      player.queue.clear();
      return;
    }
  },
});
