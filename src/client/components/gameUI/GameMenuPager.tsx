/*
------------------------------------------------------------
GameMenuPager.tsx
Pager horizontal entre menus d’artefacts/dés et dieux/prières, synchronisé avec la phase et les timers de jeu.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated"
import PlayerArtifacts from "./PlayerArtifacts"
import DiceTray from "./DiceTray"
import PlayerGods from "./PlayerGods"
import PrayerTray from "./PrayerTray"
import { widthProportion } from "@/service/utils"
import { PHASE_NAME, SOCKET_EVENT } from "@/common/types"
import { useGameStore } from "@/service/gameStore"
import { PlayerPanelProps } from "./PlayerPanel"
import commonStyles from "@/theme/styles"
import { colors } from "@/theme/theme"
import DiceMenu from "./DiceMenu"
import { addCallback, removeCallback } from "@/service/gameCommand"



const PAGE_WIDTH = widthProportion(100)

const GameMenuPager: FC<PlayerPanelProps> = ({playerId,}) => {
  const [diceId, setDiceId] = useState<number>(undefined)
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollX = useSharedValue<number>(0)
  const phase = useGameStore((s) => s.gameState?.phase)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  const onTimeout = (value: number) => {
    if (value == 0 &&  useGameStore.getState().gameState.activePlayer == playerId) {
      setDiceId(undefined)
    }
  }

  useEffect(() => {
    if (phase === PHASE_NAME.ROLL) {
      scrollRef.current?.scrollTo({
        x: 0,
        animated: true,
      })
    }
    else if (phase === PHASE_NAME.SETUP) {
      setDiceId(undefined)
    }
  }, [phase])

  useEffect(() => {
    addCallback(SOCKET_EVENT.TIMER_UPDATE, onTimeout)

    return () => {
      removeCallback(SOCKET_EVENT.TIMER_UPDATE, onTimeout)
    }
  })

   if (!phase) return null

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={styles.scrollView}
      horizontal={true}
      pagingEnabled={true}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={styles.container}
    >
      {/* ---------------- PAGE 0 : ARTIFACTS + DICE ---------------- */}
      <View style={styles.page}>
        {diceId == undefined &&
          <PlayerArtifacts
            playerId={playerId}
            containerStyle={styles.playerMenu}
            artifactStyle={styles.artifact}
          />
        }
        {diceId != undefined &&
          <DiceMenu
            id={diceId}
            playerId={playerId}
            selectedId={diceId}
            setSelected={setDiceId}
          />
        }
        <DiceTray
          diceNumber={4}
          playerIndex={playerId}
          selectedId={diceId}
          setSelected={setDiceId}
          style={styles.tray}
        />
      </View>

      {/* ---------------- PAGE 1 : GODS + PRAYER ---------------- */}
      <View style={styles.page}>
        <PlayerGods
          playerId={playerId}
          containerStyle={styles.playerMenu}
        />
        <PrayerTray
          playerIndex={playerId}
          style={styles.tray}
        />
      </View>
    </Animated.ScrollView>
  )
}

export default GameMenuPager

const styles = StyleSheet.create({
    scrollView: {
        width: '100%', 
        height: '50%',
        marginTop: '2%', 
        marginBottom: '10%',
    },
    container: {
        width: PAGE_WIDTH * 2, 
        flexDirection: "row",
        height: "100%",
    },
    page: {
        // ...commonStyles.centeredContainer,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: PAGE_WIDTH,
    },
    playerMenu: {
        gap: widthProportion(1),
        padding: widthProportion(1),
        height: "70%",
        width: "100%",
    },
    artifact: {
        width: "49%",
    },
    tray: {
        ...commonStyles.horizontalContainer,
        width: '95%',
        height: '25%',
        justifyContent: 'center',
        gap: widthProportion(2),
        backgroundColor: colors.transparentBlack,
        borderRadius: 20,
        paddingHorizontal: widthProportion(2),
    },
})
