//----------------------------------------
// Player.ts
// Modèle serveur d’un joueur : stats, dés, artefacts, dieux et logique d’actions/phases en lien avec GameManager et Game.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import User from "./User"
import Dice from "./Dice"
import StatusEffect from "./StatusEffect"
import { Dice as DiceState, Player as PlayerState, StatusEffect as StatusEffectState, PHASE_NAME, ArtifactState, GodState, STATUS_EFFECT, ArtifactData, ANIM_NAME } from '@common/types'
import Artifact from "./Artifact"
import ARTIFACTS_DATA from "./gameData/artifacts"
import RELIGION_DATA from "./gameData/religion"
import EffectSequence, { EffectSequenceFactory } from "./EffectSequence"
import God from "./God"
import GameManager from "./GameManager"
import type Game from "./Game"

export default class Player {
    public static START_HP: number = 10
    public static MAX_HP: number = 10
    public static MAX_SHIELD: number = 3
    public static START_PP: number = 0
    public static MAX_PP: number = 4
    public static START_ED: number = 0
    public static START_RC: number = 3
    public static DICE_NB: number = 4

    protected static animationsOn: boolean = false;

    private index: number
    private user: User
    private opponent: Player | null = null
    private hp: number = Player.START_HP
    private shield: number = 0
    private pp: number = Player.START_PP
    private dice: Dice[]
    private enchantedDice: number = Player.START_ED
    private canSummon: boolean = true
    private activeStatusEffect: StatusEffect[] = []
    private rerollCount: number = Player.START_RC
    private timeLeftForAction: number = 99.0
    private artifacts: Artifact[] = []
    private gods: God[] = []
    private clone: Player | undefined = undefined

    public constructor(user: User, index: number) {
        this.index = index
        this.user = user
        const skill: EffectSequence = EffectSequenceFactory.create(RELIGION_DATA[user.getReligion()-1]!.skill)
        this.dice = Array.from(
            {length: Player.DICE_NB }, () => new Dice(skill)
        )
        RELIGION_DATA.forEach( (religion) => {
            if (religion.id == RELIGION_DATA[user.getReligion()-1]!.id) {
                this.gods = religion.gods.map( (godData) => new God(godData) )
            }
        })
        user.getArtifacts().forEach( (id: number) => {
            const artifactData: ArtifactData | undefined = ARTIFACTS_DATA.find((a) => a.id === id)
            if (artifactData) {
                this.artifacts.push(new Artifact(artifactData))
            }
        })
    }

    public getClone(): Player {
        if (this.clone == undefined) {
            this.clone = new Player(this.user, this.index)
        }
        this.clone.hp = this.hp
        this.clone.shield = this.shield
        this.clone.pp = this.pp
        this.clone.opponent = this.opponent
        this.clone.activeStatusEffect = this.activeStatusEffect
        return this.clone
    }

    public hasValidStats(): boolean {
        return (this.hp > 0 && this.shield >= 0 && this.pp >= 0)
    }

    public getIndex(): number {
        return this.index
    }

    public getState(): PlayerState {
        let artifacts: ArtifactState[] = []
        this.artifacts.forEach((a) => {
            artifacts.push(a.getState())
        })
        let gods: GodState[] = []
        this.gods.forEach((g) => {
            gods.push(g.getState())
        })
        return {
            user: this.user.getState(),
            hp: this.hp,
            shield: this.shield,
            pp: this.pp,
            enchantedDice: this.enchantedDice,
            canSummon: this.canSummon,
            rerollCount: this.rerollCount,
            dice: this.getDiceState(),
            activeStatus: this.getActiveStatusState(),
            artifacts: artifacts,
            gods: gods,
            timeLeft: this.timeLeftForAction
        }
    }

    public updatePlayerState(updateOpponent: boolean = false): void {
        this.setUsableArtifacts()
        this.setUsableGods()
        if (this.opponent && updateOpponent) {
            this.opponent.updatePlayerState()
        }
    }

