import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";

export default new Command({
  name: "unpause",
  type: ApplicationCommandType.ChatInput,
  description: "Retoma a música pausada no canal de voz.",

  async run({ interaction }) {},
});
