/*
------------------------------------------------------------
EnchantUI.tsx
Indique le nombre de relances ou dés enchantés restants avec une animation d’impulsion.
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
import { SOCKET_EVENT, ANIM_NAME, Animation, GAME_EFFECT } from '@/common/types'
import { addCallback, removeCallback } from '@/service/gameCommand'

const GROW_DURATION: number = 800

const EnchantUI: FC<PlayerPanelProps> = ({playerId, value}) => {
  const [active, setActive] = useState<boolean>(false)
  const [uiValue, setUiValue] = useState<number>(value)
  const [negative, setNegative] = useState<boolean>(false)



  const handleAnimation = (animation: Animation) => {
    if (animation.target == playerId && (animation.name == ANIM_NAME.CHANGE_ENCHANT)) {
      setActive(true)
      setNegative(animation.power < 0)
      setTimeout(() => {
        setActive(false)
        setUiValue(animation.newValue)
        setNegative(false)
      }, GROW_DURATION)
    }
  }

  useEffect(() => {
      addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
      return () => removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
    })
    
    useEffect(() => {
      setUiValue(value)
    }, [value])

  if (value == undefined) return null

  return (
    <Pulse 
      style={[commonStyles.horizontalContainer, {gap: widthProportion(1)}]}
      active={active}
      duration={GROW_DURATION}
      scaling={negative ? 0.8 : 1.5}
    >
      <Text style={styles.text}>{uiValue}</Text>
      <Image
        source={UI_IMAGES['enchant']}
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
})

export default EnchantUI

