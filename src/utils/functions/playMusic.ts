import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  VoiceConnection,
} from "@discordjs/voice";
import ytdl, { getInfo } from "@distube/ytdl-core";

export const musicState = {
  queue: [] as string[],
  player: null as AudioPlayer | null,
  connection: null as VoiceConnection | null,
};

export async function playMusic() {
  if (!musicState.queue.length) {
    musicState.connection = null;
    musicState.player = null;
    return;
  }

  const song = musicState.queue.shift()!;

  const formatRefactor = (await getInfo(song)).formats[0];

  console.log(`info + ${formatRefactor}`);

  try {
    const stream = ytdl(song, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 30,
      dlChunkSize: 1024 * 1024 * 10,
    });
    const resource = createAudioResource(stream);

    if (!musicState.player) musicState.player = createAudioPlayer();

    musicState.player.play(resource);
    musicState.connection?.subscribe(musicState.player);

    musicState.player.on(AudioPlayerStatus.Idle, async () => {
      await playMusic();
    });

    musicState.player.on("error", (erro) => {
      console.log(erro);
    });

    stream.on("error", (erro) => {
      console.log(erro);
    });
  } catch (error) {
    console.log(`Erro ao tocar música: ${error}`);
  }
}
