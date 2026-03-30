//----------------------------------------
// Effect.ts
// Définit les effets de jeu (attaque, bouclier, soin, statut, etc.), leur résolution et la création via EffectFactory avec animations.
// [Auteur : Hugo Beaulieu]
//----------------------------------------
import Player from './Player'
import {clamp, getRandomInt, FYshuffle} from "./Utils"
import { Effect as EffectData, GAME_EFFECT, STATUS_EFFECT, ANIM_NAME } from '@common/types';
import StatusEffect, { FrostStatusEffect, PoisonStatusEffect, BlindStatusEffect, FireStatusEffect, BlessStatusEffect } from './StatusEffect';
import GameManager from "./GameManager"
import type Game from './Game';

export default abstract class Effect {

    protected static animationsOn: boolean = false;

    protected potency: number;

    public constructor(potency: number = 1) {
        this.potency = potency
    }

    public static getAnimationsOn(): boolean {
        return Effect.animationsOn
    }
    public static setAnimationsOn(on: boolean): void {
        Effect.animationsOn = on;
    }
    
    public abstract resolve(user: Player): void

}

export class Attack extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    }

    public resolve(user: Player): void {
        let target: Player = user.getOpponent()
        let dmg: number = this.potency
        if (this.potency < 0) { 
            target = user
            dmg = -this.potency
        }
        const shielded: number = Math.min(target.getShield(), dmg)
        const newShield: number = target.getShield()-shielded
        target.setShield(newShield)
        dmg -= shielded
        const newHp: number = Math.max(target.getHp() - dmg, 0)
        target.setHp(newHp)
        if (Effect.animationsOn) {
            const game: Game = GameManager.getInstance().getUserGame(user.getId())
            if (shielded > 0) {
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.SHIELD_DMG, 
                    duration: dmg > 0 ? 500 : 1000, 
                    target: target.getIndex(), 
                    power: shielded, 
                    newValue: newShield,
                })
            }
            if (dmg > 0) {
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.HP_DMG, 
                    duration: 1000, 
                    target: target.getIndex(), 
                    power: dmg, 
                    newValue: newHp,
                    type: GAME_EFFECT.ATTACK
                })
            }
        }
    }

}

export class Shield extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    }

    public resolve(user: Player): void {
        const initialShield: number = user.getShield()
        const newShield: number = Math.min(initialShield + this.potency, Player.MAX_SHIELD)
        user.setShield(newShield)
        if (Effect.animationsOn) {
            const game: Game = GameManager.getInstance().getUserGame(user.getId())
            game.getAnimationQueue().addAnimation({ 
                name: ANIM_NAME.SHIELD, 
                duration: 1000, 
                target: user.getIndex(), 
                newValue: newShield, 
                power: newShield - initialShield 
            })
        }
    }

}

export class Prayer extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    }

    public resolve(user: Player): void {
        const initialPP: number = user.getPP()
        const newPP: number = Math.min(initialPP+this.potency, Player.MAX_PP)
        user.setPP(newPP)
        if (Effect.animationsOn) {
            const game: Game = GameManager.getInstance().getUserGame(user.getId())
            game.getAnimationQueue().addAnimation({ 
                name: ANIM_NAME.PRAYER, 
                duration: 1000, 
                target: user.getIndex(),
                power: newPP - initialPP,
                newValue: newPP
            })
        }
    }

}

export class Heal extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    }

    public resolve(user: Player): void {
        const initialHP: number = user.getHp()
        const newHP: number = clamp(initialHP + this.potency, 0, Player.MAX_HP)
        user.setHp(newHP)
        if (Effect.animationsOn) {
            const game: Game = GameManager.getInstance().getUserGame(user.getId())
            if (this.potency >= 0) {
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.HEAL, 
                    duration: 1000, 
                    target: user.getIndex(), 
                    power: newHP - initialHP, 
                    newValue: newHP 
                })
            } 
            else {
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.HP_DMG, 
                    duration: 1000, 
                    target: user.getIndex(), 
                    power: Math.abs(newHP - initialHP),
                    newValue: newHP,
                    type: GAME_EFFECT.PIERCE
                })
            }
        }
    }

}

