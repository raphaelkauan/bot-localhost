import { CommandInteraction, MessageFlags } from "discord.js";
import dotenv from "dotenv";
import { colors } from "../../styles/colors.json";
import { createEmbedInformation } from "../components/createEmbedInformation";

dotenv.config();

export async function validationSuperUser(interaction: CommandInteraction) {
  const superUserId = process.env.SUPER_USER_ID;

  if (interaction.user.id !== superUserId) {
    await interaction.reply({
      embeds: [
        createEmbedInformation(colors.red, "Atenção", "Você não tem permissão para executar este comando!"),
      ],
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}
