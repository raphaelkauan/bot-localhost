import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";

export default new Command({
  name: "hello",
  type: ApplicationCommandType.ChatInput,
  description: "execute o comando para descobrir!",

  run({ interaction }) {
    interaction.reply({ ephemeral: true, content: "Hello, World!" });
  },
});
