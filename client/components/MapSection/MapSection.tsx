import React from 'react'
import { IMapSectionInfo } from '../../models/mapSection.model';

type MapSectionProps = {
	sectionId: string,
	section: IMapSectionInfo,
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

export default MapSection