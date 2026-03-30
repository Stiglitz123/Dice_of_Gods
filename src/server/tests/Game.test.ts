//----------------------------------------
// Game.test.ts
// Tests unitaires serveur couvrant Player, Dice, Effects, Artifacts et Gods pour valider la logique de combat.
// [Auteur : Hugo Beaulieu]
//----------------------------------------
import Effect, {Attack, Shield, Heal, Prayer, Cooldown, Status } from '../Effect';
import { EffectSequenceFactory } from '../EffectSequence';
import Player from '../Player';
import User from '../User';
import Dice from '../Dice';
import { EFFECT_SEQUENCE_TYPE, GAME_EFFECT, STATUS_EFFECT, User as UserData } from '../../common/types';
import God from '../God';
import Artifact from '../Artifact';

let dice: Dice
const userData1: UserData = {id: 'id', name: 'name', avatar: 1, trophy: 0, religion: 1, artifacts: [1,2,3,10]}
const user1: User = new User(userData1)
let p1: Player
const userData2: UserData = {id: 'id', name: 'name', avatar: 1, trophy: 0, religion: 2, artifacts: [1,2,3,10]}
const user2: User = new User(userData2)
let p2: Player

beforeEach(() => {
  Effect.setAnimationsOn(false);
  God.setAnimationsOn(false);
  Player.setAnimationsOn(false)
  Artifact.setAnimationsOn(false)

  p1 = new Player(user1, 1)
  p2 = new Player(user2, 2)
  p1.setOpponent(p2)
  p2.setOpponent(p1)
  dice = new Dice((EffectSequenceFactory.create({type: EFFECT_SEQUENCE_TYPE.NORMAL, effects: [{type: GAME_EFFECT.ATTACK, potency: 2}]})))
})

// *****************PLAYER******************
test('Player starts with 10 HP', () => {
  expect(p1.getHp()).toBe(Player.START_HP)
});

test('Player 1 has no shields and Player 2 starts with 0', () => {
  expect(p1.getShield()).toBe(0)
  expect(p2.getShield()).toBe(0)
})

test('Player 1 uses dice[0] with skill Face', () => {
  const myDice = p1.getDice(0) as Dice
  myDice.setFace(2)
  expect(myDice.getFace()).toBe(2)
  expect(p1.useDice(0)).toBe(true)
  expect(p2.getShield()).toBe(0)
  expect(p2.getHp()).toBe(9)
})

test('Player 2 enchant the 3rd dice for a value 5 and uses it to gain 1 bolt', () => {
  p2.setEnchantedDice(1)
  expect(p2.getEnchantedDice()).toBe(1)
  p2.enchantDice(2, 3)
  p2.useDice(2)
  expect(p2.getDice(2).getFace()).toBe(3)
  expect(p2.getPP()).toBe(1)

})

test('Player 1 rolls and get 4 new results', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.5)
  p1.rollDice()
  const dices: Dice[] = p1.getAllDice()
  var diceList: number[] = []
  dices.forEach((dice) => {
      diceList.push(dice.getFace())
  })
  expect(diceList).toStrictEqual([1, 1, 1, 1])
})

test('Player 1 locks dice 0, rolls and get 3 new results', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.5)
  p1.lockToggle(0)
  p1.rollDice()
  const dices: Dice[] = p1.getAllDice()
  var diceList: number[] = []
  dices.forEach((dice) => {
      diceList.push(dice.getFace())
  })
  expect(diceList).toStrictEqual([0, 1, 1, 1])
})

// *******************************************


// *******************DICE********************
test('Dice.roll() returns int between 0 and 5', () => {
    
  const result: number = dice.roll()

  expect(Number.isInteger(result)).toBe(true)
  expect(result).toBeGreaterThanOrEqual(0)
  expect(result).toBeLessThanOrEqual(5)
});

test('Dice.toggleLock returns true if dice was not locked', () => {

  dice.setIsLocked(false)
  const result : boolean = dice.toggleLock()

  expect(result).toBe(true)
});

test('Dice.toggleLock returns false if dice was locked', () => {

  dice.setIsLocked(true)
  const result : boolean = dice.toggleLock()

  expect(dice.isLocked()).toBe(false)
});

test('Dice.resolve set the dice to used', () => {

  dice.resolve(p1)

  expect(dice.isUsed()).toBe(true)
});

// *******************************************

// *******************EFFECT******************
test('AttackEffect 3 removes 3 HP from player2', () => {
  const ae = new Attack(3)
  ae.resolve(p1)
  expect(p2.getShield()).toBe(0);
  expect(p2.getHp()).toBe(7);
});

test('ShieldEffect 4 gives 3 Shield to player2', () => {
  const se = new Shield(4)
  se.resolve(p2)
  expect(p2.getShield()).toBe(3);
});

test('HealEffect 1 gives 0 Hp to player1', () => {
  const he = new Heal(1)
  he.resolve(p1)
  expect(p1.getHp()).toBe(10);
});
test('HealEffect -1 removes 1 Hp from player1', () => {
  const he = new Heal(-1)
  he.resolve(p1)
  expect(p1.getHp()).toBe(9);
});

test('BoltEffect 5 gives 4 PP to player1', () => {
  const pe = new Prayer(5)
  pe.resolve(p1)
  expect(p1.getPP()).toBe(4);
});
// *******************************************

// *******************ARTIFACT******************

