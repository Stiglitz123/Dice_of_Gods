/*
------------------------------------------------------------
utils.ts
Fonctions utilitaires pour les proportions d’écran, tailles de police adaptatives et génération de séquences d’icônes d’effets/status.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { GAME_EFFECT, ICON_TYPE, STATUS_EFFECT, EFFECT_SEQUENCE_TYPE, Icon, Effect, EffectSequence } from '@/common/types'
import { Dimensions } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

const { width, height } = Dimensions.get('window')

export const EFFECT_TO_ICON: Partial<Record<GAME_EFFECT, ICON_TYPE>> = {
    [GAME_EFFECT.ATTACK]: ICON_TYPE.ATTACK,
    [GAME_EFFECT.PIERCE]: ICON_TYPE.PIERCE,
    [GAME_EFFECT.SHIELD]: ICON_TYPE.SHIELD,
    [GAME_EFFECT.HEAL]: ICON_TYPE.HEAL,
    [GAME_EFFECT.PRAYER]: ICON_TYPE.PRAYER,
    [GAME_EFFECT.ENCHANT]: ICON_TYPE.ENCHANT,
    [GAME_EFFECT.FROST]: ICON_TYPE.FROST,
    [GAME_EFFECT.POISON]: ICON_TYPE.POISON,
    [GAME_EFFECT.BLIND]: ICON_TYPE.BLIND,
    [GAME_EFFECT.FIRE]: ICON_TYPE.FIRE,
    [GAME_EFFECT.BLESS]: ICON_TYPE.BLESS,
};

export const STATUS_TO_ICON: Record<STATUS_EFFECT, ICON_TYPE> = {
    [STATUS_EFFECT.FROST]: ICON_TYPE.FROST,
    [STATUS_EFFECT.POISON]: ICON_TYPE.POISON,
    [STATUS_EFFECT.BLIND]: ICON_TYPE.BLIND,
    [STATUS_EFFECT.FIRE]: ICON_TYPE.FIRE,
    [STATUS_EFFECT.BLESS]: ICON_TYPE.BLESS,
};

export const generateIconSequence = (sequence: EffectSequence): Icon[] => {
    let iconSequence: Icon[] = []
    if (sequence.type === EFFECT_SEQUENCE_TYPE.CONDITIONAL) {
      iconSequence.push({type: EFFECT_TO_ICON[sequence.condition.type], potency: sequence.condition.potency})
      iconSequence.push({type: ICON_TYPE.ARROW})
    }
    for (let i = 0; i < sequence.effects.length; i++) {
      const effect: Effect = sequence.effects[i];
      if (!effect.iconHidden) { 
        iconSequence.push({type: EFFECT_TO_ICON[effect.type], potency: effect.potency})
      }
      if (sequence.effects.length > i + 1) {
        iconSequence.push({type: ICON_TYPE.PLUS})
      }
    }
    if (sequence.type === EFFECT_SEQUENCE_TYPE.STATUS) {
      iconSequence.push({type: ICON_TYPE.OPEN})
      // iconSequence.push({type: ICON_TYPE.DOTS})
      iconSequence.push(...generateIconSequence(sequence.statusEffectSequence))
      iconSequence.push({type: STATUS_TO_ICON[sequence.status], isStatus: true})
      iconSequence.push({type: ICON_TYPE.CLOSE})
    }
    return iconSequence
  }

export const enumLength = (enumObj: object): number => {
  return Object.keys(enumObj).filter(key => isNaN(Number(key))).length
}


export const widthProportion = (percentage : number): number => {
    percentage = Math.min(100, Math.max(0, percentage))
    return width * (percentage/100)
}

export const heightProportion = (percentage : number): number => {
    percentage = Math.min(100, Math.max(0, percentage))
    return height * (percentage/100)
}

export const getAdaptiveFontSize = (text: string, baseSize = RFValue(15)) => {
  if (text.length < 8) return baseSize
  if (text.length < 10) return baseSize * 0.9;
  if (text.length < 20) return baseSize * 0.8;
  if (text.length < 30) return baseSize * 0.7;
  return baseSize * 0.4;
}
