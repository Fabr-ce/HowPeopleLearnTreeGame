import { useEffect, useState } from "react"
import { gameState } from "../types"
import { useSocket } from "../App"
import classNames from "classnames"
import BottomRightButton from "./BottomRightButton"

const stepsInMs = 20
const totalTimeInSec = 30 - 1 // -1 for some delays

type questionOptions = "A" | "B" | "C" | "D"
const possibilities: questionOptions[] = ["A", "B", "C", "D"]

export default function Question({ game }: { game: gameState }) {
	const socket = useSocket()
	const [vote, changeVote] = useState<questionOptions | null>(null)
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

	const sendDecade = (awnser: questionOptions) => {
		socket.emit("questionDecision", awnser)
		changeVote(awnser)
	}

	return (
		<div className="p-3 w-full">
			<div>
				<h2 className="text-3xl text-center w-full font-bold mt-2 mb-5">
					Intermediate Question Decade {game.nextDecade + 1}
				</h2>
			</div>
			<div className="w-full flex justify-center mb-3">
				{!game.showQuestionSolution && (
					<progress
						className="progress progress-secondary h-4 max-w-sm"
						value={progress}
						max="100"
					></progress>
				)}
			</div>

			<p className="my-10 text-2xl text-center">{game.currentQuestion!.question}</p>

			<div className="grid grid-cols-2 gap-4 p-1 px-5">
				{possibilities.map(p => (
					<button
						key={p}
						className={classNames("rounded p-3 text-xl text-white font-bold min-h-20", {
							"bg-secondary/10": vote !== null && vote !== p,
							"bg-secondary/70": vote === null || (vote === p && !game.showQuestionSolution),
							"bg-success": game.showQuestionSolution && game.currentQuestion?.solution === p,
							"bg-error": game.showQuestionSolution && game.currentQuestion?.solution !== p && vote === p,
						})}
						onClick={() => !game.showQuestionSolution && sendDecade(p)}
					>
						<div className="inline-flex">{game.currentQuestion![p]}</div>
					</button>
				))}
			</div>
			{game.showQuestionSolution && game.currentQuestion?.explanation && (
				<div className="rounded-lg p-4 mt-10 mx-4 bg-info/20 text-lg text-white">
					{game.currentQuestion.explanation}
				</div>
			)}
			{game.showQuestionSolution && (
				<BottomRightButton adminId={game.adminId} event="decadeStartRequest" title="Next" />
			)}
		</div>
	)
}
