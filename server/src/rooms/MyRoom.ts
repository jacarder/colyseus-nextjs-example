import { Room, Client } from "colyseus";
import { generateMap } from "../services/map.service";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate(options: any) {
    this.setState(new MyRoomState());
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    generateMap().then((mapData: any) => {
      this.broadcast('generated_map', mapData);
    })
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
