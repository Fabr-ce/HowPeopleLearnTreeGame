import { Server, Socket } from "socket.io"
import { games, socketGameMap } from "."

const registerLobby = (io: Server, socket: Socket) => {
	socket.on("gameLobby", (gameId: string) => {
		const game = games.find(g => g.id === parseInt(gameId))
		if (!game) {
			socket.emit("returnHome")
			return
		}
		socket.join(game.socketRoom)
		socketGameMap.set(socket.id, game)
		socket.emit("gameState", game.getGameState())
	})

	socket.on("requestGameRules", () => {
		const game = socketGameMap.get(socket.id)
		if (!game || game.adminId !== socket.id) return
		game.inRoundRules = true
		io.to(game.socketRoom).emit("gameState", game.getGameState())
	})

	socket.on("joinGame", (gameId: string, name: string) => {
		const game = games.find(g => g.id === parseInt(gameId))
		if (!game) {
			socket.emit("returnHome")
			return
		}
		if (!name) return
		socketGameMap.set(socket.id, game)
		socket.join(game.socketRoom)
		game.addPlayer(socket.id, name)
		io.to(game.socketRoom).emit("gameState", game.getGameState())
	})

	socket.on("disconnect", () => {
		const game = socketGameMap.get(socket.id)
		if (game) {
			game.removePlayer(socket.id)
			io.to(game.socketRoom).emit("gameState", game.getGameState())
			socketGameMap.delete(socket.id)
		}
	})
}

export default registerLobby
