import classNames from "classnames"
import { gameState } from "../types"
import BottomRightButton from "./BottomRightButton"
import ResultHeader from "./ResultHeader"
import { useSocket } from "../App"

export default function DecadeResult({ game }: { game: gameState }) {
	const socket = useSocket()
	const selfPlayer = game.players.find(p => p.socketId === socket.id)
	const curentDecision = selfPlayer!.decisions[game.nextDecade - 1]
	const stolePlayer = game.players.find(p => p.socketId === curentDecision.stealTrees)?.decisions[game.nextDecade - 1]

	return (
		<div className="p-4">
			<h2 className="text-3xl text-center w-full font-bold mt-2 mb-5">Result Decade {game.nextDecade}</h2>
			<ResultHeader game={game} />

			{game.roundParams.sendPolicePossible && selfPlayer?.lastPoliceFine === game.nextDecade - 1 && (
				<div className="alert alert-warning my-3">
					You got caught by the police when taking more than 2 trees! You get a penalty of 3 trees.
				</div>
			)}

			{game.roundParams.stealTreesPossible && selfPlayer?.lastStolen === game.nextDecade - 1 && (
				<div className="alert alert-warning my-3">You got robbed by the another player taking 3 trees!</div>
			)}

			{game.roundParams.stealTreesPossible && selfPlayer?.lastSuccessfullSteal === game.nextDecade - 1 && (
				<div className="alert alert-success my-3">You successfully stole 3 trees!</div>
			)}

			{game.roundParams.stealTreesPossible &&
				curentDecision.stealTrees !== undefined &&
				selfPlayer?.lastSuccessfullSteal !== game.nextDecade - 1 &&
				(stolePlayer?.stealProtection ? (
					<div className="alert alert-warning my-3">The other player protected against thieves</div>
				) : (
					<div className="alert alert-warning my-3">
						You got caught trying to steal 3 trees! You get a penalty of 10 trees.
					</div>
				))}

			{game.roundParams.sayNumberOfTrees && (
				<div className="alert alert-info my-3">
					You should now tell the others how many trees you chopped and what is the plan for the next round.
					(Who knows it you say the truth :D)
				</div>
			)}
			{(!game.roundParams.decadeResultsHidden ||
				(game.roundParams.payToSeeDecadeResult && curentDecision.seeDecadeResult)) && (
				<table className="table bg-base-200 mt-4">
					{/* head */}
					<thead>
						<tr>
							<th>Name</th>
							<th>Total</th>
							<th>Decade {game.nextDecade}</th>
						</tr>
					</thead>
					<tbody>
						{game.players
							.sort((a, b) => b.treeCount - a.treeCount)
							.map(p => {
								const lastDecision = p.decisions[game.nextDecade - 1]?.amount
								return (
									<tr key={p.socketId}>
										<td>{p.name}</td>
										<td>{p.treeCount}</td>
										<td>{lastDecision ?? 0}</td>
									</tr>
								)
							})}
					</tbody>
				</table>
			)}

			<BottomRightButton adminId={game.adminId} event="decadeStartRequest" title="Next Decade" wait />
		</div>
	)
}