export class Reroll extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    }

    public resolve(user: Player): void {
        const initialRrNb: number  = user.getRerollCount()
        const newRrNb: number  = Math.max(initialRrNb+this.potency, 1)
        user.setRerollCount(newRrNb)
        if (Effect.animationsOn) {
            const game: Game = GameManager.getInstance().getUserGame(user.getId())
            game.getAnimationQueue().addAnimation({ 
                name: ANIM_NAME.CHANGE_REROLL, 
                duration: 1000, 
                target: user.getIndex(),
                power: this.potency,
                newValue: newRrNb,
                type: this.potency < 0 ? GAME_EFFECT.BLIND : GAME_EFFECT.REROLL,
            })
        }
    }

}

export class Pierce extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    }

    public resolve(user: Player): void {
        const target: Player = user.getOpponent()
        const dmg: number = this.potency
        const initialShield: number = target.getShield()
        const newShield: number = Math.max(initialShield-dmg, 0)
        target.setShield(newShield)
        const newHP: number = Math.max(target.getHp()-dmg, 0)
        target.setHp(newHP)
        if (Effect.animationsOn) {
            const game: Game = GameManager.getInstance().getUserGame(user.getId())
            if (initialShield != newShield) {
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.SHIELD_DMG, 
                    duration: 500, 
                    target: target.getIndex(), 
                    newValue: newShield,
                    power: dmg,
                })
            }
            game.getAnimationQueue().addAnimation({ 
                name: ANIM_NAME.HP_DMG, 
                duration: 1000, 
                target: target.getIndex(), 
                power: dmg,
                newValue: newHP,
                type: GAME_EFFECT.PIERCE,
            })
        }
    }

}

export class Cooldown extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    }

    public resolve(user: Player): void {
        if (this.potency > 0) {
            const artifactIdShuffled: number[] = FYshuffle([0, 1, 2, 3])
            for (const i of artifactIdShuffled) {
                if (user.getArtifact(i).getCountdown() > 0) {
                    user.getArtifact(i).reduceCooldown(this.potency)
                    if (Effect.animationsOn) {
                        const game: Game = GameManager.getInstance().getUserGame(user.getId())
                        game.getAnimationQueue().addAnimation({ 
                            name: ANIM_NAME.COOLDOWN, 
                            duration: 1000, 
                            target: user.getIndex(), 
                            newValue: i, 
                            power: this.potency 
                        })
                    }
                    break
                }
            }
        }
        else if (this.potency <= -1) {
            const I: number = getRandomInt(0, 3)
            user.getArtifact(I).addCountdown(Math.abs(this.potency))
            if (Effect.animationsOn) {
                const game: Game = GameManager.getInstance().getUserGame(user.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.COOLDOWN, 
                    duration: 1000, 
                    target: user.getIndex(), 
                    newValue: I, 
                    power: Math.abs(this.potency) 
                })
            }
        }
    }

}

export class Enchant extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    }

    public resolve(user: Player): void {
        const initialED: number = user.getEnchantedDice()
        const newED: number = initialED + this.potency
        user.setEnchantedDice(newED)
        if (Effect.animationsOn) {
            const game: Game = GameManager.getInstance().getUserGame(user.getId())
            game.getAnimationQueue().addAnimation({ 
                name: ANIM_NAME.CHANGE_ENCHANT, 
                duration: 1000, 
                target: user.getIndex(), 
                newValue: newED,
                power: this.potency,
            })
        }
    }

}

export class Burn extends Effect {

    public constructor(potency: number = 2) {
        super(potency)
    }

    public resolve(user: Player): void {
        const initialShield: number = user.getShield()
        const newShield: number = Math.max(initialShield-this.potency, 0)
        user.setShield(newShield)
        if (Effect.animationsOn) {
            if (initialShield != newShield) {
                const game: Game = GameManager.getInstance().getUserGame(user.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.SHIELD_DMG, 
                    duration: 1000, 
                    target: user.getIndex(), 
                    power: this.potency,
                    newValue: newShield,
                })
            }
        }
    }

}

export class Bless extends Effect {

    public constructor(potency: number = 1) {
        super(potency)
    } 

