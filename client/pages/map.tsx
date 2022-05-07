import { useEffect, useState } from "react"
import * as Colyseus from "colyseus.js"
import { usePlayerListeners } from "../hooks/usePlayerListeners";
import { Room } from "colyseus.js";
import { MapSection } from "../models/mapSection.model";

type Props = {}

const client = new Colyseus.Client('ws://localhost:2567');
type MapSectionProps = {
	sectionIndex: number,
	section: MapSection,
	isPlayerCharacter?: boolean,
	isPlayer?: boolean
}
const MapSection = ({
	section,
	sectionIndex,
	isPlayerCharacter,
	isPlayer
}: MapSectionProps) => {
	const sectionHeightWidth = 10;
	return (
		<div
			key={`section-${sectionIndex}`}
			style={{
				backgroundColor: isPlayerCharacter ? '#ff0000' : isPlayer ? '#0000ff' : section.hexColor,
				height: `${sectionHeightWidth}px`,
				width: `${sectionHeightWidth}px`
			}}></div>
	)
}
const Map = (props: Props) => {

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
		const isFound = Object.keys(players || {}).find(key => players[key].location.x === rowIndex && players[key].location.y === sectionIndex);
		return !!isFound;
	}
	return (
		<div id="mapid">
			{Object.keys(players || {}).length || 1}
			{mapData.grid.map((row: any, rowIndex: number) =>
				<div key={`row-${rowIndex}`} style={{ display: 'flex' }}>
					{row.map((section: any, sectionIndex: number) =>
						<>
							{
								rowIndex === playerCharacter?.location?.x && sectionIndex === playerCharacter?.location?.y ?
									(
										<MapSection sectionIndex={sectionIndex} section={section} isPlayerCharacter />
									)
									: isPlayerLocated(rowIndex, sectionIndex) ?
										(
											<MapSection sectionIndex={sectionIndex} section={section} isPlayer />
										)
										:
										(
											<MapSection sectionIndex={sectionIndex} section={section} />
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