/*
------------------------------------------------------------
DiceTray.tsx
Plateau des dés d’un joueur avec geste de lancer, son synchronisé aux animations et mise en évidence en phase de roulage.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React, {Dispatch, SetStateAction, useEffect} from "react"
import Dice from "./Dice"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { scheduleOnRN } from "react-native-worklets"
import { addCallback, removeCallback, sendCommand } from "@/service/gameCommand"
import { ANIM_NAME, Animation, COMMAND_NAME, PHASE_NAME, SOCKET_EVENT } from "@/common/types"
import { useGameStore } from "@/service/gameStore"
import Pulse from "../animation/Pulse"
import { colors } from "@/theme/theme"
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { SFX } from "@/assets/audio/audioData"

export interface DiceTrayProps {
  playerIndex: number
  selectedId?: number
  setSelected?: Dispatch<SetStateAction<number | null>>
  diceNumber?: number
  style?: StyleProp<ViewStyle>
}

const DiceTray: React.FC<DiceTrayProps> = ({ playerIndex, selectedId, setSelected, diceNumber = 4, style }) => {
  const phase = useGameStore((s) => s.gameState?.phase)
  const audioPlayer: AudioPlayer = useAudioPlayer(SFX['roll'])
  const diceArray: number[] = Array.from({ length: diceNumber }, (_, i) => i)

  const playRollSound = (animation: Animation) => {
    if (animation.name == ANIM_NAME.ROLL && animation.target == playerIndex) {
      audioPlayer.seekTo(0)
      audioPlayer.play()
    }
  }
  
  const onSwipeUp = () => {
    sendCommand(COMMAND_NAME.ROLL)
  }

  const swipeUp = Gesture.Pan()
    .onUpdate(() => {
      "worklet"
    })
    .onEnd((event) => {
      if (phase != PHASE_NAME.ROLL) return
      if (event.translationY < -40) {
        scheduleOnRN(onSwipeUp)
      }
    })

  useEffect(() => {
    addCallback(SOCKET_EVENT.ANIMATION, playRollSound)
    return () => {
      removeCallback(SOCKET_EVENT.ANIMATION, playRollSound)
    }
  })

  return (
    <GestureDetector gesture={swipeUp}>
      <Pulse
        style={[
          style,
          phase == PHASE_NAME.ROLL && styles.active
        ]}
        scaling={1.03}
        active={phase == PHASE_NAME.ROLL}
      >
        {phase != PHASE_NAME.SETUP && diceArray.map((i) => (
          <Dice 
            key={i} 
            id={i} 
            playerIndex={playerIndex} 
            selectedId={selectedId}
            setSelected={setSelected}
          />
        ))}
      </Pulse>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  active: {
    borderWidth: 4,
    borderColor: colors.light,
  }
})

export default DiceTray
