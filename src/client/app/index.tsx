/*
------------------------------------------------------------
index.tsx
Point d’entrée client: précharge polices/ressources, suit les callbacks socket et oriente vers lobby, partie ou inscription.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { useEffect, useState, JSX } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Router, useRouter } from 'expo-router'
import { useFonts } from 'expo-font'
import { Asset } from 'expo-asset'
import { useGameStore } from '@/service/gameStore'
import { GameState, GameValues, SOCKET_EVENT, User } from '@/common/types'
import { removeCallback, addCallback } from '@/service/gameCommand'
import {
  BACKGROUND_IMAGES,
  ARTIFACT_IMAGES,
  SCROLL_IMAGES,
  GOD_IMAGES,
  UI_IMAGES,
  AVATAR_IMAGES,
  RELIGION_IMAGES,
  SPRITESHEET,
} from '@/assets/images/imageData'
import { SFX, BGM } from '@/assets/audio/audioData'
import { colors, fontSize, fonts } from '@/theme/theme'
import commonStyles from '@/theme/styles'
import { heightProportion } from '@/service/utils'

const IMAGE_MODULES: number[] = [
  ...Object.values(BACKGROUND_IMAGES),
  ...Object.values(ARTIFACT_IMAGES),
  ...Object.values(SCROLL_IMAGES),
  ...Object.values(GOD_IMAGES),
  ...Object.values(UI_IMAGES),
  ...Object.values(AVATAR_IMAGES),
  ...Object.values(RELIGION_IMAGES),
  ...Object.values(SPRITESHEET),
].map((asset) => asset as number)

const AUDIO_MODULES: number[] = [
  ...Object.values(SFX),
  ...Object.values(BGM),
]

const ASSET_MODULES: number[] = [...IMAGE_MODULES, ...AUDIO_MODULES]

export default function Index(): JSX.Element {
  const router: Router = useRouter()
  const gameValues: GameValues = useGameStore((s) => s.gameValues)
  const userInfo: User = useGameStore((s) => s.user)
  const gameState: GameState = useGameStore((s) => s.gameState)
  const [ fontsLoaded ] = useFonts({
    Ravenholm: require('../assets/fonts/Ravenholm_Inline.ttf'),
    Fredoka: require('../assets/fonts/FredokaOne-Regular.ttf'),
  })

  const [register, setRegister] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)


  useEffect(() => {
    addCallback(SOCKET_EVENT.REGISTER, setRegister)
    return () => {
      removeCallback(SOCKET_EVENT.REGISTER, setRegister)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const totalAssets: number = ASSET_MODULES.length

    if (!totalAssets) {
      setAssetsLoaded(true)
      setProgress(100)
      return
    }

    const loadAssets = async (): Promise<void> => {
      let loadedAssets = 0

      const updateProgress = () => {
        if (!isMounted) return
        const percent = Math.round((loadedAssets / totalAssets) * 100)
        setProgress(percent)
      }

      await Promise.all(ASSET_MODULES.map(async (asset) => {
        try {
          await Asset.fromModule(asset).downloadAsync()
        } catch (error) {
          console.warn('Asset load failed', error)
        } finally {
          loadedAssets += 1
          updateProgress()
        }
      }))

      if (isMounted) {
        setAssetsLoaded(true)
        setProgress(100)
      }
    }

    loadAssets()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (fontsLoaded && assetsLoaded && gameValues && userInfo) {
      setReady(true)
    }
  }, [fontsLoaded, assetsLoaded, gameValues, userInfo])

  useEffect(() => {
    if (ready && userInfo?.inGame && gameState) {
      router.replace('/game')
    }
    else if (ready) {
      router.replace('/(lobby)/combatTab')
    }
    else if (register && assetsLoaded && fontsLoaded) {
      router.replace('/register')
    }
  }, [ready, register, userInfo, gameState, router, assetsLoaded, fontsLoaded])

  if (!assetsLoaded || !fontsLoaded || (!ready && !register)) {
    return (
      <View style={[styles.container]}>
        <Image
          source={UI_IMAGES['title']}
          style={styles.title}
          resizeMode='contain'
        />
        <Text style={styles.progressPercent}>
          {progress}%
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
        Chargement des ressources...
        </Text>
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.centeredContainer,
    ...commonStyles.cover,
    backgroundColor: 'black',
  },
  title: {
    width: '100%',
    height: heightProportion(12),
    marginVertical: heightProportion(10),
  },
  titleFont: {
    fontFamily: fonts.ravenholm,
  },
  progressBar: {
    width: '80%',
    height: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light,
    backgroundColor: '#111',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.lobbyGreen,
  },
  progressText: {
    width: '100%',
    textAlign: 'center',
    marginTop: heightProportion(5),
    color: colors.light,
    fontSize: fontSize.small,
    fontFamily: fonts.ravenholm
  },
  progressPercent: {
    width: '100%',
    textAlign: 'center',
    color: colors.light,
    fontSize: fontSize.medium,
    fontFamily: fonts.number
  },
})
