import { ApplicationCommandType, ColorResolvable, EmbedBuilder, formatEmoji } from "discord.js";
import { Command } from "../../settings/types/Command";
import { colors } from "../../utils/colors/colors.json";
import { validationSuperUser } from "../../utils/functions/admin/validationSuperUser";

export default new Command({
  name: "apresentacao-bot",
  type: ApplicationCommandType.ChatInput,
  description: "Este comando fornece uma breve apresentação do bot.",

  async run({ interaction }) {
    if (!(await validationSuperUser(interaction))) return;

    const embed = new EmbedBuilder()
      .setColor(colors.yellow as ColorResolvable)
      .setTitle(`Stuart`)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(
        `
        ${formatEmoji(
          "1328441926705217536",
          true
        )} Documentação: https://github.com/raphaelkauan/bot-localhost`
      )
      .setFields(
        {
          name: "Funcionalidades:",
          value: " ",
        },
        {
          name: `${formatEmoji("1328450359697346703", true)} Mensagem de Boas-Vindas`,
          value:
            "O bot envia automaticamente uma mensagem de boas-vindas sempre que um novo membro entra no servidor.",
        },
        {
          name: `${formatEmoji("1328456566281605212", false)}  Como Pedir Músicas?`,
          value: "Gerencie músicas diretamente no servidor com os seguintes comandos:",
        },
        {
          name: "`/play <link>`",
          value:
            "Reproduz uma música no canal de voz a partir de um link do YouTube. Se já houver música tocando, a nova será adicionada à fila.",
        },
        {
          name: "`/pause`",
          value: "Pausa a música que está sendo reproduzida no momento.",
        },
        {
          name: "`/unpause`",
          value: "Retoma a reprodução de uma música que está pausada.",
        },
        {
          name: "`/skip`",
          value: "Pula a música atual e começa a tocar a próxima da fila.",
        },
        {
          name: "`/fila`",
          value: "Exibe todas as músicas que estão na fila.",
        },
        {
          name: "`/stop`",
          value: "Para a música, limpa a fila e desconecta o bot do canal de voz.",
        }
      )
      .setFooter({
        text: "Acesse nossa documentação para mais informações!",
      });

    interaction.reply({ content: `@everyone`, embeds: [embed] });
  },
});
