import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import ytdl from "@distube/ytdl-core";
import { AudioPlayerStatus, joinVoiceChannel } from "@discordjs/voice";
import { playMusic, musicState } from "../../utils/functions/playMusic";
import { validationChannel } from "../../utils/functions/validationChannel";
import { createEmbedInformation } from "../../utils/functions/createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";

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

    const url = interaction.options.get("link", true).value;

    // @ts-ignore
    if (!ytdl.validateURL(url)) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbedInformation(colors.yellow, "Informação", "Por favor, insira um link válido do YouTube"),
        ],
      });
      return;
    }

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

        playMusic();

        await interaction.reply({ content: `🎶 ${url}` });
        return;
      }
      await interaction.reply({
        embeds: [createEmbedInformation(colors.yellow, "Informação", `🦘 Agora sua música está na fila!`)],
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
