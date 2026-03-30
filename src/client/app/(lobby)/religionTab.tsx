/*
------------------------------------------------------------
religionTab.tsx
Onglet du lobby présentant un pager vertical des religions avec boucle infinie, sons et sélection envoyée au serveur.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { useEffect, useMemo, useRef, JSX } from 'react'
import { Dimensions, View } from 'react-native'
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view'
import { useNavigation } from 'expo-router'
import Religion from '@/components/lobby/Religion'
import { sendCommand } from '@/service/gameCommand'
import { useGameStore } from '@/service/gameStore'
import { COMMAND_NAME } from '@/common/types'
import commonStyles from '@/theme/styles'
import { SFX } from '@/assets/audio/audioData'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'

export default function ReligionTab(): JSX.Element {
    const userReligion: number = useGameStore((s => s.user.religion))
    const religions = useGameStore((s) => s.gameValues.religions)
    const screenWidth = Dimensions.get('window').width
    const pagerRef = useRef<PagerView>(null)
    const pendingReset = useRef<ReturnType<typeof setTimeout> | null>(null)
    const navigation = useNavigation()
    const audioPlayer: AudioPlayer = useAudioPlayer()

    const loopedReligions = useMemo(() => {
      if (!religions?.length) return []
      const first = religions[0]
      const last = religions[religions.length - 1]
      return [last, ...religions, first]
    }, [religions])

    const setUserReligion = (newReligion: number) => {
      audioPlayer.replace(SFX['religion_change'])
      audioPlayer.play()
      sendCommand(COMMAND_NAME.SWAP_RELIGION, newReligion)
      navigation.navigate('combatTab' as never)
    }

    const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
      const pos = e.nativeEvent.position
      const lastIndex = loopedReligions.length - 1

      if (pendingReset.current) {
        clearTimeout(pendingReset.current)
        pendingReset.current = null
      }

      if (pos === 0) {
        pendingReset.current = setTimeout(() => {
          pagerRef.current?.setPageWithoutAnimation(lastIndex - 1)
          pendingReset.current = null
        }, 250)
      } 
      else if (pos === lastIndex) {
        pendingReset.current = setTimeout(() => {
          pagerRef.current?.setPageWithoutAnimation(1)
          pendingReset.current = null
        }, 250)
      }
      else if (pos > 0 && pos < lastIndex) {
        audioPlayer.replace(SFX['page'])
      audioPlayer.play()
      }
    }

    useEffect(() => {
      return () => {
        if (pendingReset.current) {
          clearTimeout(pendingReset.current)
        }
      }
    }, [])

    return (
    <View style={[commonStyles.mainBlack, { flex: 1 }]}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1, width: screenWidth }}
        orientation="vertical"
        initialPage={userReligion}
        overScrollMode="never"
        onPageSelected={handlePageSelected}
      >
        {loopedReligions.map((religion, idx) => (
          <View key={`${religion.id}-${idx}`} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Religion
              data={religion}
              userReligion={userReligion}
              setReligion={() => setUserReligion(religion.id)}
            />
          </View>
        ))}
      </PagerView>
    </View>
    )
}
