//----------------------------------------
// God.ts
// Objet représentant un dieu : coût, séquence d’effets et logique d’activation côté serveur en coordination avec GameManager/Player.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import EffectSequence, { EffectSequenceFactory } from "./EffectSequence"
import Player from "./Player"
import { GodData, GodState, ANIM_NAME } from '@common/types'
import GameManager from "./GameManager"
import type Game from "./Game";

export default class God {

    protected static animationsOn: boolean = false;

    private id: number
    private cost: number
    private effectSequence: EffectSequence
    private name: String
    private usable: boolean

    public constructor(data: GodData) {
        this.id = data.id
        this.cost = data.cost
        this.effectSequence = EffectSequenceFactory.create(data.effectSequence)
        this.name = data.name
        this.usable = false
    }

    public static setAnimationsOn(on: boolean): void {
        God.animationsOn = on;
    }

    public getId(): number {
        return this.id
    }

    public getState(): GodState {
        return {
            id: this.id,
            isUsable: this.usable
        }
    }

    public getEffectSequence(): EffectSequence {
        return this.effectSequence
    }

    public getCost(): number {
        return this.cost
    }
    public setUsable(value: boolean): void {
        this.usable = value
    }
    
    public isUsable(): boolean {
        return this.usable
    }

    public use(user: Player): boolean {
        const initialPP: number = user.getPP()
        if (user.getCanSummon() && initialPP >= this.cost) {
            if (this.effectSequence.isUsable(user)) {
                if (God.animationsOn) {
                    const game: Game = GameManager.getInstance().getUserGame(user.getId())
                    game.getAnimationQueue().addAnimation({ 
                        name: ANIM_NAME.GOD, 
                        duration: 400, 
                        target: user.getIndex(), 
                        id: this.id, 
                        power: -this.cost,
                        newValue: initialPP - this.cost
                    })
                }
            }
            user.setPP(initialPP - this.cost)
            if (this.effectSequence.resolve(user)) {
                user.setCanSummon(false)
                return true
            } 
            else {
                user.setPP(initialPP + this.cost)
            }
        }
        return false
    }

}
