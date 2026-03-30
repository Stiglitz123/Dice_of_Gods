/*
------------------------------------------------------------
Float.tsx
Animation de flottement vertical répétée pour mettre en relief des éléments interactifs.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React, { FC, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing, cancelAnimation,} from "react-native-reanimated";

export interface FloatProps {
  children: React.ReactNode
  distance?: number
  duration?: number
  active?: boolean
  scale?: number
  style?: StyleProp<ViewStyle>
}

const Float: FC<FloatProps> = ({
  children,
  distance = 6,
  duration = 1600,
  active = true,
  style
}) => {
  const offset = useSharedValue<number>(0);

  useEffect(() => {
    if (active) {
      offset.value = withRepeat(
        withTiming(distance, {
          duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );
    }
    else {
      cancelAnimation(offset)
    }

  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: offset.value },
    ],
  }));

  return (
    <Animated.View style={[
      animatedStyle,
      style,
    ]}
    >
      {children}
    </Animated.View>
  )
};

export default Float;
