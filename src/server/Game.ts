//----------------------------------------
// Game.ts
// Orchestration d’une partie : phases, joueurs, timers et file d’animations, en interaction avec GameManager et Player.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import { EventEmitter } from "stream"
import GameManager from "./GameManager"
import Player from "./Player"
import User from "./User"
import { GameState, Player as PlayerState, COMMAND_NAME, SOCKET_EVENT, ANIM_NAME} from '@common/types'
import AnimationQueue from "./AnimationQueue"

export default class Game {

    private id: string
    private players: Player[] = []
    private round: number = 0
    private activePlayerIndex: number = 0
    private gameTimer: GameTimer
    private phase: Phase
    private animationQueue: AnimationQueue
    private animating: boolean = false
    private nextPhaseTimeout: NodeJS.Timeout | undefined
    private firstTurn: boolean = true

    public constructor(users: User[]) {
        this.id = this.generateGameId(users)
        users.forEach((user: User, index: number) => {
            this.players.push(new Player(user, index))
        })
        this.setPlayersOpponent()
        this.animationQueue = new AnimationQueue(this.id)
        this.gameTimer = new GameTimer(0)
        this.gameTimer.on('timerUpdate', (remaining: number) => {this.onTimerUpdate(remaining)})
        this.phase = new SetupPhase(this)
        this.phase.enter()
    }

    public generateGameId(users: User[]): string {
        let id: string = ''
        users.forEach((user) => {
            id += user.getId() + "_"
        })
        id += new Date().toISOString()
        if (users[0]?.isAI() || users[1]?.isAI()){
            id += "Training_"
        }
        return id
    }

    public cleanUpBeforeClosing(): void {
        this.gameTimer.stop()
        this.gameTimer.removeAllListeners('done')
        this.gameTimer.removeAllListeners('timerUpdate')
        this.animationQueue.clear()
    }

    public setPlayersOpponent(): void {
        this.players[0]?.setOpponent(this.players[1] as Player)
        this.players[1]?.setOpponent(this.players[0] as Player)
    }

    public isOver(): boolean {
        return this.players.some((player: Player) => {
            return player.getHp() <= 0
        })
    }
    
    public getWinnerPlayer(): Player | undefined {
        const loser: Player | undefined = this.players.find(p => p.getHp() <= 0)
        return loser ? loser.getOpponent() : undefined
    }

    public getId(): string {
        return this.id
    }

    public getPlayers(): Player[] {
        return this.players
    }      
    public getPlayersId(): string[] {
        let ids: string[] = []
        this.players.forEach((player) => {
            ids.push(player.getId())
        })
        return ids
    }   

    public getPlayerById(userId: string): Player | undefined {
        return this.players.find(player => player.getId() === userId)
    }

    public getTimer(): GameTimer {
        return this.gameTimer
    }

    public getActivePlayerIndex(): number {
        return this.activePlayerIndex
    }

    public getActivePlayer(): Player {
        return this.players[this.activePlayerIndex] as Player
    }

    public setActivePlayer(nb: number) {
        this.activePlayerIndex = nb
    }

    public getPhaseName(): string {
        return this.phase.getName()
    }

    public setGameTimer(time: number): void {
        this.gameTimer.setDuration(time)
        this.gameTimer.start()
    }

    public stopGameTimer(removeListeners: boolean): void {
        this.gameTimer.stop()
        if (removeListeners) {
            this.gameTimer.removeListeners()
        }
    }

    public getAnimationQueue(): AnimationQueue {
        return this.animationQueue
    }

    public isAnimating(): boolean {
        return this.animating
    }

    public newRound(): void {
        this.activePlayerIndex = this.round % this.players.length
        this.round += 1
    }
    
    public getRound(): number {
        return this.round  
    }

    public getPhase(): Phase {
        return this.phase
    }

    public setPhase(phase: Phase): void {
        this.phase = phase
    }

    public getGameState(): GameState {
        const players: PlayerState[] = []
        this.players.forEach((player: Player) => {
            players.push(player.getState())
        })
        const gs: GameState = {
            round: this.round,
            phase: this.phase.getName(),
            activePlayer: this.activePlayerIndex,
            players: players,
        }
        return gs
    }

    public emitGameState(): void {
        const gameState: GameState = this.getGameState()
        GameManager.getInstance().emitToGameRoom(this.id, SOCKET_EVENT.GAME_STATE, gameState)
    }

    public toggleActivePlayer(): void {
        if (this.getActivePlayer().getTimeLeft() > 0) {
            this.getActivePlayer().setTimeLeft(this.gameTimer.getRemainingSec())
        }
        this.getTimer().stop()
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length
        if (this.animationQueue.isEmpty()) {
            this.emitGameState()
        }
    }

