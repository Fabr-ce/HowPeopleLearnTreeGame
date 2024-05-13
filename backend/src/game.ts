import questions from "./questions.json"

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

// amount has to be 0!!
const standardDecision: decadeDecision = { amount: 0 }
const standardRoundParam: roundParams = {
	decadeResultsHidden: false,
	sendPolicePossible: false,
	payToSeeDecadeResult: false,
	sayNumberOfTrees: false,
	stealProtectionPayment: false,
	stealTreesPossible: false,
}
const totalDecades = 10
const treePerPerson = 3

const stealCount = 3
const caughtPenalty = 10
const stealSuccessProb = 0.8

const policeChoppLimit = 2
const policePenalty = 3

class Game {
	id: number
	socketRoom: string

	adminId: string | null = null
	players: Map<string, Player> = new Map<string, Player>()

	finishedRound = false
	runningDecade = false
	inRoundRules = false
	playersDecidedThisDecade = 0
	playersQuestionAwnsered = 0
	nextDecade = 0
	treesLeft = 0

	roundParams: roundParams = standardRoundParam
	roundNr: number = -1

	nextQuestionIndex = 0
	currentQuestion?: question
	showQuestionSolution = false

	inDiscussion = false

	constructor(id: number) {
		this.id = id
		this.socketRoom = "G" + id
	}

	startRound(params: roundParams = standardRoundParam) {
		for (const player of this.players.values()) {
			player.startGame(params)
		}
		this.playersDecidedThisDecade = 0
		this.playersQuestionAwnsered = 0
		this.inRoundRules = false
		this.runningDecade = true
		this.treesLeft = treePerPerson * this.players.size

		this.nextDecade = 0

		this.currentQuestion = undefined
		this.showQuestionSolution = false
		this.inDiscussion = false

		this.roundParams = params
		this.roundNr++
	}

	startDecade() {
		if (!this.finishedRound) {
			this.runningDecade = true
			this.playersDecidedThisDecade = 0
			this.playersQuestionAwnsered = 0
		}

		if (this.showQuestionSolution) {
			this.currentQuestion = undefined
			this.showQuestionSolution = false
			this.nextQuestionIndex++
		} else {
			if ([3, 6, 9].includes(this.nextDecade)) {
				this.currentQuestion = questions[this.nextQuestionIndex]
			} else {
				this.currentQuestion = undefined
			}
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

			const playerStealId = player.decisions[this.nextDecade].stealTrees
			if (this.roundParams.stealTreesPossible && playerStealId) {
				const stealable = this.players.get(playerStealId)
				if (!stealable) continue
				if (stealable.decisions[this.nextDecade].stealProtection) continue

				if (Math.random() < stealSuccessProb) {
					const stealValue = Math.min(stealCount, stealable.treeCount)
					stealable.treeCount -= stealValue
					stealable.treesStolen -= stealValue
					stealable.lastStolen = this.nextDecade

					player.treeCount += stealValue
					player.treesStolen += stealValue
					player.lastSuccessfullSteal = this.nextDecade
				} else {
					player.treeCount -= Math.min(player.treeCount, caughtPenalty)
				}
			}
		}
		if (this.roundParams.sendPolicePossible) {
			const allPlayers = Array.from(this.players.values())
			const isPoliceSent = !!allPlayers.find(p => p.decisions[this.nextDecade].sendPolice)
			if (isPoliceSent) {
				const overLimit = allPlayers.filter(p => p.decisions[this.nextDecade].amount > policeChoppLimit)
				for (const player of overLimit) {
					player.lastPoliceFine = this.nextDecade
					player.treeCount -= Math.min(
						player.treeCount,
						policePenalty + player.decisions[this.nextDecade].amount
					)
				}
			}
		}

		this.nextDecade++
		this.finishedRound = this.nextDecade >= totalDecades || this.treesLeft === 0
		if (!this.finishedRound) {
			this.treesLeft *= 2
		}
	}

	getGameState(): gameState {
		const playerInfos: gameState["players"] = Array.from(this.players.values()).map(p => ({
			socketId: p.socketId,
			name: p.name,
			decisions: p.decisions,
			treeCount: p.treeCount,
			questionCount: p.questionsCorrect,
			lastStolen: p.lastStolen,
			lastSuccessfullSteal: p.lastSuccessfullSteal,
			treesStolen: p.treesStolen,
			lastPoliceFine: p.lastPoliceFine,
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
			currentQuestion: this.currentQuestion,
			showQuestionSolution: this.showQuestionSolution,
			inDiscussion: this.inDiscussion,
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

	addQuestionDecision(socketId: string, decision: string) {
		const player = this.players.get(socketId)
		if (!this.currentQuestion || this.showQuestionSolution || !player || !this.runningDecade) return
		this.playersQuestionAwnsered++
		if (decision === this.currentQuestion.solution) {
			player.questionsCorrect++
			player.treeCount++
		}
	}

	checkAllDecided() {
		return this.playersDecidedThisDecade === this.players.size || this.treesLeft === 0
	}

	checkAllQuestionAwnsered() {
		return this.playersQuestionAwnsered === this.players.size
	}

	removePlayer(socketId: string) {
		this.players.delete(socketId)
		if (socketId === this.adminId) {
			this.adminId = Array.from(this.players.values())?.[0]?.socketId ?? null
		}
		return this.players.size === 0
	}
}

export default Game

class Player {
	socketId: string
	name: string

	decisions: decadeDecision[] = []
	treeCount: number = 0
	lastDecision: number = -1
	treesStolen: number = 0
	lastStolen: number = -1
	lastSuccessfullSteal: number = -1
	lastPoliceFine: number = -1

	questionsCorrect: number = 0

	constructor(socketId: string, name: string) {
		this.socketId = socketId
		this.name = name
	}

	startGame(params: roundParams) {
		this.treeCount = 0
		this.decisions = []
		this.lastDecision = -1
		this.questionsCorrect = 0
		this.treesStolen = 0
		this.lastStolen = -1
		this.lastSuccessfullSteal = -1
		this.lastPoliceFine = -1
	}

	decide(decade: number, decision: decadeDecision): boolean {
		if (decade <= this.lastDecision) return false

		this.lastDecision = decade
		this.decisions[decade] = decision
		this.treeCount += decision.amount
		if (decision.stealProtection) this.treeCount--
		if (decision.sendPolice) this.treeCount--
		if (decision.seeDecadeResult) this.treeCount--
		return true
	}

	get lastDecisionValue() {
		return this.decisions[this.lastDecision].amount
	}
}
