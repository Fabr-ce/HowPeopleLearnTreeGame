import { useEffect, useState } from "react"
import { useGameState, useSocket } from "../App"
import { useNavigate, useParams } from "react-router-dom"
import Lobby from "./Lobby"
import GameRules from "./GameRules"
import Decade from "./Decade"
import DecadeResult from "./DecadeResult"
import Results from "./Results"
import Question from "./Question"
import Discussion from "./Discussion"

export default function Game() {
	const { gameId } = useParams()
	const navigate = useNavigate()
	const socket = useSocket()
	const gameState = useGameState()
	const [sentRequest, changeRequest] = useState(false)

	const returnHome = () => {
		navigate("/")
	}

	useEffect(() => {
		if (gameState === null && !sentRequest) {
			socket.emit("gameLobby", gameId)
			changeRequest(true)
		}

		socket.on("returnHome", returnHome)

		return () => {
			socket.off("returnHome", returnHome)
		}
	})

	const gameIsRunning = gameState?.inRoundRules || gameState?.nextDecade !== 0 || gameState?.runningDecade
	const isNotInGame = !gameState?.players.find(p => p.socketId === socket.id)
	if (gameState === null || !gameIsRunning || isNotInGame) return <Lobby game={gameState} />
	else if (gameState.inDiscussion) return <Discussion game={gameState} />
	else if (gameState.inRoundRules) return <GameRules game={gameState} />
	else if (gameState.currentQuestion) return <Question game={gameState} />
	else if (gameState.runningDecade) return <Decade game={gameState} />
	else if (!gameState.finishedRound) return <DecadeResult game={gameState} />
	else return <Results game={gameState} />
}
