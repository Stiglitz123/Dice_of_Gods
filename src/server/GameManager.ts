//----------------------------------------
// GameManager.ts
// Singleton serveur orchestrant sockets, gestion utilisateurs/parties, matchmaking, commandes et diffusion des données de jeu.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import { createServer, Server as HttpServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import Player from './Player'
import Game from "./Game"
import User from "./User"
import Command, { CommandFactory, CommandPayload } from './Command'
import { Command as CommandData, User as UserData, GameValues, SOCKET_EVENT, RegisterData } from '@common/types'
import { UserDao } from './dao/UserDao'
import { GameDao } from './dao/GameDao'
import ARTIFACTS_DATA from './gameData/artifacts'
import RELIGION_DATA from './gameData/religion'
import { registerDataToUser, calculateNewRating } from './Utils'
import Effect from './Effect'
import God from './God'
import MatchmakingQueue from './MatchmakingQueue'
import { DICE_DATA } from './gameData/dice'
import Artifact from './Artifact'

export default class GameManager{

  private static instance: GameManager
  private server: SocketIOServer
  private onlineUsers: Map<string, User> //userId -> User
  private activeGames: Map<string, Game> //userId -> Game
  private userIdToSocket: Map <string, Socket> //userId -> Socket
  private logoutFlag: Map<string, NodeJS.Timeout> //userId -> Timeout
  private matchQueue: MatchmakingQueue

