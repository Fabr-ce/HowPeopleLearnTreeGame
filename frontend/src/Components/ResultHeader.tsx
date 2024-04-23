import { useSocket } from "../App"
import { gameState } from "../types"

export default function ResultHeader({ game }: { game: gameState }) {
	const socket = useSocket()
	const consumedTreeMap = game.players.map(p => p.decisions[game.nextDecade - 1]?.amount)
	const consumedTrees = consumedTreeMap.reduce((pre, curr) => pre + curr, 0)
	const selfConsumed = consumedTreeMap[game.players.findIndex(p => p.socketId === socket.id)]

	return (
		<div className="w-full flex items-center justify-center">
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
	)
}
