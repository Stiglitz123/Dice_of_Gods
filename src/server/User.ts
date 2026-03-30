//----------------------------------------
// User.ts
// Modélise un utilisateur côté serveur (joueur ou IA), expose ses attributs et états de file/partie pour les autres services.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import { RegisterData, User as UserState } from "@common/types"
import { getRandomInt, registerDataToUser } from "./Utils"
import RELIGION_DATA from "./gameData/religion"

export default class User {

    protected id: string
    protected name: string
    protected avatar: number
    protected religion: number
    protected artifacts: number[]
    protected trophy: number
    protected inGame: boolean = false
    protected inQueue: boolean = false

    public constructor(data: UserState) {
        this.id = data.id
        this.name = data.name
        this.avatar = data.avatar
        this.religion = data.religion
        this.artifacts = data.artifacts
        this.trophy = data.trophy
    }

    public getState(): UserState {
        return {
            id: this.id,
            name :this.name,
            avatar: this.avatar,
            trophy: this.trophy,
            religion: this.religion,
            artifacts: this.artifacts,
            inGame: this.inGame,
            inQueue: this.inQueue,
        }
    }

    public getId(): string {
        return this.id
    }
    
    public getName(): string {
        return this.name
    }

    public getAvatar(): number {
        return this.avatar
    }

    public setAvatar(avatar: number): void {
        this.avatar = avatar
    }

    public getReligion(): number {
        return this.religion
    }

    public setReligion(religion: number): void {
        this.religion = religion
    }

    public getArtifacts(): number[] {
        return this.artifacts
    }

    public setArtifacts(artifacts: number[]) {
        this.artifacts = artifacts
    }

    public getTrophy(): number {
        return this.trophy
    }  

    public setTrophy(trophy: number): void {
        this.trophy = trophy
    }

    public isInGame(): boolean {
        return this.inGame
    }

    public setIsInGame(value: boolean) {
        this.inGame = value
    }

    public isInQueue(): boolean {
        return this.inQueue
    }

    public setInQueue(value: boolean) {
        this.inQueue = value
    }

    public isAI(): boolean {
        return this instanceof AIUser
    }

}

export class AIUser extends User {

    private static aiName: Record<number, string> = {
        1:'Grunt',
        2:'Sylvana',
        3:'Pharaon',
        4:'Chu-Chu',
        5:'Xi-Mun',
        6:'Zia',
    }

    constructor(opponentId: string) {
        const id: string = `AI_VS_${opponentId}`
        const rngReligion: number = getRandomInt(1, RELIGION_DATA.length)
        const rd: RegisterData = {username: "username", avatar: rngReligion, religion: rngReligion}
        const startingArtifact: number[] = registerDataToUser(id, rd).artifacts
        const userData: UserState = {
            id: id, 
            name: AIUser.aiName[rngReligion]! ?? 'Undefined',
            avatar: rngReligion, 
            trophy: 1000, 
            religion: rngReligion, 
            artifacts: startingArtifact,
        }
        super(userData)
    }

}
