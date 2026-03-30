//----------------------------------------
// Command.ts
// Fabrique et implémente les commandes (lobby/jeu) reçues via socket, orchestrant matchmaking, actions en phase et transitions de partie.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import type { Socket } from "socket.io"
import Game from "./Game"
import GameManager from "./GameManager"
import Player from "./Player"
import User, {AIUser} from "./User"
import { UserDao } from "./dao/UserDao"
import { COMMAND_NAME, Command as CommandData, CommandArgs, SOCKET_EVENT } from '@common/types'
import MatchmakingQueue from "./MatchmakingQueue"

export interface CommandPayload {
    event: SOCKET_EVENT
    data: any
}

abstract class Command {

    protected user: User
    protected data: CommandArgs

    constructor(user: User, data: CommandData) {
        this.user = user
        this.data = data.args as CommandArgs
    }

    public async execute(): Promise<CommandPayload> {
        return await this.executeCommand()
    }

    protected abstract executeCommand(): Promise<CommandPayload>

}

export class CommandFactory {

    public static create(data: CommandData, user: User): Command | undefined {
        switch (data.name) {
            case COMMAND_NAME.TRAINING:
                return new JoinTraining(user, data)
            case COMMAND_NAME.QUEUE:
                return new JoinQueue(user, data)
            case COMMAND_NAME.LEAVE:
                return new LeaveQueue(user, data)
            case COMMAND_NAME.DUEL:
                return new JoinDuel(user, data)
            case COMMAND_NAME.ROLL:
                return new Roll(user, data)
            case COMMAND_NAME.LOCK:
                return new Lock(user, data)
            case COMMAND_NAME.DICE:
                return new UseDice(user, data)
            case COMMAND_NAME.ARTIFACT:
                return new UseArtifact(user, data)
            case COMMAND_NAME.GOD:
                return new UseGod(user, data)
            case COMMAND_NAME.END:
                return new EndPhase(user, data)
            case COMMAND_NAME.FORFEIT:
                return new Forfeit(user, data)
            case COMMAND_NAME.SWAP_ARTIFACT:
                return new SwapArtifact(user, data)
            case COMMAND_NAME.SWAP_RELIGION:
                return new SwapReligion(user, data)
            case COMMAND_NAME.SWAP_AVATAR:
                return new SwapAvatar(user, data)
            case COMMAND_NAME.ENCHANT:
                return new EnchantDice(user, data)
            case COMMAND_NAME.REQUEST_GAME_STATE:
                return new RequestGameState(user, data)
            default:
                return undefined
        }
    }

}

abstract class GameCommand extends Command {

    protected game: Game
    protected player: Player

    constructor(user: User, data: CommandData) {
        super(user, data)
        const userId: string = user.getId()
        this.game = GameManager.getInstance().getUserGame(userId)
        this.player = this.game.getPlayerById(userId) as Player
    }

    public async execute(): Promise<CommandPayload> {
        const commandName: string = this.constructor.name
        if (!this.user.isInGame()) {
            return { event: SOCKET_EVENT.ERROR, data: 'User not in Game' }
        }
        if (!this.game.getPhase().isLegalCommand(commandName)) {
            return { event: SOCKET_EVENT.GAME_STATE, data: `${commandName} is an Illegal Command`  }
        }
        const result: CommandPayload =  await this.executeCommand()
        if (this.game.isOver()) {
            this.game.getAnimationQueue().onEmpty(() => {
                GameManager.getInstance().closeGame(this.game, this.game.getWinnerPlayer() as Player)
            })
        }
        return result
    }

}

abstract class GameActionCommand extends GameCommand {

    public async execute(): Promise<CommandPayload> {
        const activePlayer: Player = this.game.getActivePlayer()
        if (activePlayer !== this.player) {
            return { event: SOCKET_EVENT.ERROR, data: 'Not your turn ' + this.data.id }
        }
        else if (this.game.isAnimating()) {
            return { event: SOCKET_EVENT.ERROR, data: 'Game is in animation' + this.data.id }
        }
        return super.execute()
    }

}

abstract class LobbyCommand extends Command {
    
