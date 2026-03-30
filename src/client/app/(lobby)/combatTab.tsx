/*
------------------------------------------------------------
combatTab.tsx
Onglet combat du lobby: affichage utilisateur, navigation artefacts/religions, gestion de la file et déclenchement des sons/BGM.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { View, ImageBackground, StyleSheet } from 'react-native'
import { useEffect, useState, JSX } from 'react'
import commonStyles from '@/theme/styles'
import { sendCommand, addCallback, removeCallback } from '@/service/gameCommand'
import { COMMAND_NAME, SOCKET_EVENT, User } from '@/common/types'
import { useGameStore } from '@/service/gameStore'
import UserPanel from '@/components/lobby/UserPanel'
import { BACKGROUND_IMAGES } from '@/assets/images/imageData'
import StyledButton from '@/components/StyledButton'
import { colors, fontSize } from '@/theme/theme'
import AvatarMenu from '@/components/lobby/AvatarMenu'
import Toast from 'react-native-toast-message'
import { useNavigation } from 'expo-router'
import { playBGM, stopBGM } from '@/service/audioPlayer'
import { BGM, SFX } from '@/assets/audio/audioData'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'

export default function CombatTab(): JSX.Element {

    const religion: number = useGameStore((s) => s.user.religion)
    const [avatarMenu, setAvatarMenu] = useState<boolean>(false)
    const [inQueue, setInQueue] = useState<boolean>(false)
    const navigation = useNavigation()
    const audioPlayer: AudioPlayer = useAudioPlayer()

    useEffect(() => {
        addCallback(SOCKET_EVENT.QUEUE, showQueue)
        playBGM(BGM['menu'])
        
        return () => {
            removeCallback(SOCKET_EVENT.QUEUE, showQueue)
            if (inQueue) {
                Toast.hide()
                stopBGM()
            }
        } 
    })
    const handleQueueSound = async () => {
        audioPlayer.replace(SFX['deep'])
        audioPlayer.play()
        await stopBGM()
    }

    const showQueue = () => {
        Toast.show({type: 'queue', autoHide: false,})
    }
    
    const joinTraining = async () => {
        await handleQueueSound()
        sendCommand(COMMAND_NAME.TRAINING)
    }
    const joinQueue = () => {
        sendCommand(COMMAND_NAME.QUEUE)
        setInQueue(true)
        handleQueueSound()
    }
    const quitQueue = () => {
        sendCommand(COMMAND_NAME.LEAVE)
        setInQueue(false)
    }
    const swapAvatar = (index: number) => {
        sendCommand(COMMAND_NAME.SWAP_AVATAR, index)
        setAvatarMenu(false)
    }

    return(
        <ImageBackground
            style={{flex:1}}
            source={BACKGROUND_IMAGES[religion]}
        >
            <UserPanel
                onAvatarPress={() =>  {
                    setAvatarMenu(true)
                    audioPlayer.replace(SFX['select'])
                    audioPlayer.play()
                }}
                onArtifactPress={() => {
                    navigation.navigate('artifactTab' as never)
                    audioPlayer.replace(SFX['page'])
                    audioPlayer.play()
                }}
                onReligionPress={() => {
                    navigation.navigate('religionTab' as never)
                    audioPlayer.replace(SFX['page'])
                    audioPlayer.play()
                }}
            />
            <View style={styles.buttonContainer}>
                <StyledButton
                    text='Entraînement'
                    onPress={joinTraining}
                    textStyle={styles.buttonText}
                    buttonStyle={[styles.buttonStyle, { backgroundColor: colors.lobbyGreen }]}
                    disabled={inQueue}
                />
                { inQueue &&
                    <StyledButton
                        text='Cancel'
                        onPress={quitQueue}
                        textStyle={styles.buttonText}
                        buttonStyle={[styles.buttonStyle, { backgroundColor: 'black', borderColor: colors.lobbyRed }]}
                    />
                }
                { !inQueue &&
                    <StyledButton
                        text='Duel'
                        onPress={joinQueue}
                        textStyle={styles.buttonText}
                        buttonStyle={[styles.buttonStyle, { backgroundColor: colors.lobbyRed }]}
                    />
                }
            </View>
            { avatarMenu && 
                <AvatarMenu
                    onClose={() => setAvatarMenu(false)}
                    onSelect={(index) => swapAvatar(index)}
                />
            }
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 2,
        ...commonStyles.centeredContainer,
        gap: 40,
    },

    buttonText: {
        ...commonStyles.labelText,
        ...commonStyles.bigTextShadow,
        fontSize: fontSize.big,
    },
    buttonStyle: {
        ...commonStyles.centeredContainer,
        ...commonStyles.buttonStyle,
        width: '80%',
        height: '25%',
    },
})
