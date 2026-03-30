//----------------------------------------
// StatusEffect.ts
// Modélise les effets de statut (frost, poison, etc.), leur durée et résolution via EffectSequence appliquée à un Player.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import Effect, {Cooldown, Heal, Reroll, Bless, Burn, Attack} from "./Effect"
import EffectSequence from "./EffectSequence"
import Player from "./Player"
import { STATUS_EFFECT, StatusEffect as StatusEffectState } from "@common/types"

export default abstract class StatusEffect {

    private remainingTurn: number = 3
    private type: STATUS_EFFECT
    private effects: EffectSequence

    public constructor(type: STATUS_EFFECT, effect: Effect) {
        this.type =type
        this.effects =  new EffectSequence([effect])
    }

    public getType(): STATUS_EFFECT {
        return this.type
    }

    public getRemainingTurn(): number {
        return this.remainingTurn
    }

    public setRemainingTurn(value: number): void {
        this.remainingTurn = value
    }
    
    public resolve(user: Player): boolean {
        if (this.remainingTurn > 0) {
            this.remainingTurn--
            this.effects.resolve(user)
        }
        return this.remainingTurn > 0
    }

    public getState(): StatusEffectState {
        return {
            type: this.type,
            remainingTurn: this.remainingTurn,
        }
    }

}

export class FrostStatusEffect extends StatusEffect {

    public constructor() {
        super(STATUS_EFFECT.FROST, new Cooldown(-1))
    }

}
export class PoisonStatusEffect extends StatusEffect {

    public constructor() {
        super(STATUS_EFFECT.POISON, new Heal(-1))
    }

}
export class BlindStatusEffect extends StatusEffect {

    public constructor() {
        super(STATUS_EFFECT.BLIND, new Reroll(-1))
    }

}
export class FireStatusEffect extends StatusEffect {

    public constructor() {
        super(STATUS_EFFECT.FIRE, new Burn(2))
    }

}
export class BlessStatusEffect extends StatusEffect {

    public constructor() {
        super(STATUS_EFFECT.BLESS, new Bless(1))
    }

}
export class WindStatusEffect extends StatusEffect {

    public constructor() {
        //To be implemented
        // super(STATUS_EFFECT.WIND, new Wind(1))
        super(STATUS_EFFECT.BLIND, new Attack(0))// placeholder
    }
    
}
