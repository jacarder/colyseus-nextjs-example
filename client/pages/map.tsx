import { useEffect, useState } from "react"
import * as Colyseus from "colyseus.js"

type Props = {}
type Player = {
	key: string,
	x: number,
	y: number
}
const client = new Colyseus.Client('ws://localhost:2567');
let room: Colyseus.Room<any> = null;
const Map = (props: Props) => {
	const sectionHeightWidth = 10;
	const [mapData, setMapData] = useState<{ grid: [][] }>({ grid: [] })
	const [userData, setUserData] = useState<Player>({
		key: null,
		x: 50,
		y: 20,
	});
	const [players, setPlayers] = useState({})
	useEffect(() => {
		let isMounted = true;
		const joinOrCreate = async () => {
			if (isMounted) {
				room = await client.joinOrCreate('my_room');
				room.state.players.onAdd = (player, key) => {
					// setPlayers({
					// 	...players,
					// 	[key]: player
					// })
					player.onChange = (changes: any[], t) => {
						if (key === room.sessionId) {
							//	TODO timeout to make sure we are in sync with server
							//setUserData({ ...player })
						} else {
							changes.forEach((change) => {
								setPlayers(state => ({ ...state, [key]: player }))
							})
						}
					}
				}

				room.onMessage('generated_map', (message) => {
					setMapData(message)
				})
			}
		}
		joinOrCreate().catch((error) => { })
		return () => { isMounted = false }
	}, [])

	useEffect(() => {
		//	TEST
		const keyListener = (event) => {
			let udCopy = { ...userData };
			switch (event.code) {
				case 'ArrowDown': // down
					++udCopy.x;
					break;
				case 'ArrowLeft': // left
					--udCopy.y;
					break;
				case 'ArrowRight': // right
					++udCopy.y;
					break;
				case 'ArrowUp': // up
					--udCopy.x;
					break;
			}
			setUserData({
				...udCopy
			})
			room.send("player_move", event.code)
		};
		document.addEventListener("keyup", keyListener)
		return () => { document.removeEventListener('keyup', keyListener) }
	}, [userData])
	const isPlayerLocated = (rowIndex: number, sectionIndex: number) => {
		const isFound = Object.keys(players).find(key => players[key].x === rowIndex && players[key].y === sectionIndex);
		return !!isFound;
	}
	return (
		<div id="mapid">
			{mapData.grid.map((row: any, rowIndex: number) =>
				<div key={`row-${rowIndex}`} style={{ display: 'flex' }}>
					{row.map((section: any, sectionIndex: number) =>
						<>
							{
								rowIndex === userData.x && sectionIndex === userData.y ?
									(
										<div
											key={`user-${sectionIndex}`}
											style={{
												backgroundColor: '#ff0000',
												height: `${sectionHeightWidth}px`,
												width: `${sectionHeightWidth}px`
											}}></div>
									)
									: isPlayerLocated(rowIndex, sectionIndex) ?
										(
											<div
												key={`player-${sectionIndex}`}
												style={{
													backgroundColor: '#0000ff',
													height: `${sectionHeightWidth}px`,
													width: `${sectionHeightWidth}px`
												}}></div>
										)
										:
										(
											<div
												key={`section-${sectionIndex}`}
												style={{
													backgroundColor: section.hexColor,
													height: `${sectionHeightWidth}px`,
													width: `${sectionHeightWidth}px`
												}}></div>
										)
							}
						</>
					)}
				</div>
			)
			}
		</div >
	)
}

export default Map