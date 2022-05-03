import { chunk } from 'lodash';
interface IMap {
	grid: Array<IMapSection[]>
}
interface IMapSection {
	hex: string
}
export const generateMap = (): Promise<IMap> => {
	return new Promise((resolve, reject) => {
		const getPixels = require("get-pixels");
		let mapData: IMap = {
			grid: null
		};
		getPixels("map.png", (err: any, pixels: any) => {
			if (err) {
				return;
			}
			let c = chunk(pixels.data, 4).map((group: any) => {
				return {
					hex: ConvertRGBtoHex(group[0], group[1], group[2])
				} as IMapSection;
			})
			mapData.grid = chunk(c, 46);
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
console.log(ConvertRGBtoHex(255, 100, 200));