/*
------------------------------------------------------------
imageData.ts
Catalogue des ressources graphiques (fonds, artefacts, avatars, UI) adressées par identifiant pour le rendu client.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { ImageSourcePropType } from 'react-native';

export const BACKGROUND_IMAGES: Record<number, ImageSourcePropType> = {
  0: require('@/assets/images/backgrounds/default.png'),
  1: require('@/assets/images/backgrounds/norse.png'),
  2: require('@/assets/images/backgrounds/greek.png'),
  3: require('@/assets/images/backgrounds/egyptian.png'),
  4: require('@/assets/images/backgrounds/chinese.png'),
};

export const ARTIFACT_IMAGES: Record<number, ImageSourcePropType> = {
  0: require('@/assets/images/artifacts/default.png'),
  1: require('@/assets/images/artifacts/freya.png'),
  2: require('@/assets/images/artifacts/heimdall.png'),
  3: require('@/assets/images/artifacts/tyr.png'),
  4: require('@/assets/images/artifacts/odin.png'),
  5: require('@/assets/images/artifacts/thor.png'),
  6: require('@/assets/images/artifacts/hermes.png'),
  7: require('@/assets/images/artifacts/nemesis.png'),
  8: require('@/assets/images/artifacts/apollo.png'),
  9: require('@/assets/images/artifacts/persephone.png'),
  10: require('@/assets/images/artifacts/thanathos.png'),
  11: require('@/assets/images/artifacts/bastet.png'),
  12: require('@/assets/images/artifacts/osiris.png'),
  13: require('@/assets/images/artifacts/seth.png'),
  14: require('@/assets/images/artifacts/horus.png'),
  15: require('@/assets/images/artifacts/thoth.png'),
  16: require('@/assets/images/artifacts/zhurong.png'),
  17: require('@/assets/images/artifacts/wukong.png'),
  18: require('@/assets/images/artifacts/zhong.png'),
  19: require('@/assets/images/artifacts/nezha.png'),
  20: require('@/assets/images/artifacts/ao.png'),
};

export const SCROLL_IMAGES: Record<number, ImageSourcePropType> = {
  1: require('@/assets/images/scrolls/norse.png'),
  2: require('@/assets/images/scrolls/greek.png'),
  3: require('@/assets/images/scrolls/egyptian.png'),
  4: require('@/assets/images/scrolls/chinese.png'),
  5: require('@/assets/images/scrolls/hindu.png'),
  6: require('@/assets/images/scrolls/mayan.png'),
}


export const GOD_IMAGES: Record<number, ImageSourcePropType> = {
  0: require('@/assets/images/gods/ymir.png'),
  1: require('@/assets/images/gods/loki.png'),
  2: require('@/assets/images/gods/odin.png'),
  3: require('@/assets/images/gods/aphrodite.png'),
  4: require('@/assets/images/gods/hades.png'),
  5: require('@/assets/images/gods/medusa.png'),
  6: require('@/assets/images/gods/isis.png'),
  7: require('@/assets/images/gods/sobek.png'),
  8: require('@/assets/images/gods/ra.png'),
  9: require('@/assets/images/gods/zhu.png'),
  10: require('@/assets/images/gods/chang.png'),
  11: require('@/assets/images/gods/nu-wa.png'),
}

export const UI_IMAGES: Record<string, ImageSourcePropType> ={
  'title': require('@/assets/images/UI/title.png'),
  'trophy': require('@/assets/images/UI/trophy.png'),
  'prayer_cost': require('@/assets/images/UI/prayer_cost.png'),
  'heart': require('@/assets/images/UI/heart.png'),
  'shield': require('@/assets/images/UI/shield.png'),
  'shields': require('@/assets/images/UI/shields.png'),
  'countdown': require('@/assets/images/UI/countdown.png'),
  'cooldown': require('@/assets/images/UI/cooldown.png'),
  'status': require('@/assets/images/UI/status.png'),
  'prayer': require('@/assets/images/UI/prayer.png'),
  'prayerE': require('@/assets/images/UI/prayerE.png'),
  'dice': require('@/assets/images/UI/dice.png'),
  'timer': require('@/assets/images/UI/timer.png'),
  'reroll': require('@/assets/images/UI/reroll.png'),
  'enchant': require('@/assets/images/UI/enchant.png'),
  'deck': require('@/assets/images/UI/deck.png'),
  'stats': require('@/assets/images/UI/stats.png'),
  'swords': require('@/assets/images/UI/swords.png'),
  'surrender': require('@/assets/images/UI/surrender.png'),
}

export const AVATAR_IMAGES: Record<number, ImageSourcePropType> = {
  1: require('@/assets/images/avatars/norse.png'),
  2: require('@/assets/images/avatars/greek.png'),
  3: require('@/assets/images/avatars/egyptian.png'),
  4: require('@/assets/images/avatars/chinese.png'),
  5: require('@/assets/images/avatars/hindu.png'),
  6: require('@/assets/images/avatars/mayan.png'),
}

export const RELIGION_IMAGES: Record<number, ImageSourcePropType> = {
  1: require('@/assets/images/religions/norse.png'),
  2: require('@/assets/images/religions/greek.png'),
  3: require('@/assets/images/religions/egyptian.png'),
  4: require('@/assets/images/religions/chinese.png'),
  5: require('@/assets/images/religions/hindu.png'),
  6: require('@/assets/images/religions/mayan.png'),
}

export const SPRITESHEET: Record<string, ImageSourcePropType> ={
  'dice': require('@/assets/images/spritesheets/dice.png'),
  'digit': require('@/assets/images/spritesheets/digits.png'),
  'icon': require('@/assets/images/spritesheets/icons.png'),
}
