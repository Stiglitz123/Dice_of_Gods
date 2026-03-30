/*
------------------------------------------------------------
StatusPanel.tsx
Liste les effets de statut actifs d’un joueur avec icônes, descriptions et durée restante animée.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from "react"
import { View, Text, StyleSheet } from "react-native"
import { PlayerPanelProps } from "./PlayerPanel"
import { ICON_TYPE, StatusEffect, StatusEffectData } from "@/common/types"
import { useGameStore } from "@/service/gameStore"
import commonStyles from "@/theme/styles"
import { statusEffectInfo } from "@/common/statusEffectsData"
import Sprite from "../Sprite"
import { SPRITESHEET } from "@/assets/images/imageData"
import { enumLength, heightProportion, STATUS_TO_ICON, widthProportion } from "@/service/utils"
import { colors, fonts, fontSize } from "@/theme/theme"
import Pulse from "../animation/Pulse"

export interface StatusEffectStatus {
    data: StatusEffectData
    remainingTurn: number
}



const StatusPanel: FC<PlayerPanelProps> = ({playerId, style}) => {

    const activeStatus: StatusEffect[] = useGameStore((s) => s.gameState?.players?.[playerId]?.activeStatus) ?? []
    const status: StatusEffectStatus[] = statusEffectInfo.map((s) => {
        const active = activeStatus.find((info) => info.type === s.type)
        return { data: s, remainingTurn: active?.remainingTurn ?? 0 }
    })

    if(!status || status.length == 0) return null

    return (
        <View 
            style={[
                styles.container,
                style,
            ]}
        >
            <Text style={styles.title}>Les Effets Divins</Text>
            <Text style={styles.intro}>Les effets se déclenchent au début du tour avant la phase de dés. Les effets ont une durée normale de 3 tours.</Text>
            <View style={styles.headerRow}>
                <Text style={[styles.text, styles.headerText]}>Type</Text>
                <Text style={[styles.text, styles.headerText, {marginRight: -widthProportion(4)}]}>Durée</Text>
            </View>
            {status.map((s) => (
                <View 
                    key={s.data.name}
                    style={[
                        commonStyles.horizontalContainer,
                        styles.statusWidget
                    ]}
                >
                    <View style={styles.content}>
                        <View style={styles.topRow}>
                            <Sprite
                                source={SPRITESHEET['icon']}
                                frameIndex={STATUS_TO_ICON[s.data.type]}
                                totalFrames={enumLength(ICON_TYPE)}
                                size={{ width: widthProportion(10), height: widthProportion(10) }}
                            />
                            <Text style={[styles.text, styles.name]}>{s.data.name}</Text>
                        </View>
                        <Text style={[styles.text, styles.description]}>{s.data.description}</Text>
                    </View>
                    <Pulse 
                        active={s.remainingTurn != 0}
                        scaling={1.4}
                    >
                        <Text style={[styles.text, styles.remaining]}>{s.remainingTurn}</Text>
                    </Pulse>
                </View>
            ))}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: widthProportion(1),
        ...commonStyles.centeredContainer,
    },
    title: {
        fontFamily: fonts.ravenholm,
        fontSize: fontSize.small,
        color: colors.light,
        textAlign: 'center',
        marginBottom: heightProportion(1),

    },
    intro: {
        fontFamily: fonts.number,
        fontSize: fontSize.description,
        color: colors.light,
        textAlign: 'center',
        width: '80%',
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontFamily: fonts.ravenholm,
        fontSize: fontSize.userName,
    },
    statusWidget: {
        width: '100%',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: colors.light + '88',
        backgroundColor: colors.transparentBlack,
        alignItems: 'center',
        columnGap: widthProportion(1),
    },
    text: {
        color: colors.light,
        fontFamily: fonts.number,
    },
    name: {
        fontSize: fontSize.trophy,
        fontFamily: fonts.ravenholm,
    },
    remaining: {
        fontSize: fontSize.small,
        minWidth: widthProportion(8),
        textAlign: 'right',
        fontFamily: fonts.number
    },
    description: {
        fontSize: fontSize.description,
    },
    content: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        columnGap: widthProportion(2),
    },
})

export default StatusPanel
