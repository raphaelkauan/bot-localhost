import { Event } from "../../settings/types/Event";
import { musicState } from "../../commands/music/play";

export default new Event({
  name: "voiceStateUpdate",
  async run(interaction) {
    const botVoiceChannel = interaction.guild.members.me?.voice.channel;
    if (!botVoiceChannel) return;

    if (botVoiceChannel.members.size == 1) {
      musicState.connection?.destroy();
      musicState.connection = null;
      musicState.playerAudio = null;
      return;
    }
  },
});
