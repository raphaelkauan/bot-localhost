import { AudioPlayer, createAudioPlayer, VoiceConnection } from "@discordjs/voice";
import { LavalinkClient } from "../../settings/core/LavalinkClient";

export const musicState = {
  queue: [] as string[],
  player: null as AudioPlayer | null,
  connection: null as VoiceConnection | null,
};

const lavaLink = new LavalinkClient();

export async function playMusic() {
  if (!musicState.queue.length) {
    musicState.connection = null;
    musicState.player = null;
    return;
  }

  const song = musicState.queue.shift()!;

  try {
    if (!musicState.player) musicState.player = createAudioPlayer();

    const manager = lavaLink.getManager();

    const res = manager.search(song);

    // const resource = createAudioPlayer(stream);
  } catch (error) {
    console.log(`Erro ao tocar música: ${error}`);
  }
}
