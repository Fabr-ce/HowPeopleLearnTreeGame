import { FormEvent, useState } from "react"
import { useSocket } from "../App"
import { useParams } from "react-router-dom"
import { gameState } from "../types"
import BottomRightButton from "./BottomRightButton"

export default function Lobby({ game }: { game: gameState | null }) {
	const { gameId } = useParams()
	const socket = useSocket()
	const [name, changeName] = useState("")

	const enterGame = (e: FormEvent) => {
		e.preventDefault()
		if (name === "") return
		socket.emit("joinGame", gameId, name)
	}

	const alreadyIn = game?.players.find(p => p.socketId === socket.id)

	return (
		<div className="p-5">
			<h1 className="font-bold text-3xl mb-4">Game #{gameId}</h1>
			{!alreadyIn && (
				<form onSubmit={enterGame} className="flex flex-col border-opacity-50 bg-neutral p-5 rounded-lg mb-3">
					<input
						value={name}
						type="text"
						placeholder="Your Name"
						onChange={e => changeName(e.target.value)}
						className="w-full input input-bordered bg-neutral/10 mb-2"
					/>
					<button className="w-full btn btn-primary" type="submit">
						Enter Game
					</button>
				</form>
			)}

			<div className="grid grid-cols-3 gap-2">
				{game?.players.map(p => (
					<div
						key={p.socketId}
						className="overflow-hidden p-2 rounded h-full w-full bg-accent/60 text-center text-white"
					>
						{p.name}
					</div>
				))}
			</div>

			<BottomRightButton adminId={game?.adminId} event="requestGameRules" title="Start Game" />
		</div>
	)
}
