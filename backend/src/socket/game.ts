import { Server, Socket } from "socket.io"
import { decisionTimeInSeconds, socketGameMap } from "."
import Game, { roundParams, decadeDecision } from "../game"

const registerGame = (io: Server, socket: Socket) => {
	let a: NodeJS.Timeout | null = null

	const handleDecade = (game: Game) => {
		//start decade
		game.startDecade()
		io.to(game.socketRoom).emit("gameState", game.getGameState())
		a = setTimeout(() => {
			game.finishDecade()
			//decade finished
			io.to(game.socketRoom).emit("gameState", game.getGameState())
		}, decisionTimeInSeconds * 1000)
	}

	socket.on("gameStartRequest", (params: roundParams) => {
		const game = socketGameMap.get(socket.id)
		if (!game || game.adminId !== socket.id) return
		game.startRound(params)
		handleDecade(game)
	})

	socket.on("decadeStartRequest", () => {
		const game = socketGameMap.get(socket.id)
		if (!game || game.adminId !== socket.id) return
		if (game.finishedRound) {
			//game finished
			io.to(game.socketRoom).emit("gameState", game.getGameState())
		} else {
			handleDecade(game)
		}
	})

	socket.on("decadeDecision", (decision: decadeDecision) => {
		const game = socketGameMap.get(socket.id)
		game?.addDecadeDecision(socket.id, decision)

		if (game?.checkAllDecided()) {
			if (a) {
				clearTimeout(a)
				a = null
			}
			game.finishDecade()
			io.to(game.socketRoom).emit("gameState", game.getGameState())
		}
	})
}

export default registerGame
