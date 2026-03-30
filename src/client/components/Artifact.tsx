/*
------------------------------------------------------------
Artifact.tsx
Affiche un artefact avec icônes d’effets, coût en dés, symbole de religion et cooldown interactif.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import {FC} from "react"
import { Text, Pressable, ImageBackground, StyleProp, ViewStyle, View, Image, StyleSheet } from "react-native"
import { colors, fonts, religionColors, spriteData } from "@/theme/theme"
import commonStyles from "@/theme/styles"
import { getAdaptiveFontSize, heightProportion, widthProportion } from "@/service/utils"
import { fontSize, size } from "@/theme/theme"
import { ARTIFACT_IMAGES, RELIGION_IMAGES, SPRITESHEET, UI_IMAGES } from "@/assets/images/imageData"
import { ArtifactData } from "@/common/types"
import EffectSequence from "./EffectSequence"
import Number from "./Number"
import Sprite from "./Sprite"

export interface ArtifactProps {
  data: ArtifactData
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  onPress?: () => void
  countdown?: number
}

const Artifact: FC<ArtifactProps> = ({
  data,
  style,
  disabled = false,
  onPress,
  countdown,
}) => {

  const nameFontSize = getAdaptiveFontSize(data.name, fontSize.artifactName)

  return (
    <Pressable
      style={({ pressed }) =>[
        styles.container,
        style,
        pressed && {...commonStyles.dim},
      ]}
      disabled={disabled}
      onPress={onPress}   
    >
      <ImageBackground
        source={ARTIFACT_IMAGES[data.id]}
        style={styles.background}
        resizeMode="contain"
      >

        <View style={styles.symbol}>
          <Image
            source={RELIGION_IMAGES[data.religion]}
            resizeMode='contain'
            style={commonStyles.cover}
          />
        </View>
        <Text
          style={[
            styles.name,
            commonStyles.smallTextShadow,
            {
              color: religionColors[data.religion],
              fontSize: nameFontSize,
            },
          ]}
        >
          {data.name}
        </Text>
        <View style={styles.sequenceContainer}>
          <EffectSequence
            icons={data.effectSequence.iconSequence}
            iconSize={data.effectSequence.iconSequence.length > 4 ? widthProportion(5) : widthProportion(6)}
            tint={colors.light}
          />
        </View>
        <ImageBackground
          source={countdown ? UI_IMAGES['countdown'] : UI_IMAGES['cooldown']}
          style={styles.cooldown}
        >
          <Number
            value={countdown == 0 || countdown == undefined ? data.cooldown : countdown}
            size={widthProportion(5)}
          />  
        </ImageBackground>
        <View style={styles.diceCombo}>
          {data.diceCost.map((face: number, i) => {
            return (
              <Sprite
                key={i}
                source={SPRITESHEET['dice']}
                totalFrames={spriteData.diceNumber}
                frameIndex={spriteData.diceRollNumber + face}
                size={{width: widthProportion(7), height: widthProportion(7)}}
              />
            )
          })}
        </View>

      </ImageBackground>
    </Pressable>
  )
}

export default Artifact

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1.5
    },
    background: {
        flex: 1,
        position: 'relative',
    },
    name: {
        position: 'absolute',
        top: heightProportion(0.5),
        left: widthProportion(8),
        fontFamily: fonts.ravenholm,
    },
    symbol: {
        position: 'absolute',
        top: heightProportion(0.7),
        left: widthProportion(2),
        width: size.divineSymbol,
        height: size.divineSymbol,
    },
    sequenceContainer: {
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      position: 'absolute',
      left: '1.5%',
      top: '25%',
      backgroundColor: colors.dark,
      paddingHorizontal: '3%',
      paddingVertical: '1%',
      borderColor: 'black',
      borderWidth: 2,
      borderLeftWidth: 0,
    },
    cooldown: {
      position: 'absolute',
      bottom: '3%',
      left: '2%',
      width: widthProportion(8),
      aspectRatio: 1,
      ...commonStyles.centeredContainer
    },
    diceCombo: {
      ...commonStyles.horizontalContainer,
      position: 'absolute',
      bottom: '3%',
      right: '3%',
      justifyContent: 'flex-end',
    },
    
})