    public async execute(): Promise<CommandPayload> {
        const manager: GameManager = GameManager.getInstance()
        const userId: string = this.user.getId()
        if (manager.userIsInGame(userId)) {
            const game: Game = manager.getUserGame(userId)
            manager.getUserSocket(userId)?.emit(SOCKET_EVENT.ERROR, 'User is in a game')
            return { event: SOCKET_EVENT.GAME_READY, data: game.getGameState() }
        }
        else {
            return await this.executeCommand()
        }
    }

}

abstract class MatchmakingCommand extends LobbyCommand {

    protected gameManager: GameManager
    protected userSocket: Socket | undefined

    constructor(user: User, data: CommandData) {
        super(user, data)
        this.gameManager = GameManager.getInstance()
        this.userSocket = this.gameManager.getUserSocket(user.getId())
    }

    public async execute(): Promise<CommandPayload> {
        if(this.userSocket == undefined) {
            return { event: SOCKET_EVENT.ERROR, data: 'User Socket is undefined' }
        }
        return await super.execute()
    }

}

class SwapArtifact extends LobbyCommand {

    public async executeCommand(): Promise<CommandPayload> {
        if (this.data.id != undefined && this.data.newValue != undefined) {
            const oldId: number = this.data.id
            const newId: number = this.data.newValue
            const slot: number = this.user.getArtifacts().findIndex(a => a === oldId)
            const artifacts: number[] = this.user.getArtifacts().map(a => (a === oldId ? newId : a))
            this.user.setArtifacts(artifacts)
            await UserDao.updateUserArtifact(this.user.getId(), slot, newId)

            return { event: SOCKET_EVENT.USER_INFO, data: this.user.getState() }
        }
        else return { event: SOCKET_EVENT.ERROR, data: 'Command Arguments is undefined' }
    }

}

class SwapReligion extends LobbyCommand {

    public async executeCommand(): Promise<CommandPayload> {
        if (this.data.id != undefined) {
            this.user.setReligion(this.data.id)
            await UserDao.updateUserReligion(this.user.getId(), this.data.id)
            return { event: SOCKET_EVENT.USER_INFO, data: this.user.getState() }
        }
        else return { event: SOCKET_EVENT.ERROR, data: 'Command Arguments is undefined' }
    }

}

class SwapAvatar extends LobbyCommand {

    public async executeCommand(): Promise<CommandPayload> {
        if (this.data.id != undefined) {
            this.user.setAvatar(this.data.id)
            await UserDao.updateUserAvatar(this.user.getId(), this.data.id)
            return { event: SOCKET_EVENT.USER_INFO, data: this.user.getState() }
        }
        else return { event: SOCKET_EVENT.ERROR, data: 'Command Arguments is undefined' }
    }

}

class RequestGameState extends GameCommand {

    public async executeCommand(): Promise<CommandPayload> {
        return {event: SOCKET_EVENT.GAME_STATE, data: this.game.getGameState()}
    }

}

class Roll extends GameCommand {

    public async executeCommand(): Promise<CommandPayload> {
        if(!this.player.rollDice()) {
            return {event: SOCKET_EVENT.ERROR, data: `No available Reroll`}
        }
        if (this.game.allPlayersDone()) {
            this.game.getPhase().goToNextPhase()
        }
        return {event: SOCKET_EVENT.COMMAND_ACKNOWLEDGE, data: COMMAND_NAME.ROLL}
    }

}

class Lock extends GameCommand {

    public async executeCommand(): Promise<CommandPayload> {
        this.player.lockToggle(this.data.id as number)
        return {event: SOCKET_EVENT.GAME_STATE, data: this.game.getGameState()}
    }

}

class EnchantDice extends GameCommand {

    public async executeCommand(): Promise<CommandPayload> {
        if(this.player.enchantDice(this.data.id!, this.data.newValue!)) {
            this.player.updatePlayerState()
            return {event: SOCKET_EVENT.GAME_STATE, data: this.game.getGameState()}
        }
        else return {event: SOCKET_EVENT.ERROR, data: `No available enchanted Dice`}
    }

}

class Forfeit extends GameCommand {

    public async executeCommand(): Promise<CommandPayload> {
        if (this.player.getOpponent().getHp() != 0) {
            this.player.setHp(0)
            return {event: SOCKET_EVENT.GAME_STATE, data: this.game.getGameState() }
        }
        else return {event: SOCKET_EVENT.ERROR, data: `Opponent alredy lost`}
    }
    
}

