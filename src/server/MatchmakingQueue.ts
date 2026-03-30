//----------------------------------------
// MatchmakingQueue.ts
// File de matchmaking basée sur une liste chaînée, gère l’ajout/retrait d’utilisateurs et la création de paires selon l’écart de trophées.
// [Auteur : Hugo Beaulieu]
//----------------------------------------
import User from "./User"

class Node<T> {

    private data: T
    private next: Node<T> | null = null

    constructor(value: T) {
        this.data = value
    }

    public hasNext(): boolean {
        return this.next != null
    }

    public getData(): T {
        return this.data
    }

    public getNext(): Node<T> | null {
        return this.next
    }
    public setNext(node: Node<T> | null): void {
        this.next = node
    }

}

export default class MatchmakingQueue {

    private static ECART_TROPHES = 1000 // Cette valeur devrais etre a 100 pour dais raison de banace de jeu, mais est a 1000 pour pouvoir jouer contre tout le monde durant les présentations

    private head: Node<User> | null = null
    private tail: Node<User> | null = null

    public append(user: User): boolean {
        let isInQueue: boolean = false
        for (let node of this) {
            if (node.getData().getId() == user.getId()) {
                isInQueue = true
                break
            }
        }
        if (!isInQueue) {
            const newNode: Node<User> = new Node(user)
            if (!this.head) {
                this.head = this.tail = newNode
            } 
            else {
                this.tail!.setNext(newNode)
                this.tail = newNode
            }
            return true
        }
        return false
    }

    public matchmake(): [User, User] | undefined {
        if (this.head == null) {
            return undefined
        }
        if (this.head == this.tail) {
            return undefined
        }
        let player1: Node<User> = this.head
        let player2: Node<User> | null = null
        while (player1 && player1.hasNext()) {
            player2 = player1.getNext()
            while (player2) {
                if (Math.abs(player1.getData().getTrophy() - player2.getData().getTrophy()) <= MatchmakingQueue.ECART_TROPHES) {
                    player2.getData().setInQueue(false)
                    this.pop(player2)
                    player1.getData().setInQueue(false)
                    this.pop(player1)
                    const rng: number = Math.round(Math.random())
                    return [(rng ? player1 : player2).getData(), (rng ? player2 : player1).getData()]
                }
                player2 = player2.getNext()
            }
            player1 = player1.getNext()!
        }
        return undefined
    }

    private pop(node: Node<User>): number {
        if (this.head == null) {
            return -1
        }
        if (this.head === node) {
            this.head = node.getNext()
            return 0
        }
        let current: Node<User> = this.head
        let index: number = 0
        while (current.hasNext()) {
            if (current.getNext() === node) {
                current.setNext(node.getNext())
                return index + 1
            }
            current = current.getNext()!
            index++
        }
        return -1
    }

    public remove(user: User): number {
        for (let node of this) {
            if (node.getData().getId() == user.getId()) {
                return this.pop(node)
            }
        }
        return -1
    }

    [Symbol.iterator](): Iterator<Node<User>> {
        let current: Node<User> | null = this.head
        return {
            next(): IteratorResult<Node<User>> {
                if (current) {
                    const value: Node<User> = current
                    current = current.getNext()
                    return { value, done: false }
                }
                else {
                    return { value: undefined, done: true }
                }
            }
        }
    }

}
