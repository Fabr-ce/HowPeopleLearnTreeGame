import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { gameState } from "./types"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Main from "./Components/Main"
import Game from "./Components/Game"

import "./index.css"

const SocketContext = createContext<Socket>({} as Socket)

export function useSocket() {
	return useContext(SocketContext)
}

const GameStateContext = createContext<gameState | null>(null)

export function useGameState() {
	return useContext(GameStateContext)
}

const App: React.FC = () => {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [gameState, setGameState] = useState<gameState | null>(null)

	useEffect(() => {
		const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development"
		const socket = isDevelopment ? io(process.env.REACT_APP_SOCKET_URL!, { transports: ["websocket"] }) : io()
		socket.on("gameState", (newGameState: gameState) => setGameState(newGameState))
		setSocket(socket)
	}, [])
	if (socket == null)
		return (
			<div className="p-5">
				Connecting to server
				<span className="loading loading-spinner loading-md ml-2"></span>
			</div>
		)

	return (
		<SocketContext.Provider value={socket}>
			<GameStateContext.Provider value={gameState}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/:gameId" element={<Game />} />
					</Routes>
				</BrowserRouter>
			</GameStateContext.Provider>
		</SocketContext.Provider>
	)
}

export default App
