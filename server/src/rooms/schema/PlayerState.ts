import { Schema, MapSchema, Context, type } from "@colyseus/schema";
export class Location extends Schema {
	@type("number") x = 50;
	@type("number") y = 20;
}
export class Player extends Schema {
	@type(Location) location = new Location()
}