    public getActiveStatusEffect(): StatusEffect[] {
        return this.activeStatusEffect
    }

    public getActiveStatusState(): StatusEffectState[] {
        const activeStatusState: StatusEffectState[] = []
        this.activeStatusEffect.forEach((status) => {
            activeStatusState.push(status.getState())
        })
        return activeStatusState
    }

    public addStatusEffect(status: StatusEffect): void {
        let sameStatusFound: StatusEffect | undefined = this.activeStatusEffect.find( (s) => s.getType() == status.getType() )
        if (sameStatusFound) {
            sameStatusFound.setRemainingTurn(3)
        } 
        else {
            if (status.getType() == STATUS_EFFECT.BLESS) {
                this.activeStatusEffect.unshift(status)
            } 
            else {
                this.activeStatusEffect.push(status)
            }
        }
    }

    public resolveStatusEffects(): void {
        this.activeStatusEffect = this.activeStatusEffect.filter(status => {
                return status.resolve(this)
            }
        )
    }
    
    public getOpponent(): Player {
        return this.opponent as Player
    }

    public setOpponent(opponent: Player): void {
        this.opponent = opponent
    }

    public static setAnimationsOn(on: boolean): void {
        Player.animationsOn = on;
    }

    public getId(): string {
        return this.user.getId()
    }

    public setEnchantedDice(value: number): void {
        this.enchantedDice = value
    }
    
    public setCanSummon(value: boolean): void {
        this.canSummon = value
    }
    
    public setRerollCount(value: number): void {
        this.rerollCount = value
    }

    public gainPrayerPower(value: number): void {
        this.pp = Math.min(this.pp+value, Player.MAX_PP)
    }

    public getHp(): number {
        return this.hp
    }

    public setHp(value: number) {
        this.hp = value
    }

    public getShield(): number {
        return this.shield
    }

    public setShield(value: number) {
        this.shield = value
    }

    public getPP(): number {
        return this.pp
    }

    public setPP(value: number) {
        this.pp = value
    }    

    public getTimeLeft(): number {
        return this.timeLeftForAction
    }

    public setTimeLeft(value: number) {
        this.timeLeftForAction = value
    }

    public getDice(index: number): Dice {
        return this.dice[index] as Dice
    } 

    public getAllDice(): Dice[] {
        return this.dice
    }  

    public getAllDiceFaces(): number[] {
        let faces: number[] = []
        this.dice.forEach((die) => {
            faces.push(die.getFace())
        })
        return faces
    }

    public getArtifact(index: number): Artifact {
        return this.artifacts[index] as Artifact
    }

    public getEnchantedDice(): number {
        return this.enchantedDice
    }
   
    public getCanSummon(): boolean {
        return this.canSummon
    }

    public getRerollCount(): number {
        return this.rerollCount
    }

    public getUser(): User {
        return this.user
    }

    public getGods(): God[] {
        return this.gods
    }

    public getDiceState(): DiceState[] {
        let diceState: DiceState[] = []
        this.dice.forEach((die) => {
            diceState.push(die.getState())
        })
        return diceState
    }

    public setupTurn(): void {
        this.setEnchantedDice(Player.START_ED)
        this.setCanSummon(true)
        this.setRerollCount(Player.START_RC)
        this.resetAllDice()
        this.artifacts.forEach((a) => a.reduceCooldown(1))
        this.resolveStatusEffects()
        this.updatePlayerState()
    }

