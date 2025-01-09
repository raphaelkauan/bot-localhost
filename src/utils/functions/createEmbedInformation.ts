import { ColorResolvable, EmbedBuilder } from "discord.js";

export function createEmbedInformation(color: string, title: string, description: string) {
  return new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setTitle(title)
    .setDescription(description);
}
