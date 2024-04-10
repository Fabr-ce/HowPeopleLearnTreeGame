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

// amount has to be 0!!
const standardDecision: decadeDecision = { amount: 0 }
const standardRoundParam: roundParams = { decadeResultsHidden: true }
const totalDecades = 10
const treePerPerson = 3

class Game {
	id: number
	socketRoom: string

	adminId: string | null = null
	players: Map<string, Player> = new Map<string, Player>()

	finishedRound = false
	runningDecade = false
	inRoundRules = false
	playersDecidedThisDecade = 0
	nextDecade = 0
	treesLeft = 0

	roundParams: roundParams = standardRoundParam
	roundNr: number = -1

	constructor(id: number) {
		this.id = id
		this.socketRoom = "G" + id
	}

	startRound(params: roundParams = standardRoundParam) {
		for (const player of this.players.values()) {
			player.startGame(params)
		}
		this.playersDecidedThisDecade = 0
		this.inRoundRules = false
		this.runningDecade = true
		this.treesLeft = treePerPerson * this.players.size

		this.roundParams = params
		this.roundNr++
	}

	startDecade() {
		if (!this.finishedRound) {
			this.runningDecade = true
			this.playersDecidedThisDecade = 0
		}
	}

	finishDecade() {
		// check if it is already finished before
		if (this.runningDecade === false) return

		this.runningDecade = false
		for (const player of this.players.values()) {
			if (player.lastDecision < this.nextDecade) {
				player.decide(this.nextDecade, standardDecision)
				this.treesLeft -= standardDecision.amount
			}
		}
		this.nextDecade++
		this.finishedRound = this.nextDecade >= totalDecades || this.treesLeft === 0
		if (!this.finishedRound) {
			this.treesLeft *= 2
		}
	}

	getGameState(): gameState {
		const playerInfos = Array.from(this.players.values()).map(p => ({
			socketId: p.socketId,
			name: p.name,
			decisions: p.decisions,
			treeCount: p.treeCount,
		}))
		return {
			id: this.id,
			adminId: this.adminId,
			nextDecade: this.nextDecade,
			finishedRound: this.finishedRound,
			runningDecade: this.runningDecade,
			inRoundRules: this.inRoundRules,
			treesLeft: this.treesLeft,
			roundNr: this.roundNr,
			roundParams: this.roundParams,
			players: playerInfos,
		}
	}

	addPlayer(socketId: string, name: string) {
		if (this.players.size == 0) {
			this.adminId = socketId
		}

		const existingPlayer = this.players.get(socketId)
		if (existingPlayer) {
			existingPlayer.name = name
		} else {
			const player = new Player(socketId, name)
			this.players.set(socketId, player)
		}
	}

	addDecadeDecision(socketId: string, decision: decadeDecision) {
		const player = this.players.get(socketId)
		if (!this.runningDecade || !player) return

		if (decision.amount > this.treesLeft) {
			// set it to the maximal possible amount
			decision.amount = this.treesLeft
		}

		const newDecision = player.decide(this.nextDecade, decision)
		if (newDecision) {
			this.playersDecidedThisDecade++
			this.treesLeft -= decision.amount
		}
	}

	checkAllDecided() {
		return this.playersDecidedThisDecade === this.players.size || this.treesLeft === 0
	}

	removePlayer(socketId: string) {
		this.players.delete(socketId)
		if (socketId === this.adminId) {
			this.adminId = Array.from(this.players.values())?.[0]?.socketId ?? null
		}
	}
}

export default Game

class Player {
	socketId: string
	name: string

	decisions: decadeDecision[] = []
	treeCount: number = 0
	lastDecision: number = -1

	constructor(socketId: string, name: string) {
		this.socketId = socketId
		this.name = name
	}

	startGame(params: roundParams) {
		this.treeCount = 0
		this.decisions = []
		this.lastDecision = -1
	}

	decide(decade: number, decision: decadeDecision): boolean {
		if (decade <= this.lastDecision) return false

		this.lastDecision = decade
		this.decisions[decade] = decision
		this.treeCount += decision.amount
		return true
	}

	get lastDecisionValue() {
		return this.decisions[this.lastDecision].amount
	}
}