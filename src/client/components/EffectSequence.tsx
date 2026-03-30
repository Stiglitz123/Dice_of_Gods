/*
------------------------------------------------------------
EffectSequence.tsx
Rendu d’une séquence d’icônes d’effets avec leur puissance, pour artefacts, dés ou compétences.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from "react"
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native"
import Sprite from "@/components/Sprite"
import Number from "@/components/Number"
import { Icon, ICON_TYPE } from "@/common/types"
import { enumLength, widthProportion } from "@/service/utils"
import { SPRITESHEET } from "@/assets/images/imageData"


export interface EffectSequenceProps {
  icons: Icon[]
  iconSize?: number 
  tint?: string
  style?: StyleProp<ViewStyle>

}

const EffectSequence: FC<EffectSequenceProps> = ({
  icons,
  iconSize = widthProportion(11),
  tint,
  style,
}) => {
  return (
    <View style={[styles.row, style]}>
      {icons?.map((icon, index) => (
        <View key={index} style={styles.iconContainer}>
          <Sprite
            source={SPRITESHEET['icon']}
            frameIndex={icon.type}                  
            totalFrames={ enumLength(ICON_TYPE) }
            size={{ width: iconSize, height: iconSize }}
            style={[
              {
                marginHorizontal: -iconSize * 0.05,
                top: icon.isStatus ? -iconSize * 0.25 : undefined
              },
              icon.type == ICON_TYPE.CLOSE && styles.closeIcon,
              icon.type == ICON_TYPE.OPEN && styles.openIcon,
              icon.isStatus && styles.statusIcon
            ]}
            tint={icon.type >= ICON_TYPE.ARROW ? tint : undefined}
          >
            {icon.type <= ICON_TYPE.ENCHANT && (
              <Number
                value={icon.potency}
                size={iconSize * 0.5}             
                style={icon.type == ICON_TYPE.HEAL || icon.type == ICON_TYPE.SHIELD ? styles.centeredPotency: styles.potency}
              />
            )}
          </Sprite>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  potency: {
    position: "absolute",
    right: "-3%",
    bottom: "2%",
  },
  centeredPotency: {
    position: "absolute",
    right: "23%",
    bottom: "23%",
  },
  statusIcon: {
    transform: [{scale: 0.6}],
    position: 'relative',
  },
  closeIcon: {
    marginHorizontal: '-7%',
  },
  openIcon: {
    marginRight: '-5%',
  },
})

export default EffectSequence
