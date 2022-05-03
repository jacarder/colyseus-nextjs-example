import { Room, Client } from "colyseus";
import { generateMap } from "../services/map.service";
import { World, Map } from "./schema/WorldState";
import { MapSchema, Context, type } from "@colyseus/schema";

export class MyRoom extends Room<World> {

  async onCreate(options: any) {
    this.setState(new World());
    console.log("made it")
    await this.state.createWorld();
    //this.state.assign({mapData: generateMap()})
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    //console.log(this.state.mapData)
    this.broadcast('generated_map', this.state.getWorld());

  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
