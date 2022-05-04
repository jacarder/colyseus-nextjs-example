import { Schema, MapSchema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
	@type("number") x = 50;

	@type("number") y = 20;
}