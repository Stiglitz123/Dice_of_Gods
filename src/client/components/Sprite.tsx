/*
------------------------------------------------------------
Sprite.tsx
Affiche une frame d’un spritesheet avec éventuelle superposition d’enfants (icônes ou textes).
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React, { ReactNode } from "react"
import { Size } from "@/assets/types"
import { View, ImageSourcePropType, ViewStyle, StyleProp } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"

export interface SpriteProps {
  source: ImageSourcePropType
  frameIndex: number
  totalFrames: number
  size: Size
  style?: StyleProp<ViewStyle>
  tint?: string
  children?: ReactNode
}

const Sprite: React.FC<SpriteProps> = ({
  source,
  frameIndex,
  totalFrames,
  size,
  style,
  tint,
  children,
}) => {

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -frameIndex * size.width }],
  }))

  return (
    <View
      style={[
        {
          width: size.width,
          height: size.height,
          overflow: "hidden",
          position: "relative",
        },
        style,
      ]}
    >
      <Animated.Image
        source={source}
        resizeMode="contain"
        style={[
          animatedStyle,
          {
            width: size.width * totalFrames,
            height: size.height,
            tintColor: tint ?? undefined,
          },
        ]}
      />

      {/* Overlays (symbole, texte, etc.) dans le repère du sprite */}
      {children && (
        <View style={{ position: "absolute", inset: 0 }}>
          {children}
        </View>
      )}
    </View>
  )
}

export default Sprite
