import { ApplicationCommandOptionType, ApplicationCommandType, formatEmoji } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import { AudioPlayer, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";
import { validationUrl } from "../../utils/functions/validationUrl";
import { manager } from "../..";

dotenv.config();

export const musicState = {
  queue: [] as string[],
  playerAudio: null as AudioPlayer | null,
  connection: null as VoiceConnection | null,
};

export default new Command({
  name: "play",
  type: ApplicationCommandType.ChatInput,
  description: "Reproduz uma música no canal de voz a partir de um link do YouTube.",
  options: [
    {
      name: "link",
      type: ApplicationCommandOptionType.String,
      description: "Link do YouTube de música",
      required: true,
    },
  ],

  async run({ interaction }) {
    const guildMember = interaction.guild?.members.cache.get(interaction.user.id);
    const voiceChannelId = guildMember?.voice.channelId;
    const textChannelId = interaction.channelId;

    if (!voiceChannelId) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbedInformation(
            colors.yellow,
            "Informação",
            "Você precisa estar em um canal de voz para usar este comando!"
          ),
        ],
      });
      return;
    }

    if (!(await validationChannel(interaction))) return;

    if (
      voiceChannelId !== interaction.guild?.members.me?.voice.channelId &&
      musicState &&
      musicState.playerAudio
    ) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbedInformation(
            colors.yellow,
            "Informação",
            "Alguém já está utilizando o bot em outro canal de voz. Se você deseja ouvir uma música, entre no canal dessa pessoa ou aguarde até que ela termine de usar o bot!"
          ),
        ],
      });
      return;
    }

    const url = interaction.options.get("link", true).value;

    // @ts-ignore
    if (!(await validationUrl(url, interaction))) return;

    // @ts-ignores
    // >>> implementar link de playlist <<
    const isPlaylist = url.includes("playlist") || url.includes("&list=");

    const player = (await manager).createPlayer({
      // @ts-ignore
      guildId: interaction.guild?.id,
      voiceChannelId: voiceChannelId,
      textChannelId: textChannelId,
      autoPlay: true,
      volume: 100,
      selfDeaf: true,
      selfMute: false,
    });

    try {
      if (typeof url === "string") {
        musicState.queue.push(url);
      }

      musicState.connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: interaction.guild!.id,
        adapterCreator: interaction.guild!.voiceAdapterCreator,
      });

      const song = musicState.queue.shift()!;

      const res = await (
        await manager
      ).search({
        query: song,
        source: "youtube",
      });

      if (res.loadType === "loadfailed") {
        return;
      }

      console.log("res.query " + res.query);

      console.log("res.playlistInfo " + res.playlistInfo.selectedTrack.toString);

      console.log("res.source " + res.source);

      console.log("artworkUrl " + res.tracks[0].artworkUrl);
      console.log("author " + res.tracks[0].author);
      console.log("identifier " + res.tracks[0].identifier);
      console.log("isStream " + res.tracks[0].isStream);
      console.log("requestedBy " + res.tracks[0].requestedBy);
      console.log("url " + res.tracks[0].url);
      console.log("time " + res.tracks[0].time);
      console.log("title " + res.tracks[0].title);
      console.log("isrc " + res.tracks[0].isrc);
      console.log("position " + res.tracks[0].position);
      console.log("duration " + res.tracks[0].duration);

      const track = res.tracks[0];
      player.queue.add(track);
      if (!player.playing && !player.paused) {
        player.play();
      }

      (await manager).on("trackStart", (player, track) => {
        console.log(`Iniciando a reprodução de: ${track.title}`);
      });

      await interaction.reply({
        embeds: [
          createEmbedInformation(
            colors.blueMusic,
            "Informação",
            `${interaction.user.displayName} sua música está tocando!`
          ),
        ],
      });
      return;

      // await interaction.reply({
      //   embeds: [
      //     createEmbedInformation(
      //       colors.yellow,
      //       "Informação",
      //       `${formatEmoji("1328450336888848486", true)} Música adicionada na fila!`
      //     ),
      //   ],
      // });
    } catch (error) {
      await interaction.reply({
        ephemeral: true,
        embeds: [createEmbedInformation(colors.red, "Aviso", `Não foi possível executar o comando!`)],
      });
      console.log(`Erro ao executar comando de comando de / \n${error}`);
    }
  },
});
