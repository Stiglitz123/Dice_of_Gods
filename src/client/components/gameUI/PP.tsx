/*
------------------------------------------------------------
PP.tsx
Affiche et anime les points de prière d’un joueur lorsqu’ils sont gagnés via les animations serveur.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect, useState, } from 'react'
import { Text, StyleSheet, Image } from 'react-native'
import commonStyles from '../../theme/styles'
import { PlayerPanelProps } from './PlayerPanel'
import { UI_IMAGES } from '@/assets/images/imageData'
import { widthProportion } from '@/service/utils'
import { colors, fonts } from '@/theme/theme'
import { RFValue } from 'react-native-responsive-fontsize'
import Pulse from '../animation/Pulse'
import { SFX } from '@/assets/audio/audioData'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { addCallback, removeCallback } from '@/service/gameCommand'
import { SOCKET_EVENT, ANIM_NAME, Animation } from '@/common/types'

const GROW_DURATION: number = 800
const GROW_SCALING: number = 1.5

const PP: FC<PlayerPanelProps> = ({playerId, value}) => {
  const audioPlayer: AudioPlayer = useAudioPlayer()
  const [active, setActive] = useState<boolean>(false)
  const [pp, setPP] = useState<number>(value)

  const playSFX = (sfx: number) => {
    audioPlayer.replace(sfx)
    audioPlayer.seekTo(0)
    audioPlayer.play()
  }



  const handleAnimation = (animation: Animation) => {
    if (animation.target == playerId){
      if (animation.name == ANIM_NAME.PRAYER || animation.name == ANIM_NAME.GOD) {
        setActive(true)
        playSFX(SFX['prayer'])
        setTimeout(() => {
          setActive(false)
          setPP(animation.newValue)
        }, GROW_DURATION)
      }
    }
  }

  useEffect(() => {
    addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
    return () => removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
  })
  
  useEffect(() => {
    setPP(value)
  }, [value])

  if (value == undefined) return null

  return (
    <Pulse 
      style={[commonStyles.horizontalContainer, {gap: widthProportion(1)}]}
      active={active}
      duration={GROW_DURATION}
      scaling={GROW_SCALING}
    >
      <Text style={styles.text}>{pp}</Text>
      <Image
        source={UI_IMAGES['prayer']}
        style={styles.image}
      />
    </Pulse>
  
  )
}


const styles = StyleSheet.create({
  image: {
    width: widthProportion(10),
    aspectRatio: 1,
  },
  text: {
    color: colors.light,
    fontFamily: fonts.number,
    fontSize: RFValue(20)
  },
  floatingNumber: {
    position: 'absolute',
    top: widthProportion(1),
    left: 0,
    zIndex: 3,
  },
})

export default PP
