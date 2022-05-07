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
	const id = `${hasPlayer || hasPlayerCharacter ? playerId : 'section'}-${sectionId}`
	const playerBackgroundColor = hasPlayerCharacter ? '#ff0000' : hasPlayer ? '#0000ff' : section.hexColor;
	const adjustColor = (color, amount) => {
		return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
	}
	return (
		<div
			key={id}
			style={{
				backgroundColor: section.hexColor,
				height: `${sectionHeightWidth}px`,
				width: `${sectionHeightWidth}px`,
				display: "grid",
				justifyContent: "center",
				alignItems: "center"
			}}>
			{
				hasPlayerCharacter || hasPlayer ?
					(
						<div id={id} style={{
							backgroundColor: adjustColor(playerBackgroundColor, -10),
							height: `${sectionHeightWidth / 1.3}px`,
							width: `${sectionHeightWidth / 1.3}px`,
							borderRadius: '10px'
						}}></div>
					)
					:
					(
						<div id={id} style={{
							backgroundColor: adjustColor(section.hexColor, 10),
							height: `${sectionHeightWidth / 1.2}px`,
							width: `${sectionHeightWidth / 1.2}px`
						}}></div>
					)
			}

		</div>
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