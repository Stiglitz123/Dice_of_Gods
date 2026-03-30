//----------------------------------------
// dice.ts
// Définitions des faces de dés et des séquences d’effets de base servies aux clients via GameManager.
// [Auteur : Frédéric Desrosiers]
//----------------------------------------
import { 
  DICE_FACE, 
  EFFECT_SEQUENCE_TYPE,
  GAME_EFFECT,
  DiceData 
} from "@common/types"

export const DICE_DATA: DiceData[] = [
  {
    face: DICE_FACE.SWORD,
    effectSequence: {
      type: EFFECT_SEQUENCE_TYPE.NORMAL,
      effects: [
        {
          type: GAME_EFFECT.ATTACK,
          potency: 1,
        },
      ],
    },
  },

  {
    face: DICE_FACE.SHIELD,
    effectSequence: {
      type: EFFECT_SEQUENCE_TYPE.NORMAL,
      effects: [
        {
          type: GAME_EFFECT.SHIELD,
          potency: 1,
        },
      ],
    },
  },

  {
    face: DICE_FACE.BOLT,
    effectSequence: {
      type: EFFECT_SEQUENCE_TYPE.NORMAL,
      effects: [
        {
          type: GAME_EFFECT.PRAYER,
          potency: 1,
        },
      ],
    },
  },
]
