//----------------------------------------
// AnimationQueue.ts
// Gère la file d’animations serveur pour une partie, enchaîne l’émission vers les clients et synchronise l’état de jeu via GameManager.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import type Game from "./Game"
import GameManager from "./GameManager"
import { Animation, SOCKET_EVENT } from '@common/types'

class AnimationQueue {

  private queue: Animation[] = []
  private gameId: string
  private isReady: boolean = true
  private onEmptyCallbacks: Array<() => void> = []

  constructor(gameId: string) {
    this.gameId = gameId
  }

  private emitAnimation(animation: Animation): void {
    GameManager.getInstance().emitToGameRoom(this.gameId, SOCKET_EVENT.ANIMATION, animation)
  }

  public addAnimation(animation: Animation): void {
    this.queue.push(animation)
    this.play()
  }

  public onEmpty(callback: () => void): void {
    if (this.isEmpty()) {
      setImmediate(callback)
    } 
    else {
      this.onEmptyCallbacks.push(callback)
    }
  }

  public play(): void {
    if (this.isReady) {
      const animation: Animation | undefined = this.queue.shift()
      if (animation) {
        this.isReady = false
        this.emitAnimation(animation)
        setTimeout(() => this.end(), animation.duration ?? 0)
      }
    }
  }

  private end(): void {
    this.isReady = true
    if (this.queue.length > 0) {
      this.play()
    } 
    else {
      while (this.onEmptyCallbacks.length > 0) {
        const callback: (() => void) | undefined = this.onEmptyCallbacks.shift()
        callback?.()
      }
      const game: Game | undefined = GameManager.getInstance().getGame(this.gameId)
      if (game) {
        if (!game?.getTimer().isPlaying()) { 
          game.setGameTimer(game.getActivePlayer().getTimeLeft())
        }
        game.emitGameState()
      }
    }
  }

  public clear(): void {
    this.queue = []
    this.onEmptyCallbacks = []
    this.isReady = true
  }

  public isEmpty(): boolean {
    return this.queue.length == 0 && this.isReady
  }

}

export default AnimationQueue
