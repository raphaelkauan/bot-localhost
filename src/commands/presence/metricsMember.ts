import { ApplicationCommandType, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../../settings/types/Command";
import { validationAdmin } from "../../manager/function/validation/validationAdmin";
import { Prisma } from "../../database/client";

export default new Command({
  name: "metrics-member",
  description: "Este comando retorna um embed com métricas dos membros",
  type: ApplicationCommandType.ChatInput,

  async run({ interaction }) {
    if (!validationAdmin(interaction)) return;

    const membersAtivoFilter = await Prisma.member.findMany({
      where: { status: { equals: "ativo" } },
      select: { username: true, globalName: true, status: true },
    });

    const metricsMembersAtivo = membersAtivoFilter.map(
      (member) => `
      • Nome: **${member.username}** NomeGlobal: **${member.globalName}** Status: **${member.status}**`
    );

    // 10 dias atrás
    const today = new Date();
    const tenDaysBefore = new Date();
    tenDaysBefore.setDate(today.getDate() - 10);

    // 30 dias atrás
    const thirtyDayBefore = new Date();
    thirtyDayBefore.setDate(today.getDate() - 29);

    const membersTenDayOff = await Prisma.member.findMany({
      where: { lastOffline: { gt: tenDaysBefore, lte: thirtyDayBefore } },
      select: { username: true, globalName: true, lastOffline: true, status: true },
    });

    const metricsMembersTenDayOff = membersTenDayOff.map((member) => {
      const formatDate = new Date(member.lastOffline!).toLocaleDateString("pt-BR");
      return `
      • Nome: **${member.username}** NomeGlobal: **${member.globalName}** Visto por último: **${formatDate}** Status: **${member.status}**`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`Métricas **${interaction.guild?.name}**`)
      .setColor("DarkAqua")
      .setFields([
        {
          name: "**Membros +10 dias off**",
          value: `${metricsMembersTenDayOff}`,
        },
        {
          name: "**Membros ativos:**",
          value: `${metricsMembersAtivo}`,
        },
      ]);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
});
