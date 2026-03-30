//----------------------------------------
// artifacts.ts
// Catalogue des artefacts (coûts en dés, effets, cooldowns) fourni au client et instancié côté serveur.
// [Auteur : Frédéric Desrosiers]
//----------------------------------------
import { ArtifactData, EFFECT_SEQUENCE_TYPE, GAME_EFFECT, DICE_FACE } from '@common/types'

const ARTIFACTS_DATA: ArtifactData[] = [
    {
        id: 1,
        name:  'Lame de Freya',
        religion: 1,
        cooldown: 3,
        diceCost: [0, 1, 2],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 3},
                {type: GAME_EFFECT.FROST, potency: 1}
            ],
        }
    },
    {
        id: 2,
        name:  'Casque de Heimdall',
        religion: 1,
        cooldown: 2,
        diceCost: [1],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.SHIELD, potency: 3},
            ],
        }
    },
    {
        id: 3,
        name:  'Hache de Tyr',
        religion: 1,
        cooldown: 2,
        diceCost: [DICE_FACE.STAR],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.CONDITIONAL,
            effects: [
                {type: GAME_EFFECT.PIERCE, potency: 2},
            ],
            condition: {type: GAME_EFFECT.SHIELD, potency: -1}
        }
    },
    {
        id: 4,
        name:  "Loups d'Odin",
        religion: 1,
        cooldown: 3,
        diceCost: [DICE_FACE.SWORD, DICE_FACE.SHIELD],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 2},
                {type: GAME_EFFECT.BLESS, potency: 0},
            ],
        }
    },
    {
        id: 5,
        name:  'Marteau de Thor',
        religion: 1,
        cooldown: 2,
        diceCost: [0, 3, 3],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PIERCE, potency: 2},
                {type: GAME_EFFECT.PRAYER, potency: 2},
            ],
        }
    },
    {
        id: 6,
        name:  "Sandales d'Hermes",
        religion: 2,
        cooldown: 1,
        diceCost: [3],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PIERCE, potency: 1},
            ],
        }
    },
    {
        id: 7,
        name:  "Dague de Nemesis",
        religion: 2,
        cooldown: 2,
        diceCost: [2, 3],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PIERCE, potency: 1},
                {type: GAME_EFFECT.BLIND, potency: 1},
            ],
        }
    },
    {
        id: 8,
        name:  "Lyre d'Apollon",
        religion: 2,
        cooldown: 3,
        diceCost: [2, 2],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.HEAL, potency: 3},
                {type: GAME_EFFECT.BLESS, potency: 1},
            ],
        }
    },
    {
        id: 9,
        name:  "Plantes de Persephone",
        religion: 2,
        cooldown: 3,
        diceCost: [0, 0, 2],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 3},
                {type: GAME_EFFECT.POISON, potency: 1},
            ],
        }
    },
    {
        id: 10,
        name:  "Faux de Thanathos",
        religion: 2,
        cooldown: 2,
        diceCost: [0],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.CONDITIONAL,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 3},
            ],
            condition: {type: GAME_EFFECT.HEAL, potency: -2}
        }
    },
    {
        id: 11,
        name:  "Chat de Bastet",
        religion: 3,
        cooldown: 2,
        diceCost: [3],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PRAYER, potency: 2},
            ],
        }
    },
    {
        id: 12,
        name:  "Main d'Osiris",
        religion: 3,
        cooldown: 2,
        diceCost: [1],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.ENCHANT, potency: 2},
            ],
        }
    },
    {
        id: 13,
        name:  "Ankh de Set",
        religion: 3,
        cooldown: 2,
        diceCost: [1],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.HEAL, potency: 2},
            ],
        }
    },
    {
        id: 14,
        name:  "Lance d'Horus",
        religion: 3,
        cooldown: 3,
        diceCost: [0, 2, 2],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PIERCE, potency: 1},
                {type: GAME_EFFECT.BLIND, potency: 1},
                {type: GAME_EFFECT.FIRE, potency: 1},
            ],
        }
    },
    {
        id: 15,
        name:  "Livre de Thoth",
        religion: 3,
        cooldown: 3,
        diceCost: [3, 3],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PIERCE, potency: 2},
                {type: GAME_EFFECT.SHIELD, potency: 2},
            ],
        }
    },
    {
        id: 16,
        name:  "Dragon de Zhurong",
        religion: 4,
        cooldown: 2,
        diceCost: [DICE_FACE.SWORD, DICE_FACE.BOLT],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 1},
                {type: GAME_EFFECT.FIRE, potency: 1},
            ],
        }
    },
    {
        id: 17,
        name:  "Massue de Wukong",
        religion: 4,
        cooldown: 3,
        diceCost: [DICE_FACE.SWORD, DICE_FACE.SWORD, DICE_FACE.STAR],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 3},
                {type: GAME_EFFECT.HEAL, potency: 2},
            ],
        }
    },
    {
        id: 18,
        name:  "Lanterne de Zhong Kui",
        religion: 4,
        cooldown: 4,
        diceCost: [DICE_FACE.SHIELD, DICE_FACE.SHIELD, DICE_FACE.SWORD],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PRAYER, potency: 3},
            ],
        }
    },
    {
        id: 19,
        name:  "Roues de Nezha",
        religion: 4,
        cooldown: 3,
        diceCost: [DICE_FACE.BOLT, DICE_FACE.STAR],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.FIRE, potency: 1},
                {type: GAME_EFFECT.FROST, potency: 1},
            ],
        }
    },
    {
        id: 20,
        name:  "Dragon d'Ao Shun",
        religion: 4,
        cooldown: 3,
        diceCost: [DICE_FACE.SHIELD, DICE_FACE.STAR],
        effectSequence: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PIERCE, potency: 1},
                {type: GAME_EFFECT.FROST, potency: 1},
            ],
        }
    },
]
export default ARTIFACTS_DATA
