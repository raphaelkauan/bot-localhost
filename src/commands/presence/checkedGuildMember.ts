import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { Prisma } from "../../database/client";

export default new Command({
  name: "checked-guild-member",
  description: "Identifica e registra membros que não estão mais na guilda.",
  type: ApplicationCommandType.ChatInput,

  /**
   * Verifica se o membro ainda está presente no servidor.
   */
  async run({ interaction }) {
    const guildId = interaction.guildId;
    const guild = interaction.client.guilds.cache.get(guildId!);

    const dbMembers = await Prisma.member.findMany();

    for (const dbMember of dbMembers) {
      const validationServerMember = guild?.members.cache.has(dbMember.id);

      if (!validationServerMember) {
        await Prisma.member.update({
          where: {
            id: dbMember.id,
          },
          data: {
            status: "offline",
            lastOffline: null,
            isGuildMember: false,
            lastCheckedGuildMember: new Date(),
          },
        });
      }
    }
  },
});
