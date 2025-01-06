import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import dotenv from "dotenv";
import ytdl from "@distube/ytdl-core";
import { AudioPlayerStatus, joinVoiceChannel } from "@discordjs/voice";
import { playMusic, musicState } from "../../utils/functions/play-music";

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
        content: "Você precisa estar em um canal de voz para usar este comando!",
      });
      return;
    }

    const channelId = process.env.CHANNEL_MUSIC_ID;

    if (interaction.channelId != channelId) {
      await interaction.reply({
        ephemeral: true,
        content: "Você não está pedindo música no canal correto!",
      });
      return;
    }

    const url = interaction.options.get("link", true).value;

    // @ts-ignore
    if (!ytdl.validateURL(url)) {
      await interaction.reply({ ephemeral: true, content: "Por favor, insira um link válido do YouTube" });
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
      await interaction.reply({ content: `🦘 Agora sua música está na fila: ${url}` });
    } catch (error) {
      await interaction.reply({ ephemeral: true, content: "Não foi possível execitar /play!" });
      console.log(`Erro ao executar comando de comando de / \n${error}`);
    }
  },
});
