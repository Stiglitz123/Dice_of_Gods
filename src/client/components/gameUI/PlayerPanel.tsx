/*
------------------------------------------------------------
PlayerPanel.tsx
Affiche le profil d’un joueur en partie (avatar, HP, bouclier, statuts, dés, PP) avec indicateur du joueur actif.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import {FC, useState} from "react"
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native"
import HP from "./HP"
import Shield from "./Shield"
import PP from "./PP"
import ImageButton from "../ImageButton"
import { colors, fonts, fontSize, religionColors } from "@/theme/theme"
import { COMMAND_NAME, PHASE_NAME, Player } from "@/common/types"
import { useGameStore } from "@/service/gameStore"
import commonStyles from "@/theme/styles"
import { AVATAR_IMAGES } from "@/assets/images/imageData"
import PlayerStatus from "./PlayerStatus"
import { getAdaptiveFontSize, heightProportion, widthProportion } from "@/service/utils"
import RerollUI from "./RerollUI"
import EnchantUI from "./EnchantUI"
import Timer from "./Timer"
import PauseMenu from "./PauseMenu"
import { sendCommand } from "@/service/gameCommand"

export interface PlayerPanelProps {
    playerId: number
    value?: number
    altView?: boolean
    style?: StyleProp<ViewStyle>
}
const PlayerPanel: FC<PlayerPanelProps> = ({playerId, style}) => {

    const player: Player = useGameStore((s) => s.gameState?.players?.[playerId])
    const phase: string = useGameStore((s) => s.gameState?.phase)
    const activePlayerId: number = useGameStore((s) => s.gameState.activePlayer)
    const [menuOpen, setOpenMenu] = useState<boolean>(false)

    

    if(!player) return null

    return (
        <View 
            style={[
                style,
                {borderColor: playerId == activePlayerId ? colors.light: undefined}
            ]}
        >
            <PauseMenu
                visible={menuOpen}
                onClose={() => setOpenMenu(false)}
                onContinue={() => setOpenMenu(false)}
                onAbandon={() => {
                    setOpenMenu(false)
                    sendCommand(COMMAND_NAME.FORFEIT)
                }}
            />
            <View style={{width: '75%'}}>
                <View style={styles.topSection}>
                    <ImageButton
                        source={AVATAR_IMAGES[player?.user.avatar]}
                        style = {styles.avatar}
                        onPress={() => setOpenMenu(true)}
                    />
                    <Text 
                        style={[
                            styles.playerName,
                            {fontSize: getAdaptiveFontSize(player.user.name, fontSize.userName)}
                        ]}
                    >
                        {player.user.name}
                    </Text> 
                </View>
                <View style={styles.bottomSection}>
                    <HP playerId={playerId} value={player.hp}/>
                    <Shield playerId={playerId} value={player.shield}/>
                    <PlayerStatus playerId={playerId}/>
                </View>
            </View>
            <View style={[styles.rightSection, commonStyles.centeredContainer]}>
                <Timer playerId={playerId}/>
                {phase == PHASE_NAME.ACTION ?
                   <EnchantUI
                        playerId={playerId}
                        value={player.enchantedDice}
                    /> 
                :   <RerollUI 
                        playerId={playerId} 
                        value={player.rerollCount}
                    />
                }
                <PP playerId={playerId} value={player.pp}/>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    bottomSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        columnGap: 15,
    },
    topSection: {
        ...commonStyles.horizontalContainer,
        justifyContent: 'flex-start',
        width: '100%',
        gap: widthProportion(2),
        // ...commonStyles.padding
    },
    rightSection: {
        width: '25%',
        gap: heightProportion(1)
    },
    playerName: {
        fontFamily: fonts.ravenholm,
        fontSize: fontSize.small,
        color: colors.light
    },
    avatar: {
        width: '20%',
        aspectRatio: 1,
        borderRadius: 50,
    },
    active: {
       borderColor: 'yellow'
    },
})

export default PlayerPanel
