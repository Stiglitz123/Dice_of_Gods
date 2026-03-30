/*
------------------------------------------------------------
Dice.tsx
Composant d’un dé interactif: animations de roulade, verrouillage, son et envoi des commandes selon la phase de jeu.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import {useEffect, FC, Dispatch, SetStateAction, useState} from "react"
import { Pressable, StyleSheet } from "react-native"
import { scheduleOnUI } from "react-native-worklets"
import Animated, {useSharedValue, useAnimatedStyle, withTiming, withRepeat ,withSequence ,Easing} from "react-native-reanimated";
import { size } from "@/theme/theme"
import commonStyles from "@/theme/styles"
import { Animation, ANIM_NAME, Dice as DiceState, COMMAND_NAME, PHASE_NAME, SOCKET_EVENT} from "@/common/types";
import { addCallback, removeCallback, sendCommand } from "@/service/gameCommand";
import { useGameStore } from "@/service/gameStore"
import { SPRITESHEET } from "@/assets/images/imageData";
import Pulse from "../animation/Pulse";
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { SFX } from "@/assets/audio/audioData"

export interface DiceProps {
  id: number
  playerIndex: number
  selectedId?: number
  setSelected?: Dispatch<SetStateAction<number | null>>
}

const ROLL_FRAMES = 8
const ROLL_DURATION = 230
const ROLL_CYCLE = 3
const DURATION_VARIANCE = 90
const BOUNCE_DURATION = 280
const FRAME_SIZE = size.dice
const RESULT_FRAMES = [8, 9, 10, 11]
const GROW_DURATION = 1000

const Dice: FC<DiceProps> = ({ id, playerIndex, selectedId, setSelected }) => {


  const phase = useGameStore((s) => s.gameState?.phase)
  const dice: DiceState | null = useGameStore((s) => s.gameState?.players?.[playerIndex]?.dice?.[id])
  const audioPlayer: AudioPlayer = useAudioPlayer()
  if (!dice) return null
  
  const face = useSharedValue<number>(dice.face);
  const offsetY = useSharedValue<number>(0);
  const spriteIndex = useSharedValue<number>(RESULT_FRAMES[dice.face]);
  const isRolling = useSharedValue<boolean>(false);
  const [active, setActive] = useState<boolean>(false)
  
  useEffect(() => {
    face.value = dice.face;
    if (!isRolling.value) {
      spriteIndex.value = RESULT_FRAMES[dice.face];
    }
  }, [dice.face]);

  const handlePress = () => {
    if (phase == PHASE_NAME.ROLL) {
      audioPlayer.replace(dice.isLocked ? SFX['dice_pick']: SFX['lock'])
      audioPlayer.play()
      lockAnimation()
      sendCommand(COMMAND_NAME.LOCK, id)
    }
    else if (phase == PHASE_NAME.ACTION && id == selectedId) {
      sendCommand(COMMAND_NAME.DICE, id)
    }
    else {
        setSelected(id)
    }
  }
  
  const rollAnimation = (delay: number = 0) => {
    'worklet'
    isRolling.value = true
    spriteIndex.value = 0
    spriteIndex.value = withRepeat(
      withTiming(ROLL_FRAMES, {
        duration: ROLL_DURATION + delay,
        easing: Easing.linear,
      }),
      ROLL_CYCLE,
      false,
      () => {
        isRolling.value = false
        if (face.value != null) {
          spriteIndex.value = RESULT_FRAMES[face.value]
        }
      }
    )
  }

  const bounceAnimation = (delay: number = 0) => {
    'worklet'
    const anim_duration = (ROLL_DURATION + delay) * ROLL_CYCLE + BOUNCE_DURATION
    const p = (percent: number) => {
      return anim_duration * percent
    }
    offsetY.value = withSequence(
      withTiming(-40, { duration: p(0.25), easing: Easing.out(Easing.quad) }), 
      withTiming(0, { duration: p(0.20), easing: Easing.in(Easing.quad) }),  
      withTiming(-15, { duration: p(0.18), easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: p(0.15), easing: Easing.in(Easing.quad) }),
      withTiming(-5, { duration: p(0.12), easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: p(0.10), easing: Easing.in(Easing.quad) })
    )
  }

  const lockAnimation = () => {
    "worklet"
    offsetY.value = withSequence(
      withTiming(-5, { duration: 70, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 70, easing: Easing.in(Easing.quad) })
    )
  }


  const handleAnimation = (animation: Animation) => {
    'worklet'
    if (!dice.isLocked && animation.name === ANIM_NAME.ROLL) {
      if (animation.target == undefined || playerIndex == animation.target) {
        const randomDelay = Math.random() * DURATION_VARIANCE
        scheduleOnUI(rollAnimation, randomDelay)
        scheduleOnUI(bounceAnimation, randomDelay)
      }
    }
    else if (animation.name == ANIM_NAME.DICE && animation.id == id && animation.target == playerIndex) {
      setActive(true)
      setTimeout(() => {
        setActive(false)
      }, GROW_DURATION)
    }
  }

  useEffect(() => {
    addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
    return () => {
      removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
    }
  })

  const animatedSpriteStyle = useAnimatedStyle(() => {
    const frame: number = Math.floor(spriteIndex.value)
    return {
      transform: [{ translateX: -frame * FRAME_SIZE }],
    }
  })

  const animatedBounceStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offsetY.value }],
    }
  })

  if (phase == PHASE_NAME.SETUP || dice.isUsed) return null
  
  return(
    <Pulse
      active={selectedId == id || active}
      scaling={active? 1.6: 1.2}
      duration={active? GROW_DURATION: 1200}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          pressed && commonStyles.pressed
        ]}
        disabled={phase == PHASE_NAME.ACTION && useGameStore.getState().gameState.activePlayer != playerIndex}
      >
        <Animated.View style={[
          animatedBounceStyle,
          styles.dice,
          dice.isLocked && commonStyles.disabled,
        ]}
        >
          <Animated.Image
              source={SPRITESHEET['dice']}
              style={[
                animatedSpriteStyle,
                styles.spritesheet,
              ]}
              resizeMode="cover"
          />
        </Animated.View>
      </Pressable>
    </Pulse>
  )
}

export default Dice

const styles = StyleSheet.create({
    dice: {
        width: size.dice,
        height: size.dice,
        overflow: 'hidden',
    },
    spritesheet: {
        width: size.diceSpritesheet,
        height: size.dice,
    },
})
