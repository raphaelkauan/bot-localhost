import { ApplicationCommandType } from "discord.js";
import { Command } from "../../settings/types/Command";
import { Prisma } from "../../database/client";
import { formatDate } from "../../utils/functions/formatDate";

export default new Command({
  name: "presence",
  description: "presença de membros on/off",
  type: ApplicationCommandType.ChatInput,

  async run({ interaction }) {
    const guildId = interaction.guildId;

    const list = interaction.client.guilds.cache.get(guildId!);

    const date = formatDate();

    list?.members.cache.forEach(async (member) => {
      if (
        member.presence?.status === "online" ||
        member.presence?.status === "idle" ||
        member.presence?.status === "invisible" ||
        member.presence?.status === "dnd"
      ) {
        const memberExistsValidationOffline = await Prisma.member.findFirst({
          where: { id: member.user.id },
        });

        if (memberExistsValidationOffline?.status === "online" && member.presence.status === undefined) {
          await Prisma.member.update({
            where: {
              id: memberExistsValidationOffline.id,
            },
            data: {
              status: "offline",
              lastOnline: date,
              dasyOffline: 1,
            },
          });
        }

        await Prisma.member.create({
          data: {
            id: member.user.id,
            username: member.user.username,
            globalName: member.user.globalName || "",
            status: "ativo",
            dasyOffline: 0,
          },
        });
      }

      if (member.presence?.status === undefined) {
        await Prisma.member.create({
          data: {
            id: member.user.id,
            username: member.user.username,
            globalName: member.user.globalName || "",
            status: "offline",
            lastOnline: date,
            dasyOffline: 1,
          },
        });
      }
    });

    list?.members.cache.forEach(async (member) => {
      const memberExistsValidation = await Prisma.member.findFirst({ where: { id: member.user.id } });

      if (memberExistsValidation?.status === "offline") {
        await Prisma.member.update({
          where: { id: memberExistsValidation.id },
          data: {
            dasyOffline: Number(memberExistsValidation.dasyOffline) + 1,
          },
        });
      }
    });
  },
});
