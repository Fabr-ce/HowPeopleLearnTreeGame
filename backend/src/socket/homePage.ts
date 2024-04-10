import { Server, Socket } from "socket.io"
import { games } from "."
import Game from "../game"

const registerHomePage = (io: Server, socket: Socket) => {
	socket.on("createGame", () => {
		const gameId = getRandomId()
		const game = new Game(gameId)
		games.push(game)

		socket.emit("enterLobby", gameId)
	})

	socket.on("joinGame", (gameId: string) => {
		const game = games.find(g => g.id === parseInt(gameId))
		if (!game) return

		socket.emit("enterLobby", parseInt(gameId))
	})
}

export default registerHomePage

const getRandomId = () => {
	while (true) {
		const randInt = Math.floor(Math.random() * 10000)
		const alreadyIn = !!games.find(game => game.id === randInt)
		if (!alreadyIn) return randInt
	}
}
