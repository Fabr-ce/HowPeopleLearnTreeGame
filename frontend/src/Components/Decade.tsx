import { useEffect, useState } from "react"
import { gameState, decadeDecision } from "../types"
import { useSocket } from "../App"
import classNames from "classnames"
import { FaTree } from "react-icons/fa"

const stepsInMs = 20
const totalTimeInSec = 30 - 1 // -1 for some delays

const possibilities = [0, 1, 2, 3, 4, 5]

export default function Decade({ game }: { game: gameState }) {
	const socket = useSocket()
	const [vote, changeVote] = useState<number | null>(null)
	const [progress, changeProgress] = useState(100)

	useEffect(() => {
		const a = setInterval(() => {
			if (progress <= 0) {
				clearInterval(a)
				return
			}
			changeProgress(progress => Math.max(progress - (stepsInMs / 1000) * (100 / totalTimeInSec), 0))
		}, stepsInMs)

		return () => {
			clearInterval(a)
		}
	})

	const sendDecade = (amount: number) => {
		const decision: decadeDecision = { amount }
		socket.emit("decadeDecision", decision)
		changeVote(amount)
	}

	return (
		<div className="p-3 w-full">
			<div>
				<h2 className="text-3xl text-center w-full font-bold mt-2 mb-5">Decade {game.nextDecade + 1}</h2>
			</div>
			<div className="w-full flex justify-center mb-3">
				<progress className="progress progress-secondary h-4 max-w-sm" value={progress} max="100"></progress>
			</div>

			<div className="grid grid-cols-2 gap-4 p-1">
				{possibilities.map(p => (
					<button
						key={p}
						className={classNames("rounded p-3 text-xl text-white font-bold min-h-20", {
							"bg-primary/10": vote !== null && vote !== p,
							"bg-primary": vote === null || vote === p,
							"btn-disabled": vote !== null,
						})}
						onClick={() => sendDecade(p)}
					>
						<div className="inline-flex">
							{p}x<FaTree size="1.7rem" className="ml-.5" />
						</div>
					</button>
				))}
			</div>
		</div>
	)
}