    public checkForNextAction(toggleActivePlayer: boolean = true): void {
        if (toggleActivePlayer) {
            this.toggleActivePlayer()
        }
        if (!this.animationQueue.isEmpty()) {
            this.animating = true
            this.animationQueue.onEmpty(() => {
                this.animating = false
                this.checkForNextAction(false)
            })
            return
        }
        if (this.allPlayersDone()) {
            this.requestPhaseAdvance(this.phase, 250)
        }
        else {
            const activePlayer: Player = this.getActivePlayer()
            if (!activePlayer.hasRemainingAction(this.phase.getName())) {
                setImmediate(() => this.checkForNextAction())
            }
            else if (activePlayer.getUser().isAI()) {
                setTimeout(() => this.playAITurn(activePlayer), 2000)
            }
            else if (activePlayer.getTimeLeft() <= 0) {
                this.playAutomaticTurn()
            }
            else {
               this.setGameTimer(activePlayer.getTimeLeft())
            } 
        }
    }

    public playAITurn(ai: Player): void {
        const godId: number = ai.getLastAvailabeGodId();
        const artifactId: number = ai.getLastAvailabeArtifactId();
        if (godId !== -1) {
            setImmediate(() => GameManager.getInstance().handleNewCommand(ai.getUser(),{ name: COMMAND_NAME.GOD, args:{id: godId }}))
        } 
        else if (artifactId !== -1) {
            setImmediate(() => GameManager.getInstance().handleNewCommand(ai.getUser(),{ name: COMMAND_NAME.ARTIFACT, args:{id: artifactId }}))
        } 
        else {
            const diceId: number = ai.getFirstAvailabeDiceId();
            if (diceId != -1) {
                setImmediate(() => GameManager.getInstance().handleNewCommand(ai.getUser(),{ name: COMMAND_NAME.DICE, args:{id: diceId }}))
            } 
            else {
                this.checkForNextAction()
            }
        }
    }
    
    public playAIRoll(ai: Player): void {
        let nbActivableArtifact: number = 0
        for (let i: number = 0; i < 4; i++) {
            if (ai.getArtifact(i).isUsable()) {
                nbActivableArtifact++
            }
        }
        const nbReroll: number = ai.getRerollCount()
        console.log("arti: ", nbActivableArtifact, " rr: ", nbReroll)
        if (nbActivableArtifact < nbReroll) {
            setImmediate(() => GameManager.getInstance().handleNewCommand(ai.getUser(),{ name: COMMAND_NAME.ROLL, args:{}}))
            if (nbReroll > 1) {
                setTimeout(() => this.playAIRoll(ai), 2000)
            }
        }
        else {
            setImmediate(() => GameManager.getInstance().handleNewCommand(ai.getUser(),{ name: COMMAND_NAME.END, args:{}}))
        }
    }

    public playAutomaticTurn(): void {
        const activePlayer: Player = this.getActivePlayer();
        const diceId: number = activePlayer.getFirstAvailabeDiceId();
        if (diceId != -1) {
            setImmediate(() => GameManager.getInstance().handleNewCommand(activePlayer.getUser(),{ name: COMMAND_NAME.DICE, args:{id: diceId }}))
        }
    }

    public allPlayersDone(): boolean {
        return this.players.every(p => !p.hasRemainingAction(this.phase.getName()));
    }

    public requestPhaseAdvance(phase: Phase, delayMs: number = 0): void {
        if (this.phase !== phase) {
            return
        }
        if (this.nextPhaseTimeout) {
            clearTimeout(this.nextPhaseTimeout)
            this.nextPhaseTimeout = undefined
        }
        const advance = () => {
            this.nextPhaseTimeout = undefined
            if (this.phase !== phase) {
                return
            }
            this.setPhase(this.phase.getNextPhase())
            this.stopGameTimer(true)
            this.phase.enter()
        }
        if (delayMs > 0) {
            this.nextPhaseTimeout = setTimeout(advance, delayMs)
        } 
        else {
            advance()
        }
    }

    private onTimerUpdate(remaining: number): void {
        GameManager.getInstance().emitToGameRoom(this.id, SOCKET_EVENT.TIMER_UPDATE, remaining)
    }

    public isFirstTurn(): boolean {
        const returnValue: boolean = this.firstTurn
        this.firstTurn = false
        return returnValue
    }

}

class GameTimer extends EventEmitter {
    
    private timer?: NodeJS.Timeout
    private interval?: NodeJS.Timeout
    private startTime: number = 0
    private duration: number
    private playing: boolean = false

    constructor(duration: number) {
      super()
      this.duration = duration
    }

    public start(): void {
        this.stop()
        this.playing = true;
        this.startTime = Date.now()
        this.timer = setTimeout(() => this.emit('done'), this.duration)
        this.interval = setInterval(() => {
          this.emit(SOCKET_EVENT.TIMER_UPDATE, this.getRemainingSec())
        }, 1000)
    }

    public getRemainingSec(): number {
      return Math.floor((this.duration - (Date.now() - this.startTime)) / 1000)
    }

    public stop(): void {
        this.playing = false;
        clearTimeout(this.timer)
        clearTimeout(this.interval)
    }

    public isPlaying(): boolean {
        return this.playing
    }

    public removeListeners(): void {
        this.removeAllListeners('done')
    }

    public setDuration(duration: number): void {
        this.duration = duration * 1000
    }

    public emitZero(): void {
        this.emit(SOCKET_EVENT.TIMER_UPDATE, 0)
    }
}

abstract class Phase {
    
