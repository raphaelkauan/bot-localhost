import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  VoiceConnection,
} from "@discordjs/voice";
import ytdl from "@distube/ytdl-core";

export const musicState = {
  queue: [] as string[],
  player: null as AudioPlayer | null,
  connection: null as VoiceConnection | null,
};

export function playMusic() {
  if (!musicState.queue.length) {
    // musicState.connection?.destroy();
    musicState.connection = null;
    musicState.player = null;
    return;
  }

  const song = musicState.queue.shift()!;

  try {
    const stream = ytdl(song, { filter: "audioonly", quality: "highestaudio", highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);

    if (!musicState.player) musicState.player = createAudioPlayer();

    musicState.player.play(resource);
    musicState.connection?.subscribe(musicState.player);

    musicState.player.on(AudioPlayerStatus.Idle, () => {
      playMusic();
    });
  } catch (error) {
    console.log(`Erro ao tocar música: ${error}`);
    playMusic();
  }
}
