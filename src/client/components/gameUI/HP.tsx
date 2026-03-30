/*
------------------------------------------------------------
HP.tsx
Suivi et animation des points de vie d’un joueur, avec chiffres flottants, sons et pulsation lors des dégâts/soins.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect, useState } from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import commonStyles from '../../theme/styles'
import { PlayerPanelProps } from './PlayerPanel'
import { UI_IMAGES } from '@/assets/images/imageData'
import { widthProportion } from '@/service/utils'
import Number from '../Number'
import Pulse from '../animation/Pulse'
import FloatingNumber from '../animation/FloatingNumber'
import { addCallback, removeCallback } from '@/service/gameCommand'
import { ANIM_NAME, Animation, GAME_EFFECT, SOCKET_EVENT } from '@/common/types'
import { SFX } from '@/assets/audio/audioData'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'

const ATTACK_DURATION = 300
const HEAL_DURATION = 400
const HURT_SCALING = 0.7
const HEAL_SCALING = 1.2

const HP: FC<PlayerPanelProps> = ({playerId, value}) => {
  const audioPlayer: AudioPlayer = useAudioPlayer()
  const [hp, setHp] = useState<number>(value)
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
    if (animation.target == playerId && animation.name == ANIM_NAME.HP_DMG) {
        triggerFloatingNumber(-animation.power)
        setHurt(true)
        setActive(true)
        playSFX(animation.type == GAME_EFFECT.ATTACK ? SFX['attack'] : SFX['pierce'])
        setTimeout(() => {
          setActive(false)
          setHp(animation.newValue)
        }, ATTACK_DURATION)
    }
    else if (animation.target == playerId && animation.name == ANIM_NAME.HEAL) {
        triggerFloatingNumber(animation.power)
        setHurt(true)
        setActive(true)
        playSFX(SFX['heal'])
        setTimeout(() => {
          setHp(animation.newValue)
          setActive(false)
        }, HEAL_DURATION)
    }
  }
  
  useEffect(() => {
    addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
    return () => removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
  })

  useEffect(() => {
  setHp(value)
}
, [value])


  if (value == undefined) return null

  return (
    <Pulse
      scaling={hurt? HURT_SCALING : HEAL_SCALING}
      duration={hurt? ATTACK_DURATION : HEAL_DURATION}
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
        source={UI_IMAGES['heart']}
        style={styles.image}
      >
        <Number
          value={hp}
          size={widthProportion(10)}
        />
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
  floatingNumber: {
    position: 'absolute',
    top: widthProportion(1),
    right: -widthProportion(3),
    zIndex: 100000,
  },
  image: {
    width: widthProportion(20),
    aspectRatio: 1,
    ...commonStyles.centeredContainer
  },
})

export default HP
