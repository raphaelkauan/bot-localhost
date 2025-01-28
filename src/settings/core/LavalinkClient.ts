import { Manager } from "moonlink.js";

import { Client } from "discord.js";

export const LavalinkClient = (client: Client) => {
  return new Manager({
    nodes: [
      {
        identifier: "node_1",
        host: "127.0.0.1",
        password: "123321",
        port: 8080,
        secure: false,
      },
    ],
    options: {},
    sendPayload: (guildId: string, payload: string) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(JSON.parse(payload));
    },
  });
};
