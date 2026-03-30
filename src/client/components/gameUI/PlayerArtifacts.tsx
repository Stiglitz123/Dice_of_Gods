/*
------------------------------------------------------------
PlayerArtifacts.tsx
Affiche les artefacts équipés d’un joueur et propose un menu de confirmation pour en activer un durant la partie.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect, useState } from "react"
import { View, StyleProp, ViewStyle, StyleSheet } from "react-native"
import Artifact from "../Artifact"
import { ArtifactData, ArtifactState, COMMAND_NAME, PHASE_NAME, SOCKET_EVENT, Animation, ANIM_NAME } from "@/common/types"
import { useGameStore } from "@/service/gameStore"
import StyledButton from "../StyledButton"
import Float from "../animation/Float"
import { colors, fontSize, size } from "@/theme/theme"
import commonStyles from "@/theme/styles"
import { heightProportion } from "@/service/utils"
import { sendCommand, addCallback, removeCallback } from "@/service/gameCommand"
import Pulse from "../animation/Pulse"

export interface PlayerArtifactsProps {
  playerId: number
  containerStyle?: StyleProp<ViewStyle>
  artifactStyle?: StyleProp<ViewStyle>
  disabled?: boolean
}

export interface ArtifactInfo {
    state: ArtifactState
    data: ArtifactData
}

const GROW_DURATION = 900
const GROW_SCALING = 1.2

const PlayerArtifacts: FC<PlayerArtifactsProps> = ({playerId, containerStyle, artifactStyle, disabled = false}) => {

    const allArtifacts = useGameStore(s => s.gameValues?.artifacts)
    const artifactStates = useGameStore(s => s.gameState?.players?.[playerId]?.artifacts)
    const phase = useGameStore((s) => s.gameState.phase)
    const [selected, setSelected] = useState<ArtifactData | null>(null)
    const [active, setActive] = useState<boolean>(false)

    const handleAnimation = (animation: Animation) => {
        if (animation.target == playerId && animation.name == ANIM_NAME.ARTIFACT) {
            setActive(true)
            setTimeout(() => {
                setActive(false)
                setSelected(null)
            }, GROW_DURATION + 400)
        }
    }

    useEffect(() => {
        if (phase == PHASE_NAME.SETUP) setSelected(null)
    }
    ,[phase])

     useEffect(() => {
        addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
        return () => removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
      })

    if (!artifactStates || !allArtifacts) return null
    const artifacts: ArtifactInfo[] = artifactStates.map(state => {
        const data = allArtifacts.find(a => a.id === state.id)
        return { data, state }
    })
  

    if (!selected) {
    return (
        <View style={[containerStyle, styles.artifactMenu]}>
        {artifacts.map((a, i) => (
            <Pulse
                key={i}
                active={phase == PHASE_NAME.ACTION && a.state.isUsable && useGameStore.getState().gameState.activePlayer == playerId}
                style={[artifactStyle]}
                scaling={1.05}
            >
                <Artifact
                data={a.data}
                style={[
                    phase !== PHASE_NAME.SETUP &&
                    (a.state.isUsable ? commonStyles.usable : commonStyles.dim),
                ]}
                disabled={phase != PHASE_NAME.ACTION || !a.state.isUsable || useGameStore.getState().gameState.activePlayer != playerId} 
                onPress={() => setSelected(a.data)}
                countdown={a.state.countdown}
                />
            </Pulse>
        ))}
        </View>
    )
    }
    return (
    <View style={[containerStyle, styles.confirmMenu]}>
        <Float>
            <Pulse
                active={active}
                duration={GROW_DURATION}
                scaling={GROW_SCALING}
            >
                <Artifact
                    data={selected}
                    style={{width: size.artifactWidth, height: size.artifactHeight, transform:[{scale: 1.4}]}}
                    onPress={() =>  {
                        sendCommand(COMMAND_NAME.ARTIFACT, selected.id)
                    }}
                />
            </Pulse>
        </Float>
        <StyledButton
            text='Annuler'
            onPress={() => setSelected(null)}
            textStyle={styles.textStyle}
            buttonStyle={styles.buttonStyle}
        />
    </View>
    )
}

const styles = StyleSheet.create({
    artifactMenu: {
        ...commonStyles.horizontalContainer,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    confirmMenu: {
        ...commonStyles.centeredContainer,
        marginTop: '5%',
        justifyContent: "space-around",
        gap: heightProportion(3),
    },
    textStyle: {
        ...commonStyles.labelText,
        ...commonStyles.smallTextShadow,
        fontSize: fontSize.small,

    },
    buttonStyle: {
        backgroundColor: colors.lobbyRed,
        ...commonStyles.buttonStyle,
    },
})

export default PlayerArtifacts
