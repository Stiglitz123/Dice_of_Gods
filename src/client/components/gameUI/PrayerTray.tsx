/*
------------------------------------------------------------
PrayerTray.tsx
Affiche la jauge de prières disponible d’un joueur via des icônes actives/inactives.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React from "react"
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { useGameStore } from "@/service/gameStore"
import { UI_IMAGES } from "@/assets/images/imageData"

export interface PrayerTrayProps {
    playerIndex: number
    prayerNumber?: number
    style?: StyleProp<ViewStyle>
}

const PrayerTray: React.FC<PrayerTrayProps> = ({ playerIndex, prayerNumber = 4, style }) => {

    const playerPrayer: number = useGameStore((s) => s.gameState?.players?.[playerIndex]?.pp)

    return (

    <View style={style}>
        {Array.from({ length: prayerNumber }).map((_, i) => (
            <Image
            key={i}
            source={i < playerPrayer ? UI_IMAGES['prayer'] : UI_IMAGES['prayerE']}
            style={styles.prayer}
            resizeMode="contain"
            />
        ))}
    </View>

    )
}

const styles = StyleSheet.create({
    prayer: {
        width: '22%',
        aspectRatio: 1,
    },
})

export default PrayerTray
