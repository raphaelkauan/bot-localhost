import { CommandInteraction } from "discord.js";
import dotenv from "dotenv";
import { colors } from "../../../utils/colors/colors.json";
import { createEmbedInformation } from "../createEmbedInformation";

dotenv.config();

export async function validationSuperUser(interaction: CommandInteraction) {
  const superUserId = process.env.SUPER_USER_ID;

  if (interaction.user.id !== superUserId) {
    await interaction.reply({
      ephemeral: true,
      embeds: [
        createEmbedInformation(colors.red, "Atenção", "Você não tem permissão para executar este comando!"),
      ],
    });
    return false;
  }

  return true;
}
