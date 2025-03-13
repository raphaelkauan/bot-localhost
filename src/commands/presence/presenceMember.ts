import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { Prisma } from "../../database/client";

export default new Command({
  name: "presence",
  description: "Presença de membros on/off",
  type: ApplicationCommandType.ChatInput,

  async run({ interaction }) {
    const guildId = interaction.guildId;
    const guild = interaction.client.guilds.cache.get(guildId!);

    const date = new Date();

    for (const member of guild?.members.cache.values()!) {
      const findMemberById = await Prisma.member.findFirst({
        where: { id: member.user.id },
      });

      /**
       * Atualiza em caso de o membro estar cadastrado como "ativo" e fique "offline"
       */
      if (
        (findMemberById?.status === "ativo" && member.presence?.status === undefined) ||
        member.presence?.status === "offline"
      ) {
        if (!findMemberById) return;

        await Prisma.member.update({
          where: {
            id: findMemberById.id,
          },
          data: {
            status: "offline",
            lastOffline: date,
          },
        });
      }

      /**
       * Se o membro estiver "ativo" e não estiver cadastrado no banco ele é cadastrado
       */
      if (
        (member.presence?.status === "online" && !findMemberById) ||
        (member.presence?.status === "idle" && !findMemberById) ||
        (member.presence?.status === "invisible" && !findMemberById) ||
        (member.presence?.status === "dnd" && !findMemberById)
      ) {
        await Prisma.member.create({
          data: {
            id: member.user.id,
            username: member.user.username,
            globalName: member.user.globalName || "Is bot",
            status: "ativo",
            isGuildMember: true,
          },
        });
      }

      /**
       * Se o member estiver "offline" e não estiver cadastrado no banco ele é cadastrado
       */
      if (
        (member.presence?.status === undefined && !findMemberById) ||
        (member.presence?.status === "offline" && !findMemberById)
      ) {
        await Prisma.member.create({
          data: {
            id: member.user.id,
            username: member.user.username,
            globalName: member.user.globalName || "Is bot",
            status: "offline",
            lastOffline: date,
            isGuildMember: true,
          },
        });
      }
    }

    for (const member of guild?.members.cache.values()!) {
      const memberExistsValidation = await Prisma.member.findFirst({ where: { id: member.user.id } });

      if (
        (memberExistsValidation?.status === "offline" && member.presence?.status === "online") ||
        (memberExistsValidation?.status === "offline" && member.presence?.status === "idle") ||
        (memberExistsValidation?.status === "offline" && member.presence?.status === "invisible") ||
        (memberExistsValidation?.status === "offline" && member.presence?.status === "dnd")
      ) {
        await Prisma.member.update({
          where: { id: memberExistsValidation?.id },
          data: {
            status: "ativo",
            lastOffline: null,
            isGuildMember: true,
            lastCheckedGuildMember: null,
          },
        });
      }
    }
  },
});
