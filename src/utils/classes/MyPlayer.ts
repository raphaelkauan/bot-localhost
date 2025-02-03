import { Manager, Player } from "moonlink.js";

class MyPlayer {
  private manager: Manager;

  constructor(manager: Manager) {
    this.manager = manager;
  }

  createMyPlayer(guildId: string, voiceChannelId: string, textChannelId: string, autoPlay: boolean): Player {
    const get = this.manager.getPlayer(guildId);

    if (get) {
      console.log("get player");
      return get;
    }

    const create = this.manager.createPlayer({
      guildId,
      voiceChannelId,
      textChannelId,
      autoPlay,
    });

    console.log("create player");
    return create;
  }
}

export default MyPlayer;
