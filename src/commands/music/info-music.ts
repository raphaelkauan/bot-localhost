import { ApplicationCommandType, Embed, EmbedBuilder } from "discord.js";
import { Command } from "../../settings/types/Command";
import { validationChannel } from "../../utils/functions/validationChannel";

export default new Command({
  name: "info-music",
  type: ApplicationCommandType.ChatInput,
  description: "Informações relacionadas à reprodução de música.",

  async run({ interaction }) {
    if (!(await validationChannel(interaction))) return;

    const embed = new EmbedBuilder()
      .setColor("#FAA61A")
      .setTitle("🎷 Comandos de Música")
      .setDescription("Aqui estão todos os comandos disponíveis para gerenciar a música(s).")
      .addFields(
        {
          name: "/play <link>",
          value:
            "Reproduz uma música no canal de voz a partir de um link do YouTube. Se já houver uma música tocando, o comando adicionará a nova música à fila para ser reproduzida em sequência.",
        },
        {
          name: "/pause",
          value: "Pausa a música que está sendo reproduzida no momento.",
        },
        {
          name: "/unpause",
          value: "Retoma a reprodução de uma música que está pausada.",
        },
        {
          name: "/skip",
          value: "Pula a música atual e começa a tocar a próxima na fila.",
        },
        {
          name: "/fila",
          value: "Mostra todas as músicas que estão na fila.",
        },
        {
          name: "/stop",
          value: "Para a música, limpa a fila e desconecta o bot do canal de voz.",
        }
      )
      .setFooter({
        text: `Use os comandos corretamente para aproveitar as músicas 🎶`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.reply({ ephemeral: true, embeds: [embed] });
  },
});
