/*
------------------------------------------------------------
PlayerGods.tsx
Affiche les dieux disponibles d’un joueur, leurs coûts/effets et permet de confirmer l’activation d’un dieu.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect, useMemo, useState } from "react"
import { View, StyleProp, ViewStyle, StyleSheet, Pressable, ImageBackground, Image } from "react-native"
import { GodData, GodState, COMMAND_NAME, PHASE_NAME, ReligionData, GameState } from "@/common/types"
import { useGameStore } from "@/service/gameStore"
import StyledButton from "../StyledButton"
import Float from "../animation/Float"
import { colors, fontSize } from "@/theme/theme"
import commonStyles from "@/theme/styles"
import { heightProportion, widthProportion } from "@/service/utils"
import { sendCommand } from "@/service/gameCommand"
import GodWidget from "../GodWidget"
import Pulse from "../animation/Pulse"
import { GOD_IMAGES, UI_IMAGES } from "@/assets/images/imageData"
import Number from "../Number"
import EffectSequence from "../EffectSequence"
export interface PlayerGodsProps {
  playerId: number
  containerStyle?: StyleProp<ViewStyle>
  disabled?: boolean
}

export interface GodInfo {
    data: GodData
    state: GodState
}

const PlayerGods: FC<PlayerGodsProps> = ({playerId, containerStyle, disabled = false}) => {

    const allReligions: ReligionData[] | undefined = useGameStore(s => s.gameValues?.religions)
    const gameState: GameState = useGameStore(s => s.gameState)
    const religionId = gameState?.players?.[playerId]?.user?.religion
    const phase = gameState?.phase
    const godStates = gameState?.players?.[playerId]?.gods
    const [selected, setSelected] = useState<GodData | null>(null)
    const playerGods: GodData[] = useMemo(() => {
        return allReligions?.find((r) => r.id === religionId)?.gods ?? []
    }, [allReligions, religionId])

    useEffect(() => {
        if (phase === PHASE_NAME.SETUP) setSelected(null)
    }, [phase])

    const useGod = (godId: number) => {
        sendCommand(COMMAND_NAME.GOD, godId)
        setSelected(null)
    }
    if (!godStates || !playerGods) return null
    
    const gods: GodInfo[] = godStates?.map(state => {
        const data = playerGods?.find(a => a?.id === state?.id)
        return { data, state }
    })


    if (gods.length == 0) return null

    if (!selected) {
        return (
            <View style={[containerStyle, styles.godMenu]}>
                {gods?.map(({ data, state }, i) => (
                    <View
                        key={i}
                        style={[
                            styles.godCard,
                        ]}
                    >
                        <ImageBackground
                            source={state.isUsable ? UI_IMAGES['prayer_cost'] : UI_IMAGES['prayerE']}
                            style={styles.godCost}
                            resizeMode="contain"
                        >
                            <Number
                                value={data?.cost}
                                size={widthProportion(11)}
                                style={{marginRight: widthProportion(3)}}
                            />
                        </ImageBackground>
                        <Pulse
                            style={[
                                styles.godPortrait,
                                state.isUsable ? commonStyles.usable : commonStyles.dim,
                            ]}
                            active={phase == PHASE_NAME.ACTION && state?.isUsable && useGameStore.getState().gameState.activePlayer == playerId}
                        >
                            <Pressable
                                onPress={() => setSelected(data)}
                                style={({ pressed }) => [
                                    pressed && commonStyles.pressed
                                ]}
                                disabled={phase != PHASE_NAME.ACTION || !state?.isUsable || useGameStore.getState().gameState.activePlayer != playerId}
                            >
                                <Image
                                    source={GOD_IMAGES[data?.id]}
                                    style={styles.godImage}
                                    resizeMode="contain"
                                />
                            </Pressable>
                        </Pulse>
                        <EffectSequence
                            icons={data?.effectSequence?.iconSequence}
                            iconSize={data?.effectSequence?.iconSequence?.length > 4 ? widthProportion(6) : widthProportion(7)}
                            style={styles.effectSequece}
                        />
                    </View>
                ))}
            </View>
        )
    }
    return (
        <View style={[containerStyle, styles.confirmMenu]}>
            <Float>
                <GodWidget
                    data={selected}
                    disabled={false}
                    nameShown={false}
                    style={{
                        width: '100%',
                    }}
                    onPress={() => useGod(selected.id)}
                />
            </Float>
            <StyledButton
                text='Annuler'
                onPress={() => setSelected(null)}
                textStyle={styles.buttonText}
                buttonStyle={styles.buttonStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    godMenu: {
        ...commonStyles.centeredContainer,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: widthProportion(2),
    },
    godCard: {
        ...commonStyles.centeredContainer,
        width: '32%',
        height: '100%',
        gap: widthProportion(2)
    },
    godCost: {
        ...commonStyles.centeredContainer,
        width: '90%',
        aspectRatio: 1,
        marginLeft: widthProportion(3),
        marginBottom: -heightProportion(5),
        zIndex: 2,
    },
    godPortrait: {
        ...commonStyles.centeredContainer,
        width: '90%',
        aspectRatio: 1,
    },
    godImage: {
        width: widthProportion(28),
        height: widthProportion(28),
        borderRadius: 100,
        borderWidth: 4,
        borderColor: 'black',
    },
    effectSequece: {
        height: '20%',
        backgroundColor: colors.light,
        padding: '3%',
        borderRadius: 10,
        borderWidth: widthProportion(1)

    },
    confirmMenu: {
        ...commonStyles.centeredContainer,
        justifyContent: "space-around",
        gap: heightProportion(3),
    },
    buttonText: {
        ...commonStyles.labelText,
        ...commonStyles.smallTextShadow,
        fontSize: fontSize.small,

    },
    buttonStyle: {
        backgroundColor: colors.lobbyRed,
        ...commonStyles.buttonStyle,
    },
})

export default PlayerGods
