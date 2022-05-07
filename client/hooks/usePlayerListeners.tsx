import { useCallback, useEffect, useMemo, useState } from "react"
import { Player } from "../models/player.model"
import { Players } from "../models/players.model"

export const usePlayerListeners = (room) => {
	const [playerCharacter, setPlayerCharacter] = useState<Player>()
	const [players, setPlayers] = useState<Players>()
	const handleListenToPlayers = useCallback(
		(room) => {
			room.state.players.onAdd = (player, key) => {
				setPlayers(state => ({ ...state, [key]: player }))
				if (key === room.sessionId) {
					player.location.listen('x', (c, p) => {
						setPlayerCharacter(state => ({
							...state,
							location: {
								...state?.location,
								x: c,
							}
						}))
					})
					player.location.listen('y', (c, p) => {
						setPlayerCharacter(state => ({
							...state,
							location: {
								...state?.location,
								y: c,
							}
						}))
					})
				}
				player.location.onChange = (changes: any[], t) => {
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
			room.state.players.onRemove = (player, key) => {
				console.log("removed")
				setPlayers(state => {
					const stateCopy = { ...state };
					delete stateCopy[key]
					return {
						...stateCopy
					}
				})
			}
		},
		[],
	)
	const handleListenToKeyboard = useCallback(
		(room) => {
			const keyListener = (event) => {
				// let udCopy = { ...playerCharacter };
				// if (udCopy.location) {
				// 	console.log("udcopy something", playerCharacter)
				// 	switch (event.code) {
				// 		case 'ArrowDown': // down
				// 			++udCopy.location.x;
				// 			break;
				// 		case 'ArrowLeft': // left
				// 			--udCopy.location.y;
				// 			break;
				// 		case 'ArrowRight': // right
				// 			++udCopy.location.y;
				// 			break;
				// 		case 'ArrowUp': // up
				// 			--udCopy.location.x;
				// 			break;
				// 	}
				// 	setPlayerCharacter({
				// 		...udCopy
				// 	})
				// }
				room.send("player_move", event.code)
			};
			document.addEventListener("keyup", keyListener)
			return () => { document.removeEventListener('keyup', keyListener) }
		},
		[],
	)
	useEffect(() => {
		let isMounted = false
		if (!isMounted && room) {
			isMounted = true;
			handleListenToPlayers(room);
			handleListenToKeyboard(room);
		}
	}, [room, handleListenToPlayers, handleListenToKeyboard])

	return [playerCharacter, players] as const;
}