/*
------------------------------------------------------------
game.tsx
Écran principal de partie: panels joueurs, commandes (forfeit), navigation, sons BGM/SFX et gestion de fin de partie.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { useEffect, JSX, useState } from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import { getItem } from 'expo-secure-store'
import Toast from 'react-native-toast-message'
import { Router, useRouter } from 'expo-router'
import { Button} from '@/components/Button'
import PhaseBanner from '@/components/gameUI/PhaseBanner'
import commonStyles from '../theme/styles'
import PlayerPanel from '@/components/gameUI/PlayerPanel'
import { COMMAND_NAME, GameState, SOCKET_EVENT, Animation, ANIM_NAME, ArtifactData, PHASE_NAME, GodData } from '@/common/types'
import { useGameStore } from '@/service/gameStore'
import { sendCommand, addCallback, removeCallback } from '@/service/gameCommand'
import { heightProportion, widthProportion } from '@/service/utils'
import { BACKGROUND_IMAGES, UI_IMAGES } from '@/assets/images/imageData'
import { colors } from '@/theme/theme'
import GameMenuPager from '@/components/gameUI/GameMenuPager'
import { playBGM, stopBGM } from '@/service/audioPlayer'
import { BGM, SFX } from '@/assets/audio/audioData'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import EndMenu from '@/components/gameUI/EndMenu'

export default function Game(): JSX.Element {
    const phase: string = useGameStore((s) => s.gameState?.phase)
    const playerIndex: number = useGameStore((s) => s.playerIndex)
    const router: Router  = useRouter()
    const audioPlayer: AudioPlayer = useAudioPlayer()
    const opponentIndex = 1 - playerIndex

    const handleAnimation = (animation: Animation) => {
        if (animation.name == ANIM_NAME.ARTIFACT && animation.target != playerIndex) {
            const artifact: ArtifactData = useGameStore.getState().gameValues.artifacts.find((a) => a.id == animation.id)
            Toast.show({
                type: 'artifact',
                props: {artifactData: artifact},
                visibilityTime: 2000,
            })
        }
        else if (animation.name == ANIM_NAME.DICE && animation.target != playerIndex) {
            Toast.show({
               type: 'dice',
               props: {value: animation.power},
               visibilityTime: 2000,
            })
        }
        else if (animation.name == ANIM_NAME.GOD && animation.target != playerIndex) {
            const opponentReligion: number = useGameStore.getState().gameState?.players?.[opponentIndex]?.user?.religion
            const gods: GodData[] = useGameStore.getState().gameValues?.religions[opponentReligion-1]?.gods
            console.log(gods)
            if (gods) {
                Toast.show({
                    type: 'god',
                    props: {data: gods.find((g) => g.id == animation.id)},
                    visibilityTime: 2000,
                })
            }
        }
    }

    const gameEnded = async () => {
        audioPlayer.replace(SFX['deep'])
        audioPlayer.play()
        await stopBGM()
    }

    useEffect(() => {
        if (phase != PHASE_NAME.SETUP) {
            Toast.show({
                type: 'banner',
                position: 'bottom',
                props: {
                    text: phase == PHASE_NAME.ROLL ? 'Roule les dés': "À l'attaque",
                    image: phase == PHASE_NAME.ROLL ? UI_IMAGES['dice']: UI_IMAGES['swords']
                },
            })
        }
    }, [phase])

    useEffect(() => {   
        addCallback(SOCKET_EVENT.GAME_ENDED, gameEnded)
        addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
        playBGM(BGM['game'])
        activateKeepAwakeAsync()

        return () => {
            removeCallback(SOCKET_EVENT.GAME_ENDED, gameEnded)
            removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
            deactivateKeepAwake()
            stopBGM()
        }
    }, [])

    if (!phase) {
        console.log('requesting...')
        sendCommand(COMMAND_NAME.REQUEST_GAME_STATE)
        return null
    }

    return (
        <ImageBackground 
            style={styles.mainContainer}
            source={BACKGROUND_IMAGES[0]}
            >
            <PlayerPanel 
                playerId={opponentIndex}
                style={styles.panel}
            />
            <PlayerPanel
                playerId={playerIndex}
                style={[
                    styles.panel,
                    {marginTop: heightProportion(7)}
                ]}
            />
            <GameMenuPager playerId={playerIndex}/>
            <EndMenu playerId={playerIndex}/>
        </ImageBackground> 
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        ...commonStyles.container,
        justifyContent: 'space-between',
        paddingTop: '3%'
    },
    panel: {
        width: '100%',
        height: '20%',
        ...commonStyles.horizontalContainer,
        backgroundColor: colors.transparentBlack,
        padding: '1.5%',
        borderRadius: 10,
        borderWidth: widthProportion(2),
        gap: widthProportion(1),
    },
    panelButtons: {
        ...commonStyles.centeredContainer,
        width: '20%'
    },
    panelButton: {
        width: widthProportion(22),
        aspectRatio: 1,
        backgroundColor: colors.light,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 3,
    },
})
