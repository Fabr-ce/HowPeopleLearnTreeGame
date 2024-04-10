import { useSocket } from "../App"
import { gameState } from "../types"
import BottomRightButton from "./BottomRightButton"

export default function GameRules({ game }: { game: gameState }) {
	const socket = useSocket()

	return (
		<div className="p-4">
			Game Rules
			<BottomRightButton adminId={game.adminId} event="gameStartRequest" title="Start Game" />
		</div>
	)
}
