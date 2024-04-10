import classNames from "classnames"
import { gameState } from "../types"
import BottomRightButton from "./BottomRightButton"
import { useSocket } from "../App"
import ResultHeader from "./ResultHeader"

export default function DecadeResult({ game }: { game: gameState }) {
	return (
		<div className="p-4">
			<h2 className="text-3xl text-center w-full font-bold mt-2 mb-5">Result Decade {game.nextDecade}</h2>
			<ResultHeader game={game} />
			{!game.roundParams.decadeResultsHidden && (
				<div className="grid grid-cols-2 gap-3 w-full text-white">
					{game.players.map(p => {
						const lastDecision = p.decisions[game.nextDecade - 1]?.amount
						return (
							<div key={p.socketId} className="rounded bg-base-300 p-4">
								<h5 className="text-lg text-center w-full mb-2 font-bold">{p.name}</h5>
								<p className="mb-2">Total Trees: {p.treeCount}</p>
								<div className="flex items-center justify-center w-full">
									<div
										className={classNames(
											"rounded p-2 bg-secondary h-10 w-10 text-center font-bold",
											{
												"bg-success/60": lastDecision === 0,
												"bg-warning/60": lastDecision === 1 || lastDecision === 2,
												"bg-error/60": lastDecision === 3,
											}
										)}
									>
										{lastDecision}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}

			<BottomRightButton adminId={game.adminId} event="decadeStartRequest" title="Next Decade" />
		</div>
	)
}
