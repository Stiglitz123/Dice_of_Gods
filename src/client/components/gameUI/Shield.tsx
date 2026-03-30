/*
------------------------------------------------------------
Shield.tsx
Affiche les points de bouclier, écoute les animations de dégâts/bonus et joue les sons/animations associés.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, Image, StyleProp, ImageStyle } from 'react-native'
import commonStyles from '../../theme/styles'
import { PlayerPanelProps } from './PlayerPanel'
import { UI_IMAGES } from '@/assets/images/imageData'
import { widthProportion } from '@/service/utils'
import Pulse from '../animation/Pulse'
import FloatingNumber from '../animation/FloatingNumber'
import { SFX } from '@/assets/audio/audioData'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { ANIM_NAME, Animation, SOCKET_EVENT } from '@/common/types'
import { addCallback, removeCallback } from '@/service/gameCommand'

const ATTACK_DURATION = 300
const SHIELD_DURATION = 400
const HURT_SCALING = 0.7
const SHIELD_SCALING = 1.2

const getShieldPosition = (index: number): StyleProp<ImageStyle> => {

  switch (index) {
    case 0:
      return { top: '16%', left: '14%' }
    case 1:
      return { top: '16%', left: '47%' }
    case 2:
      return { top: '53%', left: '30%' }
  }
}
      
      
const Shield: FC<PlayerPanelProps> = ({playerId, value}) => {
  const audioPlayer: AudioPlayer = useAudioPlayer()
  const [shield, setShield] = useState<number>(value)
  const [hurt, setHurt] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const [floatingNumber, setFloatingNumber] = useState<{ id: number, value: number } | null>(null)

  const playSFX = (sfx: number) => {
    audioPlayer.replace(sfx)
    audioPlayer.seekTo(0)
    audioPlayer.play()
  }
  const triggerFloatingNumber = (value: number) => {
    setFloatingNumber((prev) => ({ id: (prev?.id ?? 0) + 1, value }))
  }

const handleAnimation = (animation: Animation) => {
  if (animation.target == playerId && animation.name == ANIM_NAME.SHIELD_DMG) {
      triggerFloatingNumber(-animation.power)
      setHurt(true)
      setActive(true)
      playSFX(SFX['guard'])
      setTimeout(() => {
        setActive(false)
        setShield(animation.newValue)
      }, ATTACK_DURATION)
  }
  else if (animation.target == playerId && animation.name == ANIM_NAME.SHIELD) {
      triggerFloatingNumber(animation.power)
      setHurt(true)
      setActive(true)
      playSFX(SFX['shield'])
      setTimeout(() => {
        setShield(animation.newValue)
        setActive(false)
      }, SHIELD_DURATION)
  }
}

useEffect(() => {
  addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
  return () => removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
})

useEffect(() => {
  setShield(value)
}
, [value])


        
  if (value == undefined) return null

  return (
  <Pulse
    scaling={hurt? HURT_SCALING : SHIELD_SCALING}
    duration={hurt? ATTACK_DURATION : SHIELD_DURATION}
    active={active}
    style={styles.container}
  >
    {floatingNumber && (
        <FloatingNumber
          key={floatingNumber.id}
          value={floatingNumber.value}
          distance={widthProportion(6)}
          size={widthProportion(8)}
          style={styles.floatingNumber}
          onFinish={() => setFloatingNumber(null)}
        />
    )}
    <ImageBackground
      source={UI_IMAGES['shields']}
      style={styles.background}
    >
      {Array.from({ length: shield }).map((_, i) => (
        <Image
          key={i}
          source={UI_IMAGES['shield']}
          style={[styles.shield, getShieldPosition(i)]}
          resizeMode="contain"
        />
      ))}
    </ImageBackground>
  </Pulse>

  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
    ...commonStyles.centeredContainer
  },
  background: {
    width: widthProportion(20),
    aspectRatio: 1,
    position: 'relative',
  },
  shield: {
    width: widthProportion(7),
    height: widthProportion(7),
    aspectRatio: 1,
    position: 'absolute',
  },
  floatingNumber: {
    position: 'absolute',
    top: widthProportion(1),
    right: -widthProportion(3),
    zIndex: 100000,
  },
})

export default Shield
