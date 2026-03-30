//----------------------------------------
// EffectSequence.ts
// Implémente les séquences d’effets (normales, conditionnelles, status) et leur résolution via Player/Effect/StatusEffect.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import Effect, {EffectFactory} from "./Effect"
import Player from "./Player"
import StatusEffect from "./StatusEffect"
import { STATUS_EFFECT, EffectSequence as EffectSequenceData, EFFECT_SEQUENCE_TYPE  } from '@common/types'

export default class EffectSequence { 

    private effects: Effect[]

    public constructor(effects: Effect[]) {
        this.effects = effects
    }

    public resolve(user: Player): boolean {
        this.effects.forEach(e => {
            e.resolve(user)
        })
        return true
    }

    public isUsable(user: Player): boolean {
        return true
    }

}

export class StatusEffectSequence extends EffectSequence {

    private status: STATUS_EFFECT
    private statusEffectSequence: EffectSequence

    public constructor(effects: Effect[], status: STATUS_EFFECT, statusEffectSequence: EffectSequence) {
        super(effects)
        this.status = status
        this.statusEffectSequence = statusEffectSequence
    }

    public resolve(user: Player): boolean {
        const opponentStatus: StatusEffect[] = user.getOpponent().getActiveStatusEffect()
        if(opponentStatus.some( (status) => status.getType() == this.status)) {
            return this.statusEffectSequence.resolve(user)
        }
        else {
            return super.resolve(user)
        }
    }

}

export class ConditionalEffectSequence extends EffectSequence {
    
    private condition: Effect

    public constructor(effects: Effect[], condition: Effect) {
        super(effects)
        this.condition = condition
    }

    private isConditionPossible(user: Player): boolean {
        const testPlayer: Player = user.getClone()
        const animationWereOn: boolean = Effect.getAnimationsOn()
        Effect.setAnimationsOn(false)
        this.condition.resolve(testPlayer)
        Effect.setAnimationsOn(animationWereOn)
        return testPlayer.hasValidStats()
    }

    public isUsable(user: Player): boolean {
        return this.isConditionPossible(user)
    }

    public resolve(user: Player): boolean {
        if (this.isConditionPossible(user)) {
            this.condition.resolve(user)
            super.resolve(user)
            return true
        }
        return false
    } 

}

export class EffectSequenceFactory {

    public static create(data: EffectSequenceData): EffectSequence {
        const effects: Effect[] = []
        data.effects.forEach((effect) => {
            effects.push(EffectFactory.create(effect))
        })
        switch (data.type) {
            case EFFECT_SEQUENCE_TYPE.STATUS:
                if (data.status === undefined || !data.statusEffectSequence) {
                    throw new Error("STATUS sequence requires 'status' and 'statusEffectSequence'")
                }
                const statusEffectSequence: EffectSequence = this.create(data.statusEffectSequence)
                return new StatusEffectSequence(
                    effects,
                    data.status,
                    statusEffectSequence,
                )
            case EFFECT_SEQUENCE_TYPE.CONDITIONAL:
                if (!data.condition) {
                    throw new Error("CONDITIONAL sequence requires 'condition'")
                }
                const condition: Effect = EffectFactory.create(data.condition)
                return new ConditionalEffectSequence(effects, condition)
            case EFFECT_SEQUENCE_TYPE.NORMAL:
                return new EffectSequence(effects)
            default:
                throw new Error(`Unknown effect type: ${data.type}`)
        }
    }
    
}
