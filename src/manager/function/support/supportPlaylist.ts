import { CommandInteraction } from "discord.js";
import { manager } from "../../..";
import MyPlayer from "../../classes/MyPlayer";
import { info } from "../../../commands/music/play";
import { createEmbedInformation } from "../components/createEmbedInformation";
import { colors } from "../../styles/colors.json";
import { SearchResult } from "moonlink.js";

export async function supportPlaylist(interaction: CommandInteraction, res: SearchResult) {
  const myPlayer = new MyPlayer(await manager);
  const player = myPlayer.createMyPlayer(info.guildId, info.voiceChannelId, info.channelId, false);

  for (const track of res.tracks) {
    if (player.queue.size >= 25) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbedInformation(
            colors.yellow,
            "Informação",
            "Algumas músicas foram adicionadas, mas a fila atingiu o limite de 25! Use `/skip` para liberar espaço ou `/fila` para visualizar ela."
          ),
        ],
      });
      if (!player.playing && !player.paused) {
        player.play();
      }
      return;
    }
    player.queue.add(track);
  }

  if (!player.playing && !player.paused) {
    player.play();
  }
  await interaction.reply({
    embeds: [createEmbedInformation(colors.blueMusic, "Informação", `Músicas adicionadas na fila!`)],
  });
  return;
}
