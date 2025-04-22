import { CommandInteraction, GuildMember, MessageFlags } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export function validationAdmin(interaction: CommandInteraction) {
  const cargoAdmId = process.env.CARGO_ADMIN_ID;

  if (interaction.member instanceof GuildMember) {
    if (!interaction.member?.roles.cache.has(cargoAdmId!)) {
      interaction.reply({
        content: `<@${interaction.user.id}> você não tem permissão para executar esse comando!`,
        flags: MessageFlags.Ephemeral,
      });
      return false;
    }
  }
  return true;
}
