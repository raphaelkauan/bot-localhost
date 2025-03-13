import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";

export default new Command({
  name: "metrics-member",
  description: "Este comando retorna um embed com métricas dos membros",
  type: ApplicationCommandType.ChatInput,

  async run({ interaction }) {},
});
