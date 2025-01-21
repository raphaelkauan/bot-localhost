import ytdl from "@distube/ytdl-core";
import { CommandInteraction, Interaction } from "discord.js";
import { createEmbedInformation } from "./createEmbedInformation";
import { colors } from "../../utils/colors/colors.json";

export async function validationUrl(url: string, interaction: CommandInteraction) {
  if (!ytdl.validateURL(url)) {
    await interaction.reply({
      ephemeral: true,
      embeds: [
        createEmbedInformation(colors.yellow, "Informação", "Por favor, insira um link válido do YouTube"),
      ],
    });
    return false;
  }

  return true;
}
