import { useEffect, useState } from "react"
import * as Colyseus from "colyseus.js"
import { usePlayerListeners } from "../hooks/usePlayerListeners";
import { Room } from "colyseus.js";
import MapSection from "../components/MapSection/MapSection";
import { IMapSectionInfo } from "../models/mapSection.model";

type Props = {}

const client = new Colyseus.Client('wss://qs6pnm.colyseus.dev');
const Map = (props: Props) => {
	const maxSize: { x: number, y: number } = { x: 20, y: 20 }
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
				console.log(client)
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
	const generateMapSection = (rowIndex: number, sectionIndex: number, section: IMapSectionInfo) => {
		if (
			rowIndex === playerCharacter?.location?.x
			&&
			sectionIndex === playerCharacter?.location?.y) {
			return (
				<MapSection
					key={`${rowIndex}-${sectionIndex}-test`}
					sectionId={`${rowIndex}-${sectionIndex}`}
					section={section}
					hasPlayerCharacter
					playerId={getPlayerIdByRowSection(rowIndex, sectionIndex)}
				/>
			)
		} else if (isPlayerLocated(rowIndex, sectionIndex)) {
			return (
				<MapSection
					sectionId={`${rowIndex}-${sectionIndex}`}
					section={section}
					hasPlayer
					playerId={getPlayerIdByRowSection(rowIndex, sectionIndex)}
				/>
			)
		} else {
			return (
				<MapSection sectionId={`${rowIndex}-${sectionIndex}`} section={section} />
			)
		}
	}
	return (
		<div id="mapid">
			{Object.keys(players || {}).length || 1}
			{mapData.grid.map((row: any, rowIndex: number) =>
				<div key={`row-${rowIndex}`} style={{ display: 'flex' }}>
					{row.map((section: any, sectionIndex: number) => {
						if (
							(
								rowIndex <= (playerCharacter.location.x + maxSize.x) &&
								rowIndex >= (playerCharacter.location.x - maxSize.x)
							) &&
							(
								sectionIndex >= (playerCharacter.location.y - maxSize.y) &&
								sectionIndex <= (playerCharacter.location.y + maxSize.y)
							)
						) {
							return generateMapSection(rowIndex, sectionIndex, section);
						}
					})}
				</div>
			)
			}
		</div >
	)
}

export default Map