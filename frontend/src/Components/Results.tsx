import { gameState } from "../types"
import BottomRightButton from "./BottomRightButton"
import ResultHeader from "./ResultHeader"

export default function Results({ game }: { game: gameState }) {
	return (
		<div className="p-4">
			<h2 className="text-3xl text-center w-full font-bold mt-2 mb-5">Round Results</h2>
			<div className="alert alert-info">
				This Round is over. It lasted {game.nextDecade} rounds. You have {game.treesLeft} trees left.
			</div>
			<ResultHeader game={game} />
			<div className="overflow-x-auto py-5">
				<table className="table bg-base-200">
					{/* head */}
					<thead>
						<tr>
							<th>Name</th>
							<th>Total</th>
							<th>Quest.</th>
							{new Array(game.nextDecade).fill(true).map((b, i) => (
								<th key={i}>{i + 1}.</th>
							))}
						</tr>
					</thead>
					<tbody>
						{game.players
							.sort((a, b) => b.treeCount - a.treeCount)
							.map(p => {
								return (
									<tr key={p.socketId}>
										<td>{p.name}</td>
										<td>{p.treeCount}</td>
										<td>{p.questionCount}</td>
										{p.decisions.map((d, i) => (
											<td key={i}>{d?.amount ?? 0}</td>
										))}
									</tr>
								)
							})}
					</tbody>
				</table>
			</div>
			{game.roundNr === 4 ? (
				<div className="alert alert-info">This game is finished. Thank you for playing.</div>
			) : (
				<BottomRightButton adminId={game.adminId} event="discussionRequest" title="Next" />
			)}
		</div>
	)
}
