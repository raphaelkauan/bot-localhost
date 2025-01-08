import { EmbedBuilder, TextChannel } from "discord.js";
import { Event } from "../../settings/types/Event";
import dotenv from "dotenv";

dotenv.config();

export default new Event({
  name: "guildMemberAdd",
  run(interaction) {
    const channelWelcomeId = process.env.CHANNEL_WELCOME_ID;

    // @ts-ignore
    let channel = interaction.guild.channels.cache.get(channelWelcomeId) as TextChannel;

    if (!channel) {
      console.error("Canal de boas-vindas não encontrado!");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor("DarkAqua")
      .setTitle(`Welcome ${interaction.displayName}!`)
      .setDescription(`teste <#${channelWelcomeId}>`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields({ name: "Canais", value: "Confira os canais disponíveis e participe das conversas!" })
      .setFooter({
        text: "Aproveite o servidor!",
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  },
});
