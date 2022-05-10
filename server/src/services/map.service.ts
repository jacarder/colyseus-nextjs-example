import { chunk } from 'lodash';
import path from 'path';
import { Map, Zone } from '../rooms/schema/WorldState';

export const generateMap = (): Promise<Map> => {
	return new Promise((resolve, reject) => {
		const getPixels = require("get-pixels");
		const mapData = new Map()
		getPixels(path.join(__dirname, '..', 'assets', 'map.png'), (err: any, pixels: any) => {
			console.log(path.join(__dirname, '..', 'assets', 'map.png'), err)
			if (err) {
				reject();
			}
			const zones = chunk(pixels.data, 4).map((group: any) => {
				let zone = new Zone();
				zone.hexColor = ConvertRGBtoHex(group[0], group[1], group[2]);
				return zone;
			})
			mapData.grid = chunk(zones, 46);
			resolve(mapData)
		});
	})
}
function ColorToHex(color: number) {
	var hexadecimal = color.toString(16);
	return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

function ConvertRGBtoHex(red: number, green: number, blue: number) {
	return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}