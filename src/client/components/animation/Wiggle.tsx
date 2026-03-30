/*
------------------------------------------------------------
Wiggle.tsx
Applique une oscillation de rotation continue pour attirer l’attention sur un élément.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React, { FC, useEffect } from "react"
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"

export interface WiggleProps {
  children: React.ReactNode
  active?: boolean
  rotation?: number
}

const Wiggle: FC<WiggleProps> = ({ children, active = true, rotation=1 }: WiggleProps) => {
  const rotate= useSharedValue<number>(0)

  useEffect(() => {
    if (active) {
      rotate.value = withRepeat(
        withSequence(
              withTiming( rotation, { duration: 150 }),
              withTiming(-rotation, { duration: 150 }),
              withTiming( 0, { duration: 150 })
            ),
        -1,
        true 
      );
    } else {
      cancelAnimation(rotate);
      rotate.value = withTiming(0, { duration: 200 })
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
      transform: [
        { rotate: `${rotate.value}deg` },
      ],
  }));

  return <Animated.View style={style}>{children}</Animated.View>
}

export default Wiggle
