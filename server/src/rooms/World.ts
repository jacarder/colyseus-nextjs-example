import { Room, Client } from "colyseus";
import { PlayerMove } from "../models/controls.mode";
import { World } from "./schema/WorldState";

export class MyRoom extends Room<World> {

  async onCreate(options: any) {
    this.setState(new World());
    await this.state.createWorld();
    this.onMessage("player_move", (client, message: PlayerMove) => {
      this.state.movePlayer(client.sessionId, message);
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.broadcast('generated_map', this.state.getWorld());
    this.state.createPlayer(client.sessionId)
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
