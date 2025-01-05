import { CommandInteraction } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export async function validationChannel(interaction: CommandInteraction) {
  const channelId = process.env.CHANNEL_MUSIC_ID;

  if (interaction.channelId != channelId) {
    await interaction.reply({
      ephemeral: true,
      content:
        "Você está tentando executar este comando no canal errado. Por favor, utilize o canal para pedidos de música.",
    });
    return;
  }
}