    public resolve(user: Player): void {
        const status: StatusEffect[] = user.getActiveStatusEffect().filter( s => {
           return s.getType() != STATUS_EFFECT.BLESS
        })
        if (status.length > 0) {
            status.forEach((s) => {
                s.setRemainingTurn(s.getRemainingTurn() - 1)
            })
            status.filter(status => {
                return status.getRemainingTurn() > 0
            })
            if (Effect.animationsOn) {
                const game: Game = GameManager.getInstance().getUserGame(user.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.BLESS, 
                    duration: 1000, 
                    target: user.getIndex(),
                    statusEffects: user.getState().activeStatus,
                    type: GAME_EFFECT.BLESS
                })
            }
        }
        else {
            user.setEnchantedDice(user.getEnchantedDice() + 1)
            if (Effect.animationsOn) {
                const game: Game = GameManager.getInstance().getUserGame(user.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.ENCHANT, 
                    duration: 1000, 
                    target: user.getIndex() 
                })
            }
        }
    }
    
}

export class Status extends Effect {

    private type: GAME_EFFECT

    public constructor(data: EffectData) {
        super(data.potency)
        this.type = data.type
    }

    public resolve(user: Player): void {
        const opponent: Player = user.getOpponent()
        if (opponent.getShield() > 0 && this.type != GAME_EFFECT.BLESS) {
            opponent.setShield(opponent.getShield() - 1)
            if (Effect.animationsOn) {
                const game: Game = GameManager.getInstance().getUserGame(user.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.SHIELD_DMG, 
                    duration: 1000, 
                    target: opponent.getIndex(), 
                    power: 1
                })
            }
        } 
        else {
            let effectType: GAME_EFFECT
            switch (this.type) {
                case GAME_EFFECT.FROST:
                    opponent.addStatusEffect(new FrostStatusEffect())
                    effectType = GAME_EFFECT.FROST
                    break
                case GAME_EFFECT.POISON:
                    opponent.addStatusEffect(new PoisonStatusEffect())
                    effectType = GAME_EFFECT.POISON
                    break
                case GAME_EFFECT.BLIND:
                    opponent.addStatusEffect(new BlindStatusEffect())
                    effectType = GAME_EFFECT.BLIND
                    break
                case GAME_EFFECT.FIRE:
                    opponent.addStatusEffect(new FireStatusEffect())
                    effectType = GAME_EFFECT.FIRE
                    break
                case GAME_EFFECT.BLESS:
                    user.addStatusEffect(new BlessStatusEffect())
                    effectType = GAME_EFFECT.BLESS
                    break
                default:
                    console.error(`Unknown GAME_EFFECT : ${this.type}`)
                    throw new Error(`Unknown GAME_EFFECT : ${this.type}`)
            }
            if (Effect.animationsOn && effectType) {
                const game: Game = GameManager.getInstance().getUserGame(user.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.STATUS, 
                    duration: 1000, 
                    target: effectType == GAME_EFFECT.BLESS ? user.getIndex() : opponent.getIndex(), 
                    power: 1,
                    type: effectType,
                    statusEffects: effectType == GAME_EFFECT.BLESS ? user.getState().activeStatus : opponent.getState().activeStatus
                })
            }
        }
    }

}

export class EffectFactory {

    public static create(data: EffectData): Effect {
        switch (data.type) {
            case GAME_EFFECT.ATTACK:
                return new Attack(data.potency)
            case GAME_EFFECT.SHIELD:
                return new Shield(data.potency)
            case GAME_EFFECT.HEAL:
                return new Heal(data.potency)
            case GAME_EFFECT.PRAYER:
                return new Prayer(data.potency)
            case GAME_EFFECT.REROLL:
                return new Reroll(data.potency)
            case GAME_EFFECT.PIERCE:
                return new Pierce(data.potency)
            case GAME_EFFECT.ENCHANT:
                return new Enchant(data.potency)
            case GAME_EFFECT.COOLDOWN:
                return new Cooldown(data.potency)
            case GAME_EFFECT.FROST:
            case GAME_EFFECT.POISON:
            case GAME_EFFECT.BLIND:
            case GAME_EFFECT.FIRE:
            case GAME_EFFECT.BLESS:
                return new Status(data)
            default:
                throw new Error(`Unknown effect type: ${data.type}`)
        }
    }
    
}