test('player1 cant use artifact1', () => {
  p1.setUsableArtifacts()
  expect(p1.useArtifact(1)).toBe(false)
  expect(p1.getDice(0).isUsed()).toBe(false)
  expect(p1.getDice(1).isUsed()).toBe(false)
  expect(p1.getDice(2).isUsed()).toBe(false)
  expect(p1.getDice(3).isUsed()).toBe(false)
})
test('player1 can use simple artifact1', () => {
  let dice = p1.getDice(0) as Dice
  dice.setFace(1)
  dice = p1.getDice(1) as Dice
  dice.setFace(2)
  expect(p1.getDice(0).getFace()).toBe(1)
  expect(p1.getDice(1).getFace()).toBe(2)
  expect(p1.getDice(2).getFace()).toBe(0)
  expect(p1.getDice(3).getFace()).toBe(0)
  p1.setUsableArtifacts()
  expect(p1.useArtifact(1)).toBe(true)
  expect(p2.getHp()).toBe(7)
  expect(p1.getDice(0).isUsed()).toBe(true)
  expect(p1.getDice(1).isUsed()).toBe(true)
  expect(p1.getDice(2).isUsed()).toBe(true)
  expect(p1.getDice(3).isUsed()).toBe(false)
  expect(p1.getArtifact(0).getCountdown()).toBe(3)
  expect(p2.getActiveStatusEffect().length).toBe(1)
  expect(p2.getActiveStatusEffect()[0].getType()).toBe(STATUS_EFFECT.FROST)
})

test('player1 has artifact1 on cooldown, uses a cooldown effect to reduce its cooldown by 1', () => {
  p1.getArtifact(0).setCountdown(p1.getArtifact(0).getCooldown())
  expect(p1.getArtifact(0).getCountdown()).toBe(3)
  const ce = new Cooldown(1)
  ce.resolve(p1)
  expect(p1.getArtifact(0).getCountdown()).toBe(2)
})

test('player 1 use artifact id 10 at 2 hp', () => {
  p1.setHp(2)
  p1.setUsableArtifacts()

  expect(p1.useArtifact(10)).toBe(false)
  expect(p1.getHp()).toBe(2)
  expect(p2.getHp()).toBe(10)
  expect(p1.getDice(0).isUsed()).toBe(false)
  expect(p1.getDice(1).isUsed()).toBe(false)
  expect(p1.getDice(2).isUsed()).toBe(false)
  expect(p1.getDice(3).isUsed()).toBe(false)
  expect(p1.getArtifact(3).getCountdown()).toBe(0)
})
test('player 1 use artifact id 10 at 10 hp', () => {
  p1.setUsableArtifacts()
  expect(p1.useArtifact(10)).toBe(true)
  expect(p1.getHp()).toBe(8)
  expect(p2.getHp()).toBe(7)
  expect(p1.getDice(0).isUsed()).toBe(true)
  expect(p1.getDice(1).isUsed()).toBe(true)
  expect(p1.getDice(2).isUsed()).toBe(false)
  expect(p1.getDice(3).isUsed()).toBe(false)
  expect(p1.getArtifact(3).getCountdown()).toBe(2)
})

// *******************************************

// *******************GOD******************
test('player1 uses god 1 without PP', () => {
  p1.setShield(2)
  expect(p1.getShield()).toBe(2)
  expect(p1.getPP()).toBe(0)
  expect(p1.useGod(1)).toBe(false)
  expect(p1.getShield()).toBe(2)
  expect(p2.getHp()).toBe(10)
  expect(p1.getPP()).toBe(0)
});

test('player1 uses god 1 with 1 PP, but cant summon', () => {
  p1.setShield(2)
  expect(p1.getShield()).toBe(2)
  p1.setCanSummon(false)
  p1.setPP(1)
  expect(p1.getPP()).toBe(1)
  expect(p1.useGod(1)).toBe(false)
  expect(p1.getShield()).toBe(2)
  expect(p2.getHp()).toBe(10)
  expect(p1.getPP()).toBe(1)
});

test('player1 uses god 1 with 1 PP', () => {
  p1.setShield(2)
  expect(p1.getShield()).toBe(2)
  p1.setPP(1)
  expect(p1.getPP()).toBe(1)
  expect(p1.getCanSummon()).toBe(true)
  expect(p1.useGod(1)).toBe(true)
  expect(p1.getShield()).toBe(0)
  expect(p2.getHp()).toBe(8)
  expect(p1.getPP()).toBe(0)
});

test('player2 uses god id 4 without the opponent having poison status effect', () => {
  p2.setPP(2)
  p1.setShield(2)
  expect(p1.getShield()).toBe(2)
  expect(p2.getPP()).toBe(2)
  expect(p2.getCanSummon()).toBe(true)
  expect(p2.useGod(4)).toBe(true)
  expect(p2.getPP()).toBe(0)
  expect(p1.getShield()).toBe(0)
  expect(p1.getHp()).toBe(10)
})

test('player2 uses god id 4 with the opponent having poison status effect', () => {
  const pe = new Status({potency: 3, type: GAME_EFFECT.POISON})
  pe.resolve(p2)
  expect(p1.getActiveStatusEffect().length).toBe(1)
  expect(p1.getActiveStatusEffect()[0].getType()).toBe(STATUS_EFFECT.POISON)

  p2.setPP(2)
  p1.setShield(2)
  expect(p1.getShield()).toBe(2)
  expect(p2.getPP()).toBe(2)
  expect(p2.getCanSummon()).toBe(true)
  expect(p2.useGod(4)).toBe(true)
  expect(p2.getPP()).toBe(0)
  expect(p1.getShield()).toBe(0)
  expect(p1.getHp()).toBe(8)
})
// *******************************************
