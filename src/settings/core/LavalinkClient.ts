import { Manager } from "erela.js";
import { client } from "../..";

export class LavalinkClient {
  private manager: Manager;

  constructor() {
    this.manager = new Manager({
      nodes: [
        {
          host: "127.0.0.1",
          port: 8080,
          password: "123321",
        },
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
  }

  public async initialize() {
    this.manager.init("");
  }

  public getManager() {
    return this.manager;
  }
}