    protected legalCommands: Set<string>
    protected game: Game

    constructor(game: Game) {
        this.legalCommands = new Set<string>
        this.game = game
        this.legalCommands.add("EndPhase")
        this.legalCommands.add("Forfeit")
    }

    public isLegalCommand(commandName: string): boolean {
        return this.legalCommands?.has(commandName) as boolean
    }

    public enter(): void {
        this.onEnter()
    }

    protected onEnter(): void {
        this.game.getTimer().on('done', () => {
            this.timerDone()
        })
        this.game.emitGameState()
    }

    public goToNextPhase(): void {
        this.game.requestPhaseAdvance(this, 250)
    }

    public abstract getName(): string 

    public abstract timerDone(): void

    public abstract getNextPhase(): Phase

    public abstract endActivePlayerPhase(player: Player): void

}

class SetupPhase extends Phase {

    constructor(game: Game) {
        super(game)
    }

    protected onEnter(): void {
        this.game.newRound()
        super.onEnter()
        this.game.getPlayers().forEach((player: Player) => {
            player.setupTurn()
        })
        if (this.game.isFirstTurn()) {
            this.game.getPlayers().forEach((player: Player, i: number) => {
                player.setPP(0)
                player.updatePlayerState()
                if (i == 1) {
                    player.setEnchantedDice(1)
                }
            })
            setTimeout (() => this.checkAnimationQueueForNextPhase(), 2000)
        } 
        else {
            this.game.getPlayers().forEach((player: Player, i: number) => {
                const initialPP: number = player.getPP()
                player.gainPrayerPower(1)
                player.updatePlayerState()                
                const newPP: number = player.getPP()
                this.game.getAnimationQueue().addAnimation({
                    name: ANIM_NAME.PRAYER, 
                    duration: i * 1000, 
                    target: player.getIndex(),
                    power: newPP - initialPP,
                    newValue: newPP
                })
            })
            this.checkAnimationQueueForNextPhase()
        }
    }

    public getNextPhase(): Phase {
        return new RollPhase(this.game)
    }

    public getName(): string {
        return SetupPhase.name
    }
    public timerDone(): void {
        //do nothing
    }
    public endActivePlayerPhase(player: Player): void {
        //do nothing
    }

    private checkAnimationQueueForNextPhase(): void {
        if (this.game.getAnimationQueue().isEmpty()) {
            this.goToNextPhase()
        }
        else {
            setTimeout(() => this.checkAnimationQueueForNextPhase(), 1000)
        }
    }

}

class RollPhase extends Phase {

    private static PHASE_TIME = 45

    constructor(game: Game) {
        super(game)
        this.legalCommands.add("Roll")
        this.legalCommands.add("Lock")
    }

    protected onEnter(): void {
        super.onEnter()
        this.game.getPlayers().forEach((player, i) => {
            player.rollDice(Boolean(i))
        })
        this.game.setGameTimer(RollPhase.PHASE_TIME)

        if (this.game.getId().includes("Training_")) {
            let ai: Player
            this.game.getPlayers().forEach((player) => {
                if (player.getUser().isAI()) {
                    ai = player
                }
            })
            setTimeout(() => this.game.playAIRoll(ai!), 4000)
        }
    }

    public getName(): string {
        return RollPhase.name
    }

    public getNextPhase(): Phase {
        return new ActionPhase(this.game)
    }

    public timerDone(): void {
        this.goToNextPhase()
    }

    public endActivePlayerPhase(player: Player): void {
        player.setRerollCount(0)
        this.game.getAnimationQueue().addAnimation({
            name: ANIM_NAME.CHANGE_REROLL, 
            duration: 1000, 
            target: player.getIndex(),
            power: 0,
            newValue: 0
        })
        if (this.game.allPlayersDone()) {
            this.goToNextPhase()
        }
    }

}

class ActionPhase extends Phase {

    private static PHASE_TIME = 60

    constructor(game: Game) {
        super(game)
        this.legalCommands.add("UseDice")
        this.legalCommands.add("UseArtifact")
        this.legalCommands.add("UseGod")
        this.legalCommands.add('EnchantDice')
    }

    protected onEnter(): void { 
        this.game.getPlayers().forEach((player) => {
            player.resetAllDice()
            player.setTimeLeft(ActionPhase.PHASE_TIME)
            player.setUsableGods()
        })
        super.onEnter()
        this.game.checkForNextAction(false)  
    }

    public getNextPhase(): Phase {
        return new SetupPhase(this.game)
    }

    public getName(): string {
        return ActionPhase.name
    }

    public timerDone(): void {
        this.game.getTimer().emitZero()
        this.game.stopGameTimer(false)
        const player: Player = this.game.getActivePlayer()
        player.setTimeLeft(0)
        player.setCanSummon(false)
        player.updatePlayerState()
        this.game.checkForNextAction(false)
    }

    public endActivePlayerPhase(player: Player): void {
        const activePlayer: Player = this.game.getActivePlayer()
        if (player === activePlayer) {
            if (activePlayer.getTimeLeft() >= 0) {
                activePlayer.setTimeLeft(0)
                this.timerDone()
            }
        }
    }

}
