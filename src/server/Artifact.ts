//----------------------------------------
// Artifact.ts
// Représente un artefact serveur : coûts en dés, séquence d’effets, cooldown et application sur un Player avec animations.
// [Auteur : Hugo Beaulieu]
//----------------------------------------
import Dice from "./Dice"
import EffectSequence, { EffectSequenceFactory } from "./EffectSequence"
import Player from "./Player"
import { ArtifactData, ArtifactState, ANIM_NAME } from '@common/types'
import type Game from "./Game"

import GameManager from "./GameManager"

export default class Artifact {

    private id: number
    private religionId: number
    private name: String
    private diceCost: number[]
    private effectSequence: EffectSequence
    private countdown: number
    private cooldown: number
    private usable: boolean
    
    protected static animationsOn: boolean = false;

    public constructor(data: ArtifactData) {
        this.id = data.id
        this.religionId = data.religion
        this.name = data.name
        this.diceCost = data.diceCost
        this.effectSequence = EffectSequenceFactory.create(data.effectSequence)
        this.countdown = 0
        this.cooldown = data.cooldown
        this.usable = false
    }

    public static getAnimationsOn(): boolean {
        return Artifact.animationsOn
    }

    public static setAnimationsOn(on: boolean): void {
        Artifact.animationsOn = on;
    }

    public getState(): ArtifactState {
        return {
            id: this.id,
            countdown: this.countdown,
            isUsable: this.usable,
        }
    }

    public getId(): number {
        return this.id
    }

    public getCountdown(): number {
        return this.countdown
    }

    public getCooldown(): number {
        return this.cooldown
    }

    public addCountdown(value: number = 1): void {
        this.countdown += value
    }

    public setCountdown(value: number): void {
        this.countdown = value
    }

    public getDiceCost(): number[] {
        return this.diceCost
    }

    public isUsable(): boolean {
        return this.usable
    }

    public setUsable(value: boolean): void { 
        this.usable = value
    }

    public getEffectSequence(): EffectSequence {
        return this.effectSequence
    }

    public use(user: Player): boolean {
        if (this.countdown <= 0) {
            if (this.isUsable()) {
                if (this.effectSequence.isUsable(user)) {
                    if (Artifact.animationsOn) {
                        const game: Game = GameManager.getInstance().getUserGame(user.getId())
                        game.getAnimationQueue().addAnimation({ name: ANIM_NAME.ARTIFACT, duration: 1000, target: user.getIndex(), id: this.id } )
                    } 
                }
                if (this.effectSequence.resolve(user)) {
                    this.diceCost.forEach((face: number) => {
                        for (let i: number = 0; i < user.getAllDice().length; i++) {
                            const dice: Dice = user.getDice(i)
                            if (dice.getFace() == face && dice.isUsed() == false) {
                                dice.setIsUsed(true)
                                break
                            }
                        }
                    })
                    this.setCountdown(this.cooldown)
                    return true
                }
            }
        }
        return false
    }
    
    public reduceCooldown(value: number): void {
        if (this.countdown > 0) {
            this.countdown = Math.max(this.countdown - value, 0)
        }
    }

}
