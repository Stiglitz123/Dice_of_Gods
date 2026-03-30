/*
------------------------------------------------------------
Number.tsx
Affiche un nombre via spritesheet de chiffres avec gestion du signe et du redimensionnement.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { SPRITESHEET } from "@/assets/images/imageData"
import commonStyles from "@/theme/styles"
import { View, Image, ViewStyle, StyleProp, ImageStyle } from "react-native"

interface NumberProps {
  value: number
  size?: number 
  style?: StyleProp<ViewStyle>
  digitStyle?: StyleProp<ImageStyle>
}

export default function Number({ value, size = 100, style, digitStyle }: NumberProps) {
  const FRAME_WIDTH = 100 
  const SPRITE_COUNT = 11  
  const SPRITE_WIDTH = FRAME_WIDTH * SPRITE_COUNT

  let digits: number[] = []
  
  if (value < 0) {
    digits = [10, Math.abs(value)]   // "-" + digit
  } else if (value < 10) {
    digits = [value]
  } else {
    digits = [Math.floor(value / 10), value % 10]
  }
  const digitSize = digits.length != 2 ? size : size * 0.85
  const scale = digitSize / FRAME_WIDTH

  return (
    <View
      style={[{
        width: size,
        height: size,
        flexDirection: 'row',
        ...commonStyles.centeredContainer,
        // overflow: "hidden",
      },
      style
    ]}
    >
      {digits.map((digit, i) => (
        <View
          key={i}
          style={{
            
            width: digitSize,
            height: size,
            overflow: "hidden",
            marginLeft: digits.length == 2 ? '-20%' : undefined
          }}
        >
          <Image
            source={SPRITESHEET["digit"]}
            resizeMode="cover"
            style={[
              digitStyle,
              {
              width: SPRITE_WIDTH * scale,
              height: digitSize,
              transform: [{ translateX: -digit * FRAME_WIDTH * scale }], 
              },
          ]}
          />
        </View>
      ))}
    </View>
  )
}
