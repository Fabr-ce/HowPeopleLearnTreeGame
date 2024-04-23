import { Server, Socket } from "socket.io"
import { decisionTimeInSeconds, games, socketGameMap } from "."
import Game, { roundParams, decadeDecision } from "../game"

const registerGame = (io: Server, socket: Socket) => {
	let a: NodeJS.Timeout | null = null

	const handleDecade = async (game: Game) => {
		//start decade
		game.startDecade()
		if (!!game.currentQuestion) {
			handleQuestion(game)
			return
		}

		io.to(game.socketRoom).emit("gameState", game.getGameState())
		const decadeNr = game.nextDecade
		a = setTimeout(() => {
			if (game.nextDecade !== decadeNr) return
			game.finishDecade()
			//decade finished
			io.to(game.socketRoom).emit("gameState", game.getGameState())
		}, decisionTimeInSeconds * 1000)
	}

	const handleQuestion = async (game: Game) => {
		const questionNr = game.currentQuestion
		io.to(game.socketRoom).emit("gameState", game.getGameState())
		a = setTimeout(() => {
			if (game.currentQuestion !== questionNr) return
			game.showQuestionSolution = true
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

	socket.on("questionDecision", (decision: string) => {
		const game = socketGameMap.get(socket.id)
		game?.addQuestionDecision(socket.id, decision)

		if (game?.checkAllQuestionAwnsered()) {
			if (a) {
				clearTimeout(a)
				a = null
			}
			game.showQuestionSolution = true
			io.to(game.socketRoom).emit("gameState", game.getGameState())
		}
	})
}

export default registerGame