  private constructor() {
    this.server = this.startServer()
    this.onlineUsers = new Map<string, User>() 
    this.activeGames = new Map<string, Game>()
    this.userIdToSocket = new Map<string, Socket>()
    this.logoutFlag = new Map<string, NodeJS.Timeout>()
    this.matchQueue = new MatchmakingQueue()
    Artifact.setAnimationsOn(true);
    Effect.setAnimationsOn(true);
    God.setAnimationsOn(true);
    Player.setAnimationsOn(true)

    this.server.on(SOCKET_EVENT.CONNECTION, async (socket: Socket) => {
      const userId: string = socket.handshake.auth.userId as string
      this.sendGameValues(socket)
      const user: User | undefined = await this.loginUser(userId, socket)
      if(user) {
        socket.on(SOCKET_EVENT.COMMAND, (data: CommandData) => { this.handleNewCommand(user, data)})
        socket.on(SOCKET_EVENT.DISCONNECT, () => { this.disconnectUser(userId) })
      }
      else {
        this.connectionError(socket)
      }
    })
  }
  
  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager()
    }
    return GameManager.instance
  }

  private startServer(): SocketIOServer {
    const server: HttpServer = createServer();
    const io: SocketIOServer = new SocketIOServer(server, {
      path: "/socket/",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      }
    });

    // server.listen(3000, '0.0.0.0', () => console.log('Server started')) pour test local
    server.listen(3000, '127.0.0.1', () => console.log('Server started'))
    return io
  }

  private async loginUser(userId: string, socket: Socket): Promise<User | undefined> {
    if (!userId)  { 
      return undefined
    }
    let userData: UserData | undefined = await UserDao.getUser(userId)
    if (!userData) {
      socket.emit(SOCKET_EVENT.REGISTER, true)
      userData = await this.registerUser(userId, socket)
    }
    return userData ? this.connectUser(userData, socket) : undefined
  }

  private connectUser(userData: UserData, socket: Socket): User {
    const user: User = this.onlineUsers.get(userData.id) ?? new User(userData)
    this.onlineUsers.set(userData.id, user)
    this.userIdToSocket.set(userData.id, socket)
    setTimeout(() => {
      socket.emit(SOCKET_EVENT.USER_INFO, user.getState())
      if (this.userIsInGame(userData.id)) {
        this.reconnectUserToGame(userData.id)
      }
    }, 300)
    console.log('User: ', user.getName(), " id: ", userData.id, ' Connecté')
    return user
  }

  private disconnectUser(userId: string): void {
    this.userIdToSocket.delete(userId)
    console.log('Client déconnecté, ID : ', userId)
    if (this.userIsInGame(userId)) {
      this.addLogoutFlag(userId)
    }
    else {
      this.onlineUsers.delete(userId)
    }
  }

  private async registerUser(userId: string, socket: Socket): Promise<UserData | undefined> {
    const registerData: RegisterData = await new Promise<RegisterData>((resolve) => {
      socket.once(SOCKET_EVENT.REGISTER, (data) => resolve(data));
    });
    if (!registerData) { 
      return undefined
    }
    try {
      const userData: UserData = registerDataToUser(userId, registerData)
      return await UserDao.newUser(userData)
    }
    catch {
      socket.emit(SOCKET_EVENT.ERROR, 'Pseudonyme indisponible')
      return await this.registerUser(userId, socket)
    }
  }

  private connectionError(socket: Socket): void {
    socket.emit('error', { message: 'Missing userId. Connection refused.' })
    socket.disconnect(true)
  }

  private addLogoutFlag(userId: string): void {
    const timer: NodeJS.Timeout = setTimeout(() =>  {
      const game: Game = this.activeGames.get(userId) as Game
      const winner: Player = game.getPlayerById(userId)?.getOpponent() as Player
      this.closeGame(game, winner)
      this.logoutFlag.delete(userId)
      this.onlineUsers.delete(userId)
    }, 60000)
    this.logoutFlag.set(userId, timer)
  }

  private clearLogoutFlag(userId: string): void {
      if (this.logoutFlag.has(userId)) {
        clearTimeout(this.logoutFlag.get(userId))
        this.logoutFlag.delete(userId)
      }
  }

  private sendGameValues(socket: Socket): void {
    const gameValues: GameValues = {
      artifacts: ARTIFACTS_DATA,
      religions: RELIGION_DATA,
      dice: DICE_DATA,
    }
    setTimeout(() => {
      socket.emit(SOCKET_EVENT.GAME_VALUES, gameValues)
    }, 1000)
  }

  private reconnectUserToGame(userId: string): void {
    this.clearLogoutFlag(userId)
    const game: Game = this.activeGames.get(userId) as Game
    const socket: Socket = this.userIdToSocket.get(userId) as Socket
    socket.join(game.getId())
    socket.emit(SOCKET_EVENT.GAME_READY, game.getGameState())
  }

  public async closeGame(game: Game, winner: Player): Promise<void> {
    this.emitToGameRoom(game.getId(), SOCKET_EVENT.GAME_STATE, game.getGameState())
    let ratings: Map<string, number> = new Map<string, number>()
    const updatePromises: Promise<any>[] = [];
    let thisGameIsAI: boolean = false;
    game.getPlayers().forEach((player) => {
      const user: User = player.getUser();
      const opponentUser: User = player.getOpponent().getUser();
      this.activeGames.delete(player.getId())
      user.setIsInGame(false)
      if (!user.isAI() && !opponentUser.isAI()) {
        const newRating: number = calculateNewRating(user.getTrophy(), opponentUser.getTrophy(), user.getId() == winner.getId())
        ratings.set(user.getId(), newRating)
        updatePromises.push(UserDao.updateUserTrophy(user.getId(), newRating))
      } 
      else {
        thisGameIsAI = true;
      }
    })
    if (!thisGameIsAI) {
      game.getPlayers().forEach((player) => {
        const oldRating: number = player.getUser().getTrophy()
        const newRating: number | undefined = ratings.get(player.getUser().getId())
        this.getUserSocket(player.getId())?.emit(SOCKET_EVENT.GAME_ENDED, {winnerId: winner.getIndex(), ratingChange: newRating ? newRating-oldRating : 0})
        player.getUser().setTrophy(newRating ?? oldRating)
        this.getUserSocket(player.getUser().getId())?.emit(SOCKET_EVENT.USER_INFO, player.getUser().getState())
      })
      await GameDao.addGame(game)
    } 
    else {
      this.emitToGameRoom(game.getId(), SOCKET_EVENT.GAME_ENDED, {winnerId: winner.getIndex(), ratingChange: 0})
    }
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises)
    }
    game.cleanUpBeforeClosing()
  }

  public addActiveGame(game: Game): void {
    game.getPlayers().forEach((player) => {
      this.activeGames.set(player.getId(), game)
      player.getUser().setIsInGame(true)
    })
  }

  public async handleNewCommand(user: User, data: CommandData) {
    const command: Command | undefined = CommandFactory.create(data, user)
    const userSocket: Socket | undefined = this.getUserSocket(user.getId())
    if (command) {
      const result: CommandPayload = await command.execute()
      if (user.isInGame()) {
        const game: Game = this.getUserGame(user.getId())
        this.server.to(game.getId()).emit(result.event, result.data)
      }
      else {
        if(userSocket) {
          userSocket.emit(result.event, result.data)
        }
      }
    }
    else {
      userSocket?.emit(SOCKET_EVENT.ERROR, `Command ${data.name} is not a valid`)
    }
  }

  public userIsInGame(userId: string) : boolean {
    return this.activeGames.has(userId)
  }
  
  public getUserGame(userId: string): Game {
    return this.activeGames.get(userId) as Game
  }

  public getUserSocket(userId: string): Socket | undefined {
    return this.userIdToSocket.get(userId) ?? undefined
  }

  public getMatchQueue(): MatchmakingQueue {
    return this.matchQueue
  }

  public emitToGameRoom(gameId: string, event: SOCKET_EVENT, data?: any ) {
    this.server.to(gameId).emit(event, data)
  }

  public leaveQueue(user: User): void {
    this.matchQueue.remove(user)
  }

  public getGame(gameId: string): Game | undefined {
    for (const game of this.activeGames.values()) {
      if (game.getId() === gameId) {
        return game
      }
    }
    return undefined
  }

}
