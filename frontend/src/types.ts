export type roundParams = {
	decadeResultsHidden: boolean
	sendPolicePossible: boolean // send police to check others dont take more than 2 trees
	stealProtectionPayment: boolean // protect yourself from beeing stolen
	sayNumberOfTrees: boolean // say it in the group

	payToSeeDecadeResult: boolean // see the choices of all the players this round

	stealTreesPossible: boolean
}
export type decadeDecision = {
	amount: number
	sendPolice?: boolean
	stealProtection?: boolean
	seeDecadeResult?: boolean
	stealTrees?: string
}

export type question = {
	question: string
	A: string
	B: string
	C: string
	D: string
	solution: string
	explanation?: string
}

export type gameState = {
	id: number
	adminId: string | null
	nextDecade: number
	finishedRound: boolean
	inDiscussion: boolean
	runningDecade: boolean
	inRoundRules: boolean
	treesLeft: number
	roundParams: roundParams
	roundNr: number
	players: {
		socketId: string
		name: string
		decisions: decadeDecision[]
		treeCount: number
		questionCount: number
		treesStolen: number
		lastStolen: number
		lastSuccessfullSteal: number
		lastPoliceFine: number
	}[]
	currentQuestion?: question
	showQuestionSolution: boolean
}
