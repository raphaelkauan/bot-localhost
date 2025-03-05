import { CommandInteraction } from "discord.js";
import { createEmbedInformation } from "../components/createEmbedInformation";
import { colors } from "../../styles/colors.json";

export async function validationUrl(url: string, interaction: CommandInteraction): Promise<boolean> {
  if (!url.includes("youtube.com")) {
    await interaction.reply({
      embeds: [
        createEmbedInformation(colors.yellow, "Informação", "Por favor, insira um link válido do YouTube"),
      ],
    });
    return false;
  }

  return true;
}
