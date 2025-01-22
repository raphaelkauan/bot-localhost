import { EmbedBuilder, TextChannel } from "discord.js";
import { Event } from "../../settings/types/Event";
import dotenv from "dotenv";

dotenv.config();

export default new Event({
  name: "guildMemberAdd",
  async run(interaction) {
    const channelWelcomeId = process.env.CHANNEL_WELCOME_ID;

    // @ts-ignore
    let channel = interaction.guild.channels.cache.get(channelWelcomeId) as TextChannel;

    if (!channel) {
      console.error("Canal de boas-vindas não encontrado!");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle(`Salve, ${interaction.displayName}!`)
      .setDescription(
        `Você acaba de entrar no servidor **localhost**. 
        Aqui você poderá interagir com a comunidade, encontrar vagas, conversar sobre programação, tecnologia e muito mais!`
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        {
          name: "📜 Regras",
          value: "Não deixe de conferir o canal de <#1326738060666470535> para não ter nenhum problema!",
        },
        {
          name: "📚 Conteúdo",
          value: "Confira o canal de <#1326738060666470535> para dicas, tutoriais e materiais úteis!",
        },
        {
          name: "💬 Canais",
          value: "Participe das conversas nos diversos canais disponíveis!",
        }
      )
      .setFooter({
        text: `Aproveite o servidor!`,
      });

    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed] });
  },
});
