/*
------------------------------------------------------------
PlayerStatus.tsx
Gère l’affichage des statuts actifs sur un joueur, les animations/sons de nouveaux statuts et l’ouverture du panneau détaillé.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useState, useEffect } from 'react'
import { ImageBackground, StyleSheet, StyleProp, ViewStyle, Pressable, Modal, TouchableWithoutFeedback, View } from 'react-native'
import commonStyles from '../../theme/styles'
import { PlayerPanelProps } from './PlayerPanel'
import { useGameStore } from '@/service/gameStore'
import { SPRITESHEET, UI_IMAGES } from '@/assets/images/imageData'
import { widthProportion, enumLength, STATUS_TO_ICON } from '@/service/utils'
import { ICON_TYPE, STATUS_EFFECT, StatusEffect, SOCKET_EVENT, Animation, ANIM_NAME, GAME_EFFECT } from '@/common/types'
import Sprite from '../Sprite'
import StatusPanel from './StatusPanel'
import { addCallback, removeCallback } from '@/service/gameCommand'
import { SFX } from '@/assets/audio/audioData'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import Wiggle from '../animation/Wiggle'

const ANIM_DURATION = 1200
const ANIM_ROTATION = 5

const getStatusPosition = (status: StatusEffect): StyleProp<ViewStyle> => {
  switch (status.type) {
    case STATUS_EFFECT.FROST:
      return { bottom: '8%', right: '9%' }
    case STATUS_EFFECT.POISON:
      return { top: '0.5%', left: '31.5%' }
    case STATUS_EFFECT.FIRE:
      return { top: '18%', left: '69%' }
    case STATUS_EFFECT.BLESS:
      return { top: '35%', left: '35.5%' }
    case STATUS_EFFECT.BLIND:
      return { top: '28%', left: '0%' }
  }
}

const soundEffects: Partial<Record<GAME_EFFECT, number>> = {
  [GAME_EFFECT.BLESS]: SFX['bless'],
  [GAME_EFFECT.POISON]: SFX['poison'],
  [GAME_EFFECT.FROST]: SFX['frost'],
  [GAME_EFFECT.FIRE]: SFX['fire'],
  [GAME_EFFECT.BLIND]: SFX['blind'],
};

const PlayerStatus: FC<PlayerPanelProps> = ({playerId}) => {
  const audioPlayer: AudioPlayer = useAudioPlayer()
  const status: StatusEffect[] = useGameStore((s) => s.gameState?.players?.[playerId]?.activeStatus) ?? []
  const [activeStatus, setActiveStatus] = useState<StatusEffect[]>(status)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)

  
  const playSFX = (sfx: number) => {
    audioPlayer.replace(sfx)
    audioPlayer.seekTo(0)
    audioPlayer.play()
  }
  const handleAnimation = (animation: Animation) => {
    if (animation.target == playerId && (animation.name == ANIM_NAME.STATUS || animation.name == ANIM_NAME.BLESS)) {
        setActive(true)
        playSFX(soundEffects[animation.type])
        setTimeout(() => {
          setActive(false)
          setActiveStatus(animation.statusEffects)
        }, ANIM_DURATION)
    }
  }

  
  useEffect(() => {
      addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
      return () => removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
    })
  
  useEffect(() => {
    setActiveStatus(status)
  }, [status])

  return (
  <>
    <Wiggle
      active={active}
      rotation={ANIM_ROTATION}
    >
      <Pressable 
        onPress={() => setIsMenuOpen(true)}
        style={({pressed}) => [
          pressed && commonStyles.pressed,
          styles.background
        ]}
      >
        <ImageBackground
          source={UI_IMAGES['status']}
          style={styles.background}
        >
          {activeStatus.map((s, i) => (
            <Sprite
              key={s.type}
              source={SPRITESHEET['icon']}
              frameIndex={STATUS_TO_ICON[s.type]}                  
              totalFrames={ enumLength(ICON_TYPE) }
              size={{ width: widthProportion(6), height: widthProportion(6) }}
              style={[ styles.status, getStatusPosition(s)]}
            />
          ))}
        </ImageBackground>
      </Pressable>
    </Wiggle>

    <Modal transparent visible={isMenuOpen} animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
      <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={[styles.menuContainer, {top: '10%'}]}>
        <StatusPanel playerId={playerId} />
      </View>
    </Modal>
  </>
  )
}

const styles = StyleSheet.create({
  background: {
    width: widthProportion(20),
    aspectRatio: 1,
    position: 'relative',
  },
  status: {
    position: 'absolute',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  menuContainer: {
    ...commonStyles.popUpMenu,
  },
})

export default PlayerStatus
