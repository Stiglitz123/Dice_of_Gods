/*
------------------------------------------------------------
GodWidget.tsx
Widget présentant un dieu (portrait, coût en prière, nom, séquence d’effets) avec interactions éventuelles.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React from "react"
import { View, Text, ImageBackground, StyleSheet, Pressable, StyleProp, ViewStyle } from "react-native"
import Number from "./Number"
import EffectSequence from "./EffectSequence"
import { GOD_IMAGES, UI_IMAGES } from "@/assets/images/imageData"
import { getAdaptiveFontSize, widthProportion } from "@/service/utils"
import { colors, fontSize, fonts } from "@/theme/theme"
import { GodData } from "@/common/types"
import commonStyles from "@/theme/styles"

export interface GodWidgetProps {
  data: GodData
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  nameShown?: boolean 
  onPress?: () => void
}

export interface GodPortraitProps {
  data: GodData
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  numberSize?: number
  onPress?: () => void
}
export const GodPortrait: React.FC<GodPortraitProps> = ({data, disabled=true, style, numberSize=6, onPress}) => {
  
  return (
    <Pressable 
      style={({ pressed }) => [
        {...commonStyles.centeredContainer},
        style,
        pressed && commonStyles.pressed,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <ImageBackground
        source={GOD_IMAGES[data.id]}
        style={styles.image}
        resizeMode="cover"
      />
      <ImageBackground
        source={UI_IMAGES['prayer_cost']}
        style={styles.cost}
        resizeMode="contain"
      >
        <Number 
          value={data.cost} 
          size={widthProportion(numberSize)}
          style={styles.costNumber}
        />
      </ImageBackground>
    </Pressable>
  )
}

const GodWidget: React.FC<GodWidgetProps> = ({ data, style, disabled, nameShown = true, onPress }) => {
  const nameFontSize = getAdaptiveFontSize(data.name, fontSize.godName)
  return (
    <Pressable 
      style={[styles.widget, style]}
      disabled={disabled}
      onPress={onPress}
    >
      <GodPortrait 
        data={data}
        style={styles.leftPart}
      />

      <View style={styles.rightPart}>
        {nameShown &&
          <Text 
            style={[styles.name, {fontSize: nameFontSize}]}
            adjustsFontSizeToFit={true}
            >{data.name}
          </Text>
        }
          <EffectSequence
            icons={data.effectSequence.iconSequence}
            iconSize={data.effectSequence.iconSequence.length > 5 ? widthProportion(10): widthProportion(12)}
          />

      </View>
    </Pressable>
  )
}
 const styles = StyleSheet.create({
  widget: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f0e8",
    borderRadius: 15,
    elevation: 3,
    borderWidth: 2,
    borderColor: colors.dark + '80',
    gap: 20,
    ...commonStyles.padding
  },

  leftPart: {
    width: '25%',           
  },
  
  rightPart: {
    flex: 1,              
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: 'center',
  },


  image: {
    width: "100%",
    aspectRatio: 1,          
    borderRadius: 100,       
    borderWidth: 4,
    borderColor: "black",
    position: "relative",                
  },

  cost: {
    display: 'flex',
    position: "absolute",
    bottom: "-20%",            
    right: "-35%",
    width: "80%",             
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: 'visible',
  },

  costNumber: {
    marginRight: widthProportion(3)
  },

  name: {
    flex: 1,                  
    justifyContent: "center",
    color: "#000",
    fontFamily: fonts.ravenholm,
  },

  effectSection: {
    flex: 2,             
    justifyContent: "center",
  },

})

export default GodWidget
