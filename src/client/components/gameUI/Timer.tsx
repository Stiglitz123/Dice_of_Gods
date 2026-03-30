/*
------------------------------------------------------------
Timer.tsx
Affiche le sablier de tour, met à jour via socket et permet de terminer le tour en appuyant dessus.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect, useState } from 'react'
import { Text, ImageBackground, StyleSheet, Pressable } from 'react-native'
import { addCallback, removeCallback, sendCommand } from '@/service/gameCommand'
import commonStyles from '../../theme/styles'
import Number from '../Number'
import { PlayerPanelProps } from './PlayerPanel'
import { useGameStore } from '@/service/gameStore'
import { COMMAND_NAME, GameState, PHASE_NAME, SOCKET_EVENT } from '@/common/types'
import { UI_IMAGES } from '@/assets/images/imageData'
import { widthProportion } from '@/service/utils'
import Wiggle from '../animation/Wiggle'

const Timer: FC<PlayerPanelProps> = ({playerId}) => {
  const gameState: GameState = useGameStore((s) => s.gameState)
  const [timer, setTimer] = useState<number>(0)

  useEffect( () => {
    if (gameState.phase == PHASE_NAME.SETUP) {
      setTimer(0)
    }
  }, [gameState.phase])

  const updateTime = (value: number) => {
    const gameState: GameState = useGameStore.getState().gameState
    if (gameState.phase == PHASE_NAME.ROLL) {
      setTimer(value)
    }
    else if (gameState?.activePlayer == playerId) {
      setTimer(value)
    }
    else {
      setTimer(gameState?.players?.[playerId]?.timeLeft)
    }
  }

  useEffect(() => {
    addCallback(SOCKET_EVENT.TIMER_UPDATE, updateTime)
    return () => removeCallback(SOCKET_EVENT.TIMER_UPDATE, updateTime)
  }, [])

  if (!gameState) return null

  return (
    <Pressable
      style={({ pressed }) => [
        pressed && commonStyles.pressed,
        {overflow: 'visible'}
      ]}
      onPress={() => sendCommand(COMMAND_NAME.END)}
    >
      <Wiggle
        active={0 < timer && timer < 10}
        rotation={7}
      >
        <ImageBackground
          source={UI_IMAGES['timer']}
          style={styles.image}
        >
          <Number
            value={timer}
            size={widthProportion(8)}
            style={[
              styles.number,
            ]}
          />
        </ImageBackground>
      </Wiggle>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  image: {
    width: widthProportion(17),
    aspectRatio: 1,
    position: 'relative',
    alignSelf: 'flex-end'
  },
  number: {
    position: 'absolute',
    top: '50%',
    left: '0%',
  },
})

export default Timer
