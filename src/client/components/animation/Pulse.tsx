/*
------------------------------------------------------------
Pulse.tsx
Animation de pulsation continue ou réinitialisable pour mettre en avant des éléments UI.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React, { FC, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  withDelay
} from "react-native-reanimated";

export interface PulseProps {
  children: React.ReactNode;
  delay?: number
  scaling?: number;
  duration?: number;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Pulse: FC<PulseProps> = ({
  children,
  delay = 0,
  scaling = 1.1,
  duration = 1200,
  active = true,
  style,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      withDelay(delay,
        scale.value = withRepeat(
          withTiming(scaling, {
            duration,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true 
        )
      )
    } 
    else {
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 200 })
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default Pulse;
