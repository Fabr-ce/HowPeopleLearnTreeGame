import { Socket, Server } from "socket.io"
import Game from "../game"
import registerHomePage from "./homePage"
import registerLobby from "./lobby"
import registerGame from "./game"

export const games: Game[] = []
export const socketGameMap = new Map<string, Game>()

export const decisionTimeInSeconds = 30

const registerServerSocket = (io: Server, socket: Socket) => {
	registerHomePage(io, socket)
	registerLobby(io, socket)
	registerGame(io, socket)
}

export default registerServerSocket
