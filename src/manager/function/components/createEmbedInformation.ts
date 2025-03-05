import { ColorResolvable, EmbedBuilder } from "discord.js";

export function createEmbedInformation(color: string, title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setTitle(title)
    .setDescription(description);
}
