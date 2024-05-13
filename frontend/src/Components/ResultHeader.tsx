import { FaTree } from "react-icons/fa"
import { useSocket } from "../App"
import { gameState } from "../types"

export default function ResultHeader({ game }: { game: gameState }) {
	const socket = useSocket()
	const consumedTreeMap = game.players.map(p => p.decisions[game.nextDecade - 1]?.amount)
	const consumedTrees = consumedTreeMap.reduce((pre, curr) => pre + curr, 0)
	const ownPlayerIndex = game.players.findIndex(p => p.socketId === socket.id)
	const ownPlayer = game.players[ownPlayerIndex]
	const selfConsumed = consumedTreeMap[ownPlayerIndex]

	return (
		<div>
			<div className="w-full flex items-center justify-center mb-2">
				<div className="stats stats-vertical lg:stats-horizontal">
					<div className="stat">
						<div className="stat-title">Total trees for next decade</div>
						<div className="stat-value">{game.treesLeft || 0}</div>
					</div>

					<div className="stat">
						<div className="stat-title">Trees chopped this decade</div>
						<div className="stat-value text-error">{consumedTrees || 0}</div>
						<div className="stat-desc text-md">{selfConsumed || 0} chopped by you</div>
					</div>

					<div className="stat">
						<div className="stat-title">Total trees regrown</div>
						<div className="stat-value text-success">{game.treesLeft / 2 || 0}</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between">
				<div></div>
				<div className="rounded-lg bg-base-300 inline-flex p-3 font-bold text-white mb-1">
					Your Total is: {ownPlayer.treeCount}x<FaTree size="1.7rem" className="ml-.5" />
				</div>
			</div>
		</div>
	)
}
