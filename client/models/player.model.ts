export class Player {
	name: string
	location: {
		x: number,
		y: number
	} = { x: 20, y: 50 }
	inventory: {
		items: {}
	}
}