import { ApplicationCommandOptionType, ApplicationCommandType, formatEmoji } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { validationChannel } from "../../manager/function/validation/validationChannel";
import { createEmbedInformation } from "../../manager/function/components/createEmbedInformation";
import { colors } from "../../manager/styles/colors.json";
import { validationUrl } from "../../manager/function/validation/validationUrl";
import { manager } from "../..";
import MyPlayer from "../../manager/classes/MyPlayer";
import { supportPlaylist } from "../../manager/function/support/supportPlaylist";

dotenv.config();

export const info = {
  queue: [] as string[],
  guildId: "" as string,
  voiceChannelId: "" as string,
  channelId: "" as string,
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
    info.guildId = interaction.guildId!;
    info.voiceChannelId = guildMember?.voice.channelId!;
    info.channelId = interaction.channelId;

    if (!info.voiceChannelId) {
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

    const myPlayer = new MyPlayer(await manager);
    const player = myPlayer.createMyPlayer(info.guildId, info.voiceChannelId, info.channelId, false);

    if (info.voiceChannelId !== interaction.guild?.members.me?.voice.channelId && player.playing) {
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

    let url = interaction.options.get("link", true).value;

    let isPlaylist;
    if (typeof url === "string") {
      if (!(await validationUrl(url, interaction))) return;

      isPlaylist = url.includes("playlist");

      if (url.includes("list")) {
        const newUrl = url.split("&list=")[0];
        url = newUrl;
      }
    }

    try {
      if (typeof url === "string") {
        info.queue.push(url);
      }

      if (player.playing) {
        const song = info.queue.shift()!;

        const res = await (
          await manager
        ).search({
          query: song,
          source: "youtube",
          requester: interaction.user,
        });

        if (res.loadType === "loadfailed") {
          await interaction.reply({
            ephemeral: true,
            embeds: [createEmbedInformation(colors.yellow, "Informação", `Você inseriu um link inválido`)],
          });
          return;
        }

        if (isPlaylist) {
          await supportPlaylist(interaction, res);
          return;
        }

        let track = res.tracks[0];
        player.queue.add(track);
      }

      if (!player.playing) {
        if (!player.connect) {
          joinVoiceChannel({
            channelId: info.voiceChannelId,
            guildId: interaction.guild!.id,
            adapterCreator: interaction.guild!.voiceAdapterCreator,
          });
        }

        const song = info.queue.shift()!;

        const res = await (
          await manager
        ).search({
          query: song,
          source: "youtube",
          requester: interaction.user,
        });

        if (res.loadType === "loadfailed" || res.error) {
          await interaction.reply({
            ephemeral: true,
            embeds: [createEmbedInformation(colors.yellow, "Informação", `Você inseriu um link inválido`)],
          });
          return;
        }

        if (isPlaylist) {
          await supportPlaylist(interaction, res);
          return;
        }

        let track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused) {
          player.play();
        }

        await interaction.reply({
          embeds: [createEmbedInformation(colors.blueMusic, "Informação", `Música sendo reproduzida!`)],
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
