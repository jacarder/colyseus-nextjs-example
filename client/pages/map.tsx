import { useEffect, useState } from "react"
import * as Colyseus from "colyseus.js"

type Props = {}
const Map = (props: Props) => {
	const sectionHeightWidth = 10;
	const [mapData, setMapData] = useState<{ grid: [][] }>({ grid: [] })
	const [userData, setUserData] = useState({
		x: 50,
		y: 20,
	});
	useEffect(() => {
		const client = new Colyseus.Client('ws://localhost:2567');
		client.joinOrCreate('my_room').then((room) => {
			room.onMessage('generated_map', (message) => {
				setMapData(message)
			})
		})
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
			console.log(udCopy)
			setUserData({
				...udCopy
			})
		};
		document.addEventListener("keyup", keyListener)
		return () => { document.removeEventListener('keyup', keyListener) }
	}, [userData])

	return (
		<div id="mapid">
			{mapData.grid.map((row: any, rowIndex: number) =>
				<div key={`row-${rowIndex}`} style={{ display: 'flex' }}>
					{row.map((section: any, sectionIndex: number) =>
						<>
							{
								rowIndex === userData.x && sectionIndex === userData.y ?
									<div
										key={`user-${sectionIndex}`}
										style={{
											backgroundColor: '#ff0000',
											height: `${sectionHeightWidth}px`,
											width: `${sectionHeightWidth}px`
										}}></div>
									:
									< div
										key={`section-${sectionIndex}`}
										style={{
											backgroundColor: section.hexColor,
											height: `${sectionHeightWidth}px`,
											width: `${sectionHeightWidth}px`
										}}></div>
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