class EndPhase extends GameCommand {

    public async executeCommand(): Promise<CommandPayload> {
        this.game.getPhase().endActivePlayerPhase(this.player)
        return {event: SOCKET_EVENT.GAME_STATE, data: this.game.getGameState()}
    }

}

class UseDice extends GameActionCommand {

    public async executeCommand(): Promise<CommandPayload> {
        const diceId: number = this.data.id as number
        if (this.player.useDice(diceId)) {
            this.player.updatePlayerState(true)
            if (!this.game.isOver()) {
                this.game.checkForNextAction()
            }
            return {event: SOCKET_EVENT.COMMAND_ACKNOWLEDGE, data: COMMAND_NAME.DICE}
        }
        else return {event: SOCKET_EVENT.ERROR, data: `Dice Id: ${diceId} is not valid for UseDiceCommand`}
    } 

}

class UseArtifact extends GameActionCommand {
    
    public async executeCommand(): Promise<CommandPayload> {
        const artifactId: number = this.data.id as number
        if (this.player.useArtifact(artifactId)) {
            this.player.updatePlayerState(true)
            if (!this.game.isOver()) {
                this.game.checkForNextAction()
            }
            this.player.setUsableArtifacts()
            return {event: SOCKET_EVENT.COMMAND_ACKNOWLEDGE, data: COMMAND_NAME.ARTIFACT}
        }
        else return {event: SOCKET_EVENT.ERROR, data: `Artifact Id: ${artifactId} is not valid for UseArtifactCommand`}
    }

}

class UseGod extends GameActionCommand {

    public async executeCommand(): Promise<CommandPayload> {
        const godId: number = this.data.id as number
        if (this.player.useGod(godId)) {
            this.player.updatePlayerState(true)
            if (!this.game.isOver()) {
                this.game.checkForNextAction()
            }
            return {event: SOCKET_EVENT.COMMAND_ACKNOWLEDGE, data: COMMAND_NAME.GOD}
        }
        else return {event: SOCKET_EVENT.ERROR, data: `God Id: ${godId} is not valid for UseGodCommand`}
    }

}

class JoinTraining extends MatchmakingCommand {

    public async executeCommand(): Promise<CommandPayload> {
        const AI: AIUser = new AIUser(this.user.getId())
        const rng: number = Math.round(Math.random())
        const game: Game = new Game([(rng ? this.user : AI), (rng ? AI : this.user)])
        this.gameManager.addActiveGame(game)
        this.userSocket?.join(game.getId())
        return {event: SOCKET_EVENT.GAME_READY, data: game.getGameState()}
    }

}

class JoinQueue extends MatchmakingCommand {

    public async executeCommand(): Promise<CommandPayload> {
        const MQ: MatchmakingQueue = this.gameManager.getMatchQueue()
        if (MQ.append(this.user)) {
            const users: [User, User] | undefined = MQ.matchmake()
            if (users != undefined) {
                users[0].setInQueue(true)
                users[1].setInQueue(true)
                this.gameManager.handleNewCommand(users[0], {name: COMMAND_NAME.DUEL, args: {other: users[1]}})
            }
            return {event: SOCKET_EVENT.QUEUE, data: 'User added to queue'}
        }
        return {event: SOCKET_EVENT.ERROR, data: 'User added to queue'}
    }

}

class LeaveQueue extends MatchmakingCommand {

    public async executeCommand(): Promise<CommandPayload> {
        this.gameManager.leaveQueue(this.user)
        this.user.setInQueue(false)
        return {event: SOCKET_EVENT.EXIT_QUEUE, data: 'User removed from queue'}
    }

}

class JoinDuel extends MatchmakingCommand {

    public async executeCommand(): Promise<CommandPayload> {
        if (!this.data.other) {
            return {event: SOCKET_EVENT.ERROR, data: 'Other user is undefined'}
        }
        const otherUser: User = this.data.other as User
        const game: Game = new Game([this.user, otherUser])
        this.gameManager.addActiveGame(game)
        this.userSocket?.join(game.getId())
        this.gameManager.getUserSocket(otherUser.getId())?.join(game.getId())
        return {event: SOCKET_EVENT.GAME_READY, data: game.getGameState()}
    }
    
}

export default Command
