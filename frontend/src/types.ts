export type roundParams = {
	decadeResultsHidden: boolean
}
export type decadeDecision = { amount: number }
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
	}[]
}
