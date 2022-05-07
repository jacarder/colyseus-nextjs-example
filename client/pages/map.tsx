import { useEffect, useState } from "react"
import * as Colyseus from "colyseus.js"
import { usePlayerListeners } from "../hooks/usePlayerListeners";
import { Room } from "colyseus.js";
import { MapSection } from "../models/mapSection.model";
import { Player } from "../models/player.model";

type Props = {}

const client = new Colyseus.Client('ws://localhost:2567');
type MapSectionProps = {
	sectionId: string,
	section: MapSection,
	hasPlayerCharacter?: boolean,
	hasPlayer?: boolean,
	playerId?: string
}
const MapSection = ({
	section,
	sectionId,
	hasPlayerCharacter,
	hasPlayer,
	playerId
}: MapSectionProps) => {
	const sectionHeightWidth = 10;
	return (
		<div
			key={`${hasPlayer || hasPlayerCharacter ? playerId : 'section'}-${sectionId}`}
			style={{
				backgroundColor: hasPlayerCharacter ? '#ff0000' : hasPlayer ? '#0000ff' : section.hexColor,
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
	const getPlayerIdByRowSection = (rowIndex: number, sectionIndex: number) => {
		return Object.keys(players || {}).find(key => players[key].location.x === rowIndex && players[key].location.y === sectionIndex)
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
										<MapSection key={`${rowIndex}-${sectionIndex}-test`} sectionId={`${rowIndex}-${sectionIndex}`} section={section} hasPlayerCharacter playerId={getPlayerIdByRowSection(rowIndex, sectionIndex)} />
									)
									: isPlayerLocated(rowIndex, sectionIndex) ?
										(
											<MapSection sectionId={`${rowIndex}-${sectionIndex}`} section={section} hasPlayer playerId={getPlayerIdByRowSection(rowIndex, sectionIndex)} />
										)
										:
										(
											<MapSection sectionId={`${rowIndex}-${sectionIndex}`} section={section} />
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