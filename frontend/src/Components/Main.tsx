import classNames from "classnames"
import { useEffect, useState } from "react"
import { useSocket } from "../App"
import { useNavigate } from "react-router-dom"

export default function Main() {
	const navigator = useNavigate()
	const socket = useSocket()
	const [gameId, changeGameId] = useState("")

	const joinGroup = (e: React.FormEvent) => {
		e.preventDefault()
		if (gameId === "") return
		socket.emit("joinGame", gameId)
	}

	const createGame = (e: React.FormEvent) => {
		e.preventDefault()
		socket.emit("createGame")
	}

	const enterLobby = (gameId: number) => {
		navigator("/" + gameId)
	}

	useEffect(() => {
		socket.on("enterLobby", enterLobby)
		return () => {
			socket.off("enterLobby", enterLobby)
		}
	})

	return (
		<div className="w-full h-full flex items-center justify-center flex-col gap-7 p-5 px-4">
			<h1 className="text-5xl font-bold">Play Game</h1>
			<div className="flex flex-col border-opacity-50 bg-neutral p-5 rounded-lg">
				<form onSubmit={joinGroup} className="flex-grow">
					<input
						value={gameId}
						onChange={e => changeGameId(e.target.value)}
						type="text"
						name="gameId"
						placeholder="Game PIN"
						className={classNames("w-full input input-bordered bg-neutral/10 mb-2")}
					/>
					<button className="w-full btn btn-primary">Join Game</button>
				</form>
				<div className="divider">OR</div>
				<form onSubmit={createGame} className="flex-grow">
					<button className="w-full btn btn-primary" type="submit">
						Create New Game
					</button>
				</form>
			</div>
		</div>
	)
}
