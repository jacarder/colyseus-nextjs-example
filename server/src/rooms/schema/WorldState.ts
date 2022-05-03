import { Schema, MapSchema, Context, type } from "@colyseus/schema";
import { generateMap } from "../../services/map.service";

export class Zone extends Schema {
  @type('string') hexColor: string;
}
export class Map extends Schema {
  @type([Zone]) grid: Zone[][];
}
export class World extends Schema {
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
}
