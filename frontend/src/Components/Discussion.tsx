import { useSocket } from "../App"
import { gameState } from "../types"

// [make visible, say out loud (but hidden), ]

export default function Discussion({ game }: { game: gameState }) {
	const socket = useSocket()

	const gameSuccess = game.nextDecade >= 10
	const [option1, option2] = getNextGameOptions(game)

	const isAdmin = game.adminId === socket.id

	const emitEvent = (type: gameRoundOption["type"]) => {
		if (!isAdmin) return
		const nextParams = { ...game.roundParams, [type]: true }
		socket.emit("gameStartRequest", nextParams)
	}

	return (
		<div className="p-3 w-full pt-5">
			<div>
				<h2 className="text-3xl text-center w-full font-bold mt-2 mb-5">Discussion</h2>
			</div>
			{gameSuccess ? (
				<div>
					<div className="alert alert-success my-3">
						Congratulations your forest sucessfully survived for 10 decades.
					</div>

					<div className="my-5 px-2">
						Please discuss in your group why it worked out this time and what lead you to cooperate.
					</div>
				</div>
			) : (
				<div>
					<div className="alert alert-warning my-3">
						Oh damn, your forest went extinct after {game.nextDecade} decades
					</div>

					<div className="my-5 px-2">
						Please discuss in your group how you (as politicians in your town) could help to improve the
						situation to make success more likely for the other forests in your town.
					</div>
				</div>
			)}

			<div className="my-5 px-2">You have two possibilities to choose from for the next round</div>
			<div className="alert alert-warning my-3">
				Be sure to discuss the impact of the change to the current game before choosing it.
			</div>

			<div className="flex flex-col w-full lg:flex-row my-5">
				{option1 && (
					<button className="grid w-full card bg-base-300 rounded-box place-items-center p-5">
						<h2 className="text-xl text-center w-full font-bold mt-1 mb-3">{option1.title}</h2>
						{option1.description}
						{isAdmin && (
							<button className="btn btn-primary mt-3 right-0" onClick={() => emitEvent(option1.type)}>
								use for next Round
							</button>
						)}
					</button>
				)}
				<div className="divider lg:divider-horizontal">OR</div>
				{option2 && (
					<button className="grid w-full card bg-base-300 rounded-box place-items-center p-5">
						<h2 className="text-xl text-center w-full font-bold mt-1 mb-3">{option2.title}</h2>
						{option2.description}
						{isAdmin && (
							<button className="btn btn-primary mt-3" onClick={() => emitEvent(option2.type)}>
								use for next Round
							</button>
						)}
					</button>
				)}
			</div>
		</div>
	)
}

type gameRoundOption = {
	type: keyof gameState["roundParams"]
	title: string
	description: string
}

const getNextGameOptions = (game: gameState): [gameRoundOption, gameRoundOption] => {
	const gameSuccess = game.nextDecade >= 10
	const options: gameRoundOption[] = []

	const hideResultsPossible = !game.roundParams.decadeResultsHidden
	const stealTreesPossible = !game.roundParams.stealTreesPossible
	const hideResults: gameRoundOption = {
		type: "decadeResultsHidden",
		title: "Hide decade results",
		description:
			"It is nearly impossible to know who chopped how much wood each decade. The only thing we can be sure of is how many trees are left after every decade.",
	}
	const stealTrees: gameRoundOption = {
		type: "stealTreesPossible",
		title: "Thieves enter the village",
		description:
			"Your success attracts thieves. It is now possible for you to steal 3 trees from others in every decade. However, there is a 20% probability that you will be caught doing so. If you are caught you will get a fine of 10 trees.",
	}

	if (gameSuccess) {
		if (hideResultsPossible) options.push(hideResults)
		if (stealTreesPossible) options.push(stealTrees)
	}

	const stealProtection = game.roundParams.stealTreesPossible && !game.roundParams.stealProtectionPayment
	if (stealProtection)
		options.push({
			type: "stealProtectionPayment",
			title: "Steal protection",
			description:
				"You can hire a security guard that protects you from thieves for a decade. The guard costs 1 tree per decade you use him.",
		})

	const sendPolicePossible = !game.roundParams.sendPolicePossible
	if (sendPolicePossible)
		options.push({
			type: "sendPolicePossible",
			title: "Hire Police",
			description:
				"You agree on a rule that no chopper should chopp more than 2 trees in a decade. To enforce this rule you are able to hire the police for 1 tree. The police then checks if anyone violates the rule in this decade and fines this person with a penalty of 3 trees. The fines go to the government and NOT to the players.",
		})

	const sayTreesPossible = game.roundParams.decadeResultsHidden && !game.roundParams.sayNumberOfTrees
	const payToSeePossible = game.roundParams.decadeResultsHidden && !game.roundParams.payToSeeDecadeResult
	if (sayTreesPossible)
		options.push({
			type: "sayNumberOfTrees",
			title: "Tell your work",
			description:
				"You agree on telling each other how many trees you chopped each round. You believe in your moral to tell the correct amount after every decade but who knows if you are honest.",
		})

	if (payToSeePossible)
		options.push({
			type: "payToSeeDecadeResult",
			title: "Pay to see results",
			description:
				"You have the possibility to send an inspector to see how many trees the others chopped this decade without them knowing it. However, the inspector costs 1 tree per decade you use his service.",
		})

	if (hideResultsPossible) options.push(hideResults)
	if (stealTreesPossible) options.push(stealTrees)

	return [options[0], options[1]]
}
