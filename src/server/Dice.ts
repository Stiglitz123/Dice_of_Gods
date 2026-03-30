//----------------------------------------
// Dice.ts
// Représente un dé serveur avec faces d’effets, verrouillage/utilisation et résolution des effets sur un Player.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import { getRandomInt } from "./Utils"
import { Attack, Shield, Prayer } from "./Effect"
import EffectSequence from "./EffectSequence"
import type Player from "./Player"
import { Dice as DiceState } from "@common/types"

export default class Dice {

    private static initialized: boolean = false
    private static baseFaces: EffectSequence[]
    private static readonly valueToFace: number[] = [0, 0, 1, 1, 3, 2]

    private value: number = 0
    private locked: boolean = false
    private used: boolean = false
    private faceEffects: EffectSequence[]

    public constructor(skill: EffectSequence) {
        if (!Dice.initialized) {
            Dice.initialize() //Éviter dépendances circulaires
        } 
        this.faceEffects = [...Dice.baseFaces, skill]
    }

    private static initialize(): void {
        Dice.baseFaces = [
            new EffectSequence([new Attack(1)]),
            new EffectSequence([new Attack(1)]),
            new EffectSequence([new Shield(1)]),
            new EffectSequence([new Shield(1)]),
            new EffectSequence([new Prayer(1)]),
        ]
        Dice.initialized = true
    }
    
    public getState(): DiceState {
        return {
            face: this.getFace(),
            isLocked: this.locked,
            isUsed: this.used,
        }
    }

    public getValue(): number {
        return this.value + 1
    }

    public setValue(value: number): void {
        this.value = value - 1
    }

    public setFace(face: number): void {
        this.value = Dice.valueToFace.findIndex(v => v == face)
    }

    public isLocked(): boolean {
        return this.locked
    }

    public setIsLocked(state: boolean): void {
        this.locked = state
    }

    public toggleLock(): boolean {
        this.locked = !this.locked
        return this.locked
    }

    public isUsed(): boolean {
        return this.used
    }

    public setIsUsed(state: boolean): void {
        this.used = state
    }

    public roll(): number {
        this.value = getRandomInt(0,5)
        return this.value
    }

    public resolve(user: Player): void {
        this.faceEffects[this.value]?.resolve(user)
        this.used = true
    }

    public getFace(): number {
        return Dice.valueToFace[this.value] as number
    }

}
