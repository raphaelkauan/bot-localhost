import { ApplicationCommandOptionType, ApplicationCommandType, formatEmoji } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import { AudioPlayerStatus, joinVoiceChannel } from "@discordjs/voice";
import { playMusic, musicState } from "../../utils/functions/playMusic";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";
import { validationUrl } from "../../utils/functions/validationUrl";

dotenv.config();

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
      musicState.player
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

    // @ts-ignores
    // >>> implementar link de playlist <<
    const isPlaylist = url.includes("playlist") || url.includes("&list=");

    // @ts-ignore
    if (!(await validationUrl(url, interaction))) return;

    try {
      if (typeof url === "string") {
        musicState.queue.push(url);
      }

      if (!musicState.player || musicState.player.state.status === AudioPlayerStatus.Idle) {
        musicState.connection = joinVoiceChannel({
          channelId: voiceChannelId,
          guildId: interaction.guild!.id,
          adapterCreator: interaction.guild!.voiceAdapterCreator,
        });

        await playMusic();

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
