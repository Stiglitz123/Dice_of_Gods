/*
------------------------------------------------------------
FloatingNumber.tsx
Anime un nombre qui s’élève et disparaît, utilisé pour afficher des gains ou pertes temporaires.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect } from "react"
import { StyleProp, ViewStyle } from "react-native"
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import Number from "../Number"

export interface FloatingNumberProps {
  value: number
  duration?: number
  distance?: number
  size?: number
  style?: StyleProp<ViewStyle>
  onFinish?: () => void
}

const FloatingNumber: FC<FloatingNumberProps> = ({
  value,
  duration = 1000,
  distance = 30,
  size = 90,
  style,
  onFinish,
}) => {
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    translateY.value = 0
    opacity.value = 0

    translateY.value = withTiming(-distance, {
      duration,
      easing: Easing.out(Easing.cubic),
    })

    opacity.value = withSequence(
      withTiming(1, { duration: duration * 0.25, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: duration * 0.75, easing: Easing.in(Easing.quad) })
    )

    const timer = setTimeout(() => onFinish?.(), duration)

    return () => {
      clearTimeout(timer)
      cancelAnimation(translateY)
      cancelAnimation(opacity)
    }
  }, [value, distance, duration, onFinish])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Number value={value} size={size} />
    </Animated.View>
  )
}

export default FloatingNumber
