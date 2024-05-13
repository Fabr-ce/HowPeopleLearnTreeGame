import { useEffect, useState } from "react"
import { gameState, decadeDecision } from "../types"
import { useSocket } from "../App"
import classNames from "classnames"
import { FaTree } from "react-icons/fa"
import ActivateButton from "./ActivateButton"
import Progress from "./Progress"

const possibilities = [0, 1, 2, 3, 4, 5]

export default function Decade({ game }: { game: gameState }) {
	const socket = useSocket()
	const [sendPolice, changeSendPolice] = useState(false)
	const [seeDecadeResult, changeSeeResults] = useState(false)
	const [stealProtection, changeStealProtection] = useState(false)
	const [stealTrees, changeStealTrees] = useState<string | undefined>()
	const [vote, changeVote] = useState<number | null>(null)

	const sendDecade = (amount: number) => {
		const decision: decadeDecision = { amount, seeDecadeResult, sendPolice, stealProtection, stealTrees }
		socket.emit("decadeDecision", decision)
		changeVote(amount)
	}

	useEffect(() => {
		if (vote !== null) sendDecade(vote)
	}, [sendPolice, seeDecadeResult, stealProtection, stealTrees, vote])

	return (
		<div className="p-3 w-full">
			<div>
				<h2 className="text-3xl text-center w-full font-bold mt-2 mb-5">Decade {game.nextDecade + 1}</h2>
			</div>
			<div className="w-full flex justify-center mb-4">
				<Progress />
			</div>
			<div className="flex justify-between gap-2 my-3">
				<div className="rounded-lg bg-base-300 inline-flex p-3 font-bold text-white mb-1">
					Trees left: {game.treesLeft}x<FaTree size="1.7rem" className="ml-.5" />
				</div>
				<div className="rounded-lg bg-base-300 inline-flex p-3 font-bold text-white mb-1">
					You have: {game.players.find(p => p.socketId === socket.id)?.treeCount}x
					<FaTree size="1.7rem" className="ml-.5" />
				</div>
			</div>
			<div className="flex gap-5 my-3">
				{game.roundParams.sendPolicePossible && (
					<ActivateButton active={sendPolice} changeActive={changeSendPolice} title="Send Police" />
				)}
				{game.roundParams.payToSeeDecadeResult && (
					<ActivateButton
						active={seeDecadeResult}
						changeActive={changeSeeResults}
						title="Pay to see decade Results"
					/>
				)}
				{game.roundParams.stealProtectionPayment && (
					<ActivateButton
						active={stealProtection}
						changeActive={changeStealProtection}
						title="Pay to protect against steals"
					/>
				)}
				{game.roundParams.stealTreesPossible && (
					<div className="flex items-center gap-1 px-2">
						<div>Steal from: </div>
						<button
							className={classNames("rounded p-2 text-white", {
								"bg-primary/10": stealTrees !== undefined,
								"bg-primary": stealTrees === undefined,
							})}
							onClick={() => changeStealTrees(undefined)}
						>
							-
						</button>
						{game.players
							.filter(p => p.socketId !== socket.id)
							.map(p => (
								<button
									key={p.socketId}
									className={classNames("rounded p-2 text-white", {
										"bg-primary/10": stealTrees !== p.socketId,
										"bg-primary": stealTrees === p.socketId,
									})}
									onClick={() => changeStealTrees(p.socketId)}
								>
									{p.name}
								</button>
							))}
					</div>
				)}
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
			<div className="my-3 rounded-lg bg-base-300 inline-flex p-3 font-bold text-white mb-1">
				Current players: {game.players.length}
			</div>
		</div>
	)
}