    public useDice(index: number): boolean {
        const dice: Dice | undefined = this.dice[index]
        if (dice == undefined) {
            return false
        }
        else {
            if (Player.animationsOn) {
                const game: Game = GameManager.getInstance().getUserGame(this.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.DICE, 
                    duration: 1000, 
                    target: this.getIndex(), 
                    id: index,
                    power: dice.getFace() 
                })
            }
            this.dice[index]?.resolve(this)
            return true
        }
    }

    public useArtifact(id: number): boolean {
        const artifact: Artifact | undefined = this.artifacts.find((a) => a.getId() == id)
        if (artifact == undefined) {
            return false
        }
        else {
            return artifact.use(this)
        }
    }    

    public useGod(id: number): boolean {
        const god: God | undefined = this.gods.find((a) => a.getId() == id)
        if (god == undefined) {
            return false
        }
        return god.use(this)
    }

    public enchantDice(index: number, faceValue: number): boolean {
        if (this.enchantedDice > 0) {
            this.dice[index]?.setFace(faceValue)
            this.enchantedDice--
            if (Player.animationsOn) {
                const game: Game = GameManager.getInstance().getUserGame(this.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.ENCHANT,
                    duration: 1000,
                    target: this.getIndex(),
                    id: index,
                    newValue: faceValue,
                })
            }
            return true
        }
        return false
    }

    public rollDice(addDuration: boolean = true): boolean {
        if (this.rerollCount > 0) {
            this.rerollCount -= 1
            this.dice.forEach((die) => {
                if (!die.isLocked()) {
                    die.roll()
                }
            })
            if (Player.animationsOn) {
                const game: Game = GameManager.getInstance().getUserGame(this.getId())
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.CHANGE_REROLL,
                    duration: 0,
                    target: this.getIndex(),
                    power: -1,
                    newValue: this.rerollCount,
                })
                game.getAnimationQueue().addAnimation({ 
                    name: ANIM_NAME.ROLL, 
                    duration: addDuration ? 500 : 0, 
                    target: this.getIndex() 
                })
            }
            this.updatePlayerState()
            return true
        }
        return false
    }

    public lockToggle(index: number): void {
        this.dice[index]?.toggleLock()
    }

    public resetAllDice() {
        this.dice.forEach((die) => {
            die.setIsLocked(false)
            die.setIsUsed(false)
        })
    }

    public getFirstAvailabeDiceId(): number {
        for (let i = 0; i < this.dice.length; i++) {
            if (!this.dice[i]?.isUsed()) {
                return i
            }
        }
        return -1
    }
    
    public getLastAvailabeArtifactId(): number {
        let id: number = -1
        this.artifacts.forEach((artifact) => {
            if (artifact.isUsable()) {
                id = artifact.getId()
            }
        })
        return id
    }
    
    public getLastAvailabeGodId(): number {
        let id: number = -1
        this.gods.forEach((god) => {
            if (god.isUsable()) {
                id = god.getId()
            }
        })
        return id
    }

    public hasRemainingAction(phaseName: string): boolean {
        if (phaseName === PHASE_NAME.ACTION) {
            return this.dice.some((die) => !die.isUsed()) || this.gods.some((god) => god.isUsable())
        } 
        else if (phaseName === PHASE_NAME.ROLL) {
            return this.rerollCount > 0
        }
        return false
    }

    public setUsableGods(): void {
        this.gods.forEach((god) => {
            god.setUsable(this.canSummon && this.pp >= god.getCost() && god.getEffectSequence().isUsable(this))
        })
    }

    public setUsableArtifacts(): void {
        this.artifacts.forEach( (artifact) => {
            if (artifact.getCountdown() > 0) {
                artifact.setUsable(false)
                return
            }
            if (!artifact.getEffectSequence().isUsable(this)) {
                artifact.setUsable(false)
                return
            }
            let diceIndexesToUse: number[] = []
            artifact.getDiceCost().forEach( (face) => {
                let diceIndexToUse = -1
                this.getAllDice().forEach( (dice: Dice, i: number) => {
                    if (dice.getFace() == face && !dice.isUsed() && !diceIndexesToUse.includes(i)) {
                        diceIndexToUse = i
                        return 
                    }
                })
                diceIndexesToUse.push(diceIndexToUse)
            })
            artifact.setUsable(!diceIndexesToUse.includes(-1))

        })
    }

}
