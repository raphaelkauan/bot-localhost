import { Manager } from "moonlink.js";
import { Client } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export const LavalinkClient = (client: Client) => {
  return new Manager({
    nodes: [
      {
        identifier: process.env.LAVA_IDENTIFIER!,
        host: process.env.LAVA_HOST!,
        password: process.env.LAVA_PASSWORD!,
        port: Number(process.env.LAVA_PORT),
        secure: Boolean(process.env.LAVA_SECURE),
      },
    ],
    options: {
      clientId: process.env.CLIENT_ID,
    },
    sendPayload: (guildId: string, payload: string) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(JSON.parse(payload));
    },
  });
};
