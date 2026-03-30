//----------------------------------------
// religion.ts
// Données statiques des religions (compétences, dieux, artefacts de départ) utilisées pour initialiser les joueurs côté serveur.
// [Auteur : Frédéric Desrosiers]
//----------------------------------------
import { ReligionData, EFFECT_SEQUENCE_TYPE, GAME_EFFECT, STATUS_EFFECT } from '@common/types'

const RELIGION_DATA: ReligionData[] = [
    {
        id: 1,
        name: 'Nordique',
        startingArtifact: [1, 2, 5, 4],
        skill: {
            type: EFFECT_SEQUENCE_TYPE.STATUS,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 1},    
            ],
            status: STATUS_EFFECT.FROST,
            statusEffectSequence: {
                type: EFFECT_SEQUENCE_TYPE.NORMAL,
                effects: [
                    {type: GAME_EFFECT.ATTACK, potency: 1, iconHidden: true},
                    {type: GAME_EFFECT.SHIELD, potency: 2},
                ],
            },
        },
        gods: [
            {
                id: 1,
                name: 'Loki, Dieu de la Discorde',
                cost: 1,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.CONDITIONAL,
                    effects: [
                        {type: GAME_EFFECT.PIERCE, potency: 2},
                    ],
                    condition: {type: GAME_EFFECT.SHIELD, potency: -2}
                },
            },
            {
                id: 0,
                name: 'Ymir, Géant de Glace',
                cost: 2,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.NORMAL,
                    effects: [
                        {type: GAME_EFFECT.ATTACK, potency: 2},
                        {type: GAME_EFFECT.FROST, potency: 0},
                    ],
                },
            },
            {
                id: 2,
                name: "Odin, Père des Dieux",
                cost: 3,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.NORMAL,
                    effects: [
                        {type: GAME_EFFECT.ATTACK, potency: 2},
                        {type: GAME_EFFECT.HEAL, potency: 3},
                    ],
                },
            },
        ],
    },
    {
        id: 2,
        name: 'Grec',
        startingArtifact: [7, 9, 8, 6],
        skill: {
            type: EFFECT_SEQUENCE_TYPE.STATUS,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 1},    
            ],
            status: STATUS_EFFECT.POISON,
            statusEffectSequence: {
                type: EFFECT_SEQUENCE_TYPE.NORMAL,
                effects: [
                    {type: GAME_EFFECT.PIERCE, potency: 1},
                ],
            },
        },
        gods: [
            {
                id: 3,
                name: "Aphrodite, Déesse de l'Amour",
                cost: 2,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.NORMAL,
                    effects: [
                        {type: GAME_EFFECT.HEAL, potency: 3},
                    ],
                },
            },
            {
                id: 4,
                name: 'Hades, Dieu des Enfers',
                cost: 2,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.STATUS,
                    effects: [
                        {type: GAME_EFFECT.ATTACK, potency: 2},
                    ],
                    status: STATUS_EFFECT.POISON,
                    statusEffectSequence: {
                        type: EFFECT_SEQUENCE_TYPE.NORMAL,
                        effects: [
                            {type: GAME_EFFECT.PIERCE, potency: 2},
                        ],
                    }
                },
            },
            {
                id: 5,
                name: "Medusa, La Gorgone",
                cost: 2,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.NORMAL,
                    effects: [
                        {type: GAME_EFFECT.POISON, potency: 1},
                        {type: GAME_EFFECT.BLIND, potency: 1},
                    ],
                },
            },
        ],
    },
    {
        id: 3,
        name: 'Égyptien',
        startingArtifact: [14, 15, 11, 13],
        skill: {
            type: EFFECT_SEQUENCE_TYPE.NORMAL,
            effects: [
                {type: GAME_EFFECT.PRAYER, potency: 1},    
            ],
        },
        gods: [
            {
                id: 6,
                name: "Isis, Déesse de la Magie",
                cost: 1,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.NORMAL,
                    effects: [
                        {type: GAME_EFFECT.PRAYER, potency: 2},
                    ],
                },
            },
            {
                id: 7,
                name: 'Sobek, Dieu du Nil',
                cost: 3,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.NORMAL,
                    effects: [
                        {type: GAME_EFFECT.HEAL, potency: 3},
                        {type: GAME_EFFECT.SHIELD, potency: 3},
                    ],
                },
            },
            {
                id: 8,
                name: "Ra, Dieu du Soleil",
                cost: 4,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.NORMAL,
                    effects: [
                        {type: GAME_EFFECT.ATTACK, potency: 4},
                        {type: GAME_EFFECT.BLESS, potency: 0},
                    ],
                },
            },
        ],
    },
    {
        id: 4,
        name: 'Chinois',
        startingArtifact: [17, 18, 16, 20],
        skill: {
            type: EFFECT_SEQUENCE_TYPE.STATUS,
            effects: [
                {type: GAME_EFFECT.ATTACK, potency: 1},    
            ],
            status: STATUS_EFFECT.FIRE,
            statusEffectSequence: {
                type: EFFECT_SEQUENCE_TYPE.NORMAL,
                effects: [
                    {type: GAME_EFFECT.ATTACK, potency: 2},
                ],
            },
        },
        gods: [
            {
                id: 9,
                name: "Zhu Rong, Dieu du Feu",
                cost: 2,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.STATUS,
                    effects: [
                        {type: GAME_EFFECT.ATTACK, potency: 2},    
                    ],
                    status: STATUS_EFFECT.FIRE,
                    statusEffectSequence: {
                        type: EFFECT_SEQUENCE_TYPE.NORMAL,
                        effects: [
                            {type: GAME_EFFECT.ATTACK, potency: 3},
                        ],
                    },
                },
            },
            {
                id: 10,
                name: "Chang'e Déesse de la Lune",
                cost: 3,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.STATUS,
                    effects: [
                        {type: GAME_EFFECT.PIERCE, potency: 2},
                    ],
                    status: STATUS_EFFECT.FROST,
                    statusEffectSequence: {
                        type: EFFECT_SEQUENCE_TYPE.NORMAL,
                        effects: [
                            {type: GAME_EFFECT.PIERCE, potency: 2, iconHidden: true},
                            {type: GAME_EFFECT.SHIELD, potency: 3},
                        ],
                    },
                },
            },
            {
                id: 11,
                name: "Nu Wa, Déesse Créatrice",
                cost: 4,
                effectSequence: {
                    type: EFFECT_SEQUENCE_TYPE.NORMAL,
                    effects: [
                        {type: GAME_EFFECT.ATTACK, potency: 3},
                        {type: GAME_EFFECT.FIRE, potency: 1},
                        {type: GAME_EFFECT.FROST, potency: 1},
                    ],
                },
            },
        ],
    },
]

export default RELIGION_DATA
