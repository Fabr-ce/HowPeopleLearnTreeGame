import { useSocket } from "../App"
import { gameState } from "../types"
import BottomRightButton from "./BottomRightButton"

export default function GameRules({ game }: { game: gameState }) {
	const socket = useSocket()

	const isAdmin = game.adminId === socket.id

	return (
		<div className="p-4 mb-10">
			<h2 className="text-3xl my-5 text-center font-bold">Game Rules</h2>
			<ul className="steps steps-vertical mb-2">
				<li className="step">You are Woodcutters which cut down trees to supply for you family and needs.</li>
				<li className="step">The goal is to have the maximum number of trees after every round.</li>
				<li className="step">
					To achieve the goal you can choose the amount of trees (0-5) you want to chop during a decade.
				</li>
				<li className="step">
					However there are only {game.players.length * 3}(= #players * 3) trees available at the beginning.
				</li>
				<li className="step">
					Luckily for you, the forest regenerates after every decade and the remaining trees double for the
					next decade.
				</li>
				<li className="step">The game stops after 10 decades or if there are no trees left.</li>

				<li className="step">
					You only see how many trees are left in the forest but not how many trees every individual
					woodcutter cheopped.
				</li>
			</ul>
			{isAdmin && (
				<div className="my-4 alert alert-info flex flex-col gap-0">
					<h5 className="font-bold text-lg mb-2">You are Admin</h5>
					This means that whenever there is no timer visible you are the one that must continue the game after
					you discussed the result. This is done by clicking the button on the bottom right (e.g. "Start
					Game")
				</div>
			)}
			<BottomRightButton adminId={game.adminId} event="gameStartRequest" title="Start Game" />
		</div>
	)
}
