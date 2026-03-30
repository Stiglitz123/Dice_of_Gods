/*
------------------------------------------------------------
audioData.ts
Liste des effets sonores et musiques de fond requis par l’interface de jeu.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
export const SFX: Record<string, number> = {
  attack: require('@/assets/audio/sfx/attack.wav'),
  roll: require('@/assets/audio/sfx/roll.wav'),
  deep: require('@/assets/audio/sfx/deep.wav'),
  lock: require('@/assets/audio/sfx/lock.wav'),
  page: require('@/assets/audio/sfx/page.wav'),
  dice_pick: require('@/assets/audio/sfx/dice_pick.wav'),
  card_pick: require('@/assets/audio/sfx/card_pick.wav'),
  artifact_change: require('@/assets/audio/sfx/artifact_change.wav'),
  religion_change: require('@/assets/audio/sfx/religion_change.wav'),
  cancel: require('@/assets/audio/sfx/cancel.wav'),
  select: require('@/assets/audio/sfx/select.wav'),
  pierce: require('@/assets/audio/sfx/pierce.wav'),
  heal: require('@/assets/audio/sfx/heal.wav'),
  guard: require('@/assets/audio/sfx/guard.wav'),
  shield: require('@/assets/audio/sfx/shield.wav'),
  bless: require('@/assets/audio/sfx/bless.wav'),
  poison: require('@/assets/audio/sfx/poison.wav'),
  blind: require('@/assets/audio/sfx/blind.wav'),
  fire: require('@/assets/audio/sfx/fire.wav'),
  frost: require('@/assets/audio/sfx/frost.wav'),
  prayer: require('@/assets/audio/sfx/prayer.wav'),
  enchant: require('@/assets/audio/sfx/enchant.wav'),
}

export const BGM: Record<string, number> = {
  menu: require('@/assets/audio/bgm/menu.mp3'),
  game: require('@/assets/audio/bgm/game.mp3'),
}
