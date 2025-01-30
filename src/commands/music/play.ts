import { ApplicationCommandOptionType, ApplicationCommandType, formatEmoji } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import { AudioPlayer, AudioPlayerStatus, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";
import { validationUrl } from "../../utils/functions/validationUrl";
import { client, manager } from "../..";
import { decodeTrack, Player, Queue } from "moonlink.js";

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

    const player = (await manager).createPlayer({
      // @ts-ignore
      guildId: interaction.guild?.id,
      voiceChannelId: voiceChannelId,
      textChannelId: textChannelId,
      autoPlay: true,
    });

    try {
      if (typeof url === "string") {
        musicState.queue.push(url);
      }

      if (player.playing) {
        const song = musicState.queue.shift()!;

        const res = await (
          await manager
        ).search({
          query: song,
          source: "youtube",
          requester: interaction.user,
        });

        if (res.loadType === "loadfailed") {
          return;
        }

        let track = res.tracks[0];
        player.queue.add(track);
      }

      if (!player.playing) {
        if (!musicState.connection) {
          musicState.connection = joinVoiceChannel({
            channelId: voiceChannelId,
            guildId: interaction.guild!.id,
            adapterCreator: interaction.guild!.voiceAdapterCreator,
          });
        }

        console.log("teste");

        const song = musicState.queue.shift()!;

        const res = await (
          await manager
        ).search({
          query: song,
          source: "youtube",
          requester: interaction.user,
        });

        if (res.loadType === "loadfailed") {
          return;
        }

        let track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused) {
          player.play();
        }

        (await manager).on("trackEnd", async (player: Player) => {
          player.stop();
        });

        await interaction.reply({
          embeds: [
            createEmbedInformation(
              colors.blueMusic,
              "Informação",
              `**${interaction.user.displayName}** sua música está tocando!`
            ),
          ],
        });
        return;
      }
      await interaction.reply({
        embeds: [
          createEmbedInformation(
            colors.yellow,
            "Informação",
            `${formatEmoji("1328450336888848486", true)} Música adicionada na fila!`
          ),
        ],
      });
    } catch (error) {
      await interaction.reply({
        ephemeral: true,
        embeds: [createEmbedInformation(colors.red, "Aviso", `Não foi possível executar o comando!`)],
      });
      console.log(`Erro ao executar comando de comando de / \n${error}`);
    }
  },
});
