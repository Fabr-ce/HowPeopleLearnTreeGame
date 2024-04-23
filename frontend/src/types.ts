export type roundParams = {
	decadeResultsHidden: boolean
}
export type decadeDecision = { amount: number }
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
	}[]
	currentQuestion?: question
	showQuestionSolution: boolean
}
