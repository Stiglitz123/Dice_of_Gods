//----------------------------------------
// types.ts
// Déclarations des enums et interfaces partagées entre client et serveur pour les phases, commandes, effets, entités et états de jeu.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
export enum PHASE_NAME {
    SETUP = 'SetupPhase',
    ROLL = 'RollPhase',
    ACTION = 'ActionPhase',
}

export enum DICE_FACE {
  SWORD = 0,
  SHIELD = 1,
  STAR = 2,
  BOLT = 3,
}

export enum COMMAND_NAME {
  ROLL,
  LOCK,
  DICE,
  ARTIFACT,
  GOD,
  ENCHANT,
  END,
  FORFEIT,
  TRAINING,
  QUEUE,
  LEAVE,
  DUEL,
  SWAP_ARTIFACT,
  SWAP_RELIGION,
  SWAP_AVATAR,
  REQUEST_GAME_STATE,
}

export enum SOCKET_EVENT {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  REGISTER = 'register',
  COMMAND = 'command',
  USER_INFO = 'userInfo',
  GAME_STATE = 'gameState',
  TIMER_UPDATE = 'timerUpdate',
  GAME_VALUES = 'gameValues',
  GAME_READY = 'gameReady',
  GAME_ENDED = 'gameEnded',
  ANIMATION = 'animation',
  ERROR = 'error',
  QUEUE = 'lookingForGame',
  EXIT_QUEUE = 'leavingQueue',
  COMMAND_ACKNOWLEDGE = 'commandAcknowledge',
}

export enum ANIM_NAME {
  SHIELD_DMG = "shield_dmg",
  HP_DMG = "hp_dmg",
  SHIELD = "shield",
  ROLL = "roll",
  HEAL = "heal",
  PRAYER = "prayer",
  GOD = "god",
  ARTIFACT = "artifact",
  COOLDOWN = "cooldown",
  BLESS = "bless",
  ENCHANT = "enchant",
  DICE = "dice",
  STATUS = "status",
  CHANGE_REROLL = "reroll",
  CHANGE_ENCHANT = "change_enchant",
}

export enum GAME_EFFECT {
  ATTACK,
  PIERCE,
  SHIELD,
  HEAL,
  REROLL,
  PRAYER,
  ENCHANT,
  COOLDOWN,
  FROST,
  POISON,
  BLIND,
  FIRE,
  BLESS,
}

export enum STATUS_EFFECT {
  BLESS,
  FROST,
  POISON,
  BLIND,
  FIRE,
}

export enum EFFECT_SEQUENCE_TYPE {
  NORMAL,
  CONDITIONAL,
  STATUS,
}

export enum ICON_TYPE {
  ATTACK = 0,
  PIERCE = 1,
  SHIELD = 2,
  HEAL = 3,
  PRAYER = 4,
  ENCHANT = 5,
  BLESS = 6,
  FROST = 7,
  POISON = 8,
  BLIND = 9,
  FIRE = 10,
  ARROW = 11,
  PLUS = 12,
  OPEN = 13,
  CLOSE = 14,
  DOTS = 15,
}

export interface CommandArgs {
  id?: number
  newValue?: number
  other?: any
}

export interface RegisterData {
  username: string
  avatar: number
  religion: number
}

export interface Command {
  name: COMMAND_NAME
  args: CommandArgs
}

export interface Effect {
  type: GAME_EFFECT
  potency: number
  iconHidden?: boolean
}

export interface EffectSequence {
  type: EFFECT_SEQUENCE_TYPE
  effects: Effect[]
  condition?: Effect
  status?: STATUS_EFFECT
  statusEffectSequence?: EffectSequence
  iconSequence?: Icon[]
}

export interface Icon {
  type: ICON_TYPE
  potency?: number
  isStatus?: boolean
}

export interface ArtifactData {
  id: number
  name: string
  religion: number
  cooldown: number
  diceCost: number[]
  effectSequence: EffectSequence
}

export interface ArtifactState {
  id: number
  countdown: number
  isUsable: boolean
}

export interface GodData {
  id: number
  name: string
  cost: number
  effectSequence: EffectSequence
}

export interface GodState {
  id: number
  isUsable: boolean
}

export interface ReligionData {
  id: number
  name: string
//   description?: string
  skill: EffectSequence
  gods: GodData[]
  startingArtifact?: number[]
}

export interface DiceData {
  face: DICE_FACE
  effectSequence: EffectSequence
}

export interface StatusEffectData {
    name: string
    description: string
    type: STATUS_EFFECT
}

export interface GameValues {
  artifacts: ArtifactData[]
  religions: ReligionData[]
  dice: DiceData[]
}


export interface Animation {
  name: ANIM_NAME
  target?: number
  duration?: number
  power?: number
  newValue?: number
  type?: GAME_EFFECT
  id?: number
  statusEffects?: StatusEffect[]
}

export interface GameState {
    round: number
    phase: string
    activePlayer: number | null
    players: Player[]
}

export interface Player {
    user: User
    hp: number
    shield: number
    pp: number
    enchantedDice: number
    canSummon: boolean
    rerollCount: number
    activeStatus: StatusEffect[]
    dice: Dice[]
    artifacts: ArtifactState[]
    gods: GodState[]
    timeLeft: number
}
export interface StatusEffect {
    type: STATUS_EFFECT
    remainingTurn: number
}

export interface Dice {
    face: number
    isLocked: boolean
    isUsed: boolean
}

export interface User {
    id: string
    name: string
    avatar: number
    trophy: number
    religion: number
    artifacts: number[]
    inGame?: boolean
    inQueue?: boolean
}

export interface GameStats {
    id: number
    winner: User
    loser: User
    rounds: number
    winnerTrophyChange?: number
    loserTrophyChange?: number
}
