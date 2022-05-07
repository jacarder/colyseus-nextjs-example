import { Schema, MapSchema, Context, type } from "@colyseus/schema";
import { PlayerMove } from "../../models/controls.mode";
import { generateMap } from "../../services/map.service";
import { Player } from "./PlayerState";

export class Zone extends Schema {
  @type('string') hexColor: string;
}
export class Map extends Schema {
  @type([Zone]) grid: Zone[][];
}
export class World extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(Map) mapData: Map;
  world = new MapSchema<World>();
  async createWorld() {
    const map = await generateMap();
    let newWorld = new World();
    newWorld.mapData = map;
    this.world.set("main", newWorld)
  }
  getWorld() {
    return this.world.get("main").mapData;
  }
  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());
  }
  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }
  movePlayer(sessionId: string, movement: PlayerMove) {
    const player = this.players.get(sessionId);
    switch (movement) {
      case PlayerMove.ARROW_DOWN: // down
        ++player.location.x;
        break;
      case PlayerMove.ARROW_LEFT: // left
        --player.location.y;
        break;
      case PlayerMove.ARROW_RIGHT: // right
        ++player.location.y;
        break;
      case PlayerMove.ARROW_UP: // up
        --player.location.x;
        break;
    }
  }
}


