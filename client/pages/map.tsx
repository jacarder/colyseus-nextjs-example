import { useEffect, useState } from "react"
import * as Colyseus from "colyseus.js"
import { usePlayerListeners } from "../hooks/usePlayerListeners";
import { Room } from "colyseus.js";

type Props = {}

const client = new Colyseus.Client('ws://localhost:2567');
const Map = (props: Props) => {
	const sectionHeightWidth = 10;
	const [mapData, setMapData] = useState<{ grid: [][] }>({ grid: [] })
	const [room, setRoom] = useState<Room<unknown>>();
	const [playerCharacter, players] = usePlayerListeners(room)
	useEffect(() => {
		if (room) {
			room.onMessage('generated_map', (message) => {
				setMapData(message)
			})
		}
	}, [room])

	useEffect(() => {
		let isMounted = true;
		const joinOrCreate = async () => {
			if (isMounted) {
				setRoom(await client.joinOrCreate('my_room'));
			}
		}
		joinOrCreate().catch((error) => { })
		return () => { isMounted = false }
	}, [])

	const isPlayerLocated = (rowIndex: number, sectionIndex: number) => {
		const isFound = Object.keys(players).find(key => players[key].location.x === rowIndex && players[key].location.y === sectionIndex);
		return !!isFound;
	}
	return (
		<div id="mapid">
			{mapData.grid.map((row: any, rowIndex: number) =>
				<div key={`row-${rowIndex}`} style={{ display: 'flex' }}>
					{row.map((section: any, sectionIndex: number) =>
						<>
							{
								rowIndex === playerCharacter?.location?.x && sectionIndex === playerCharacter?.location?.y ?
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