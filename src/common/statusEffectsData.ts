//----------------------------------------
// statusEffectsData.ts
// Catalogue des effets de statut (nom, description, type) consommé par le client et aligné sur les enums communs.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import { STATUS_EFFECT, StatusEffectData } from "./types"



export const statusEffectInfo: StatusEffectData[] = [
    {
        name: 'Bénédiction',
        description: "Réduit de 1 la durée de tous les autres effets divins actifs sur le joueur.\nSi aucun autre effet est actif, gagner 1 dé enchanté",
        type:  STATUS_EFFECT.BLESS
    },
    {
        name: 'Poison',
        description: 'Perdre 1 point de vie',
        type:  STATUS_EFFECT.POISON
    },
    {
        name: 'Brûlure',
        description: 'Perdre 2 boucliers',
        type:  STATUS_EFFECT.FIRE
    },
    {
        name: 'Gel',
        description: 'Ajouter 1 temps de recharge sur un artefact aléatoire',
        type:  STATUS_EFFECT.FROST
    },
    {
        name: 'Aveuglement',
        description: 'Perdre 1 jet de relance de dés lors de la phase de roulement',
        type:  STATUS_EFFECT.BLIND
    },
]
