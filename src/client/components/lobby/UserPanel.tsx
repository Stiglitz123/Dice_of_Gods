/*
------------------------------------------------------------
UserPanel.tsx
Panneau de profil dans le lobby affichant l’avatar, le pseudo, les trophées et un aperçu des artefacts/religion sélectionnés.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from "react"
import { View, Text, ImageBackground, Image, StyleSheet, Pressable } from "react-native"
import { colors, fonts, fontSize, size } from "@/theme/theme"
import { useGameStore } from "@/service/gameStore"
import { User } from "@/common/types"
import UserArtifacts from "./userArtifacts"
import ImageButton from "../ImageButton"
import { AVATAR_IMAGES, RELIGION_IMAGES } from "@/assets/images/imageData"
import commonStyles from "@/theme/styles"
import { getAdaptiveFontSize, heightProportion, widthProportion } from "@/service/utils"

export interface UserPanelProps {
    onAvatarPress?: (value: boolean) => void
    onArtifactPress?: () => void
    onReligionPress?: () => void
}
const UserPanel: FC<UserPanelProps> = ({onAvatarPress, onArtifactPress, onReligionPress}) => {
    const userInfo: User = useGameStore((s) => s.user)

    return (
        <View style={styles.userPanel}>            
            <View style={styles.pannelUpper}>
                <ImageButton
                    source={AVATAR_IMAGES[userInfo.avatar]}
                    style = {styles.avatar}
                    onPress={() => onAvatarPress(true)}
                />

                <Text 
                    style={[
                        styles.pannelName,
                        {fontSize: getAdaptiveFontSize(userInfo.name, fontSize.userName)}
                    ]}
                >
                    {userInfo.name}
                </Text>

                <ImageBackground
                    source={require("@/assets/images/UI/trophy.png")}
                    resizeMode="contain"
                    style={styles.trophy}
                >
                    <Text style={styles.trophyNumber}>
                        {Math.trunc(userInfo.trophy)}
                    </Text>
                </ImageBackground>
            </View>
            <View style={styles.pannelBottom}>
                <Pressable
                    style={({ pressed }) => [
                        pressed && commonStyles.pressed,
                        {width: '70%'}
                    ]}
                    onPress={onArtifactPress}
                >
                    <UserArtifacts
                        containerStyle={styles.grid}
                        artifactStyle={styles.miniArtifact}
                        disabled={true}
                    />
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        pressed && commonStyles.pressed,
                        styles.religionLogo,
                    ]}
                    onPress={onReligionPress}
                >
                    <Image
                        source={RELIGION_IMAGES[userInfo.religion]}
                        resizeMode="contain"
                        style={{width: '90%'}}
                    />
                </Pressable>

            </View>
        </View>
    )
}

export default UserPanel

const styles = StyleSheet.create({
    userPanel: {
        marginTop: heightProportion(3),
        backgroundColor: "black",
        flex: 1,
        borderColor: colors.light,
        borderRadius: 20,
        borderWidth: 3,
        padding: 10,
    },
    pannelUpper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
    },
    pannelBottom: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        gap: widthProportion(0.5),
    },
    avatar: {
        width: size.avatar + size.avatarBorder * 2,
        height: size.avatar + size.avatarBorder * 2,
        borderRadius: 50,
        borderWidth: size.avatarBorder,
        borderColor: colors.light,
    },
    pannelName: {
        fontFamily: fonts.ravenholm,
        color: colors.light,
        fontSize: fontSize.userName,
        flex: 1,
    },
    trophy: {
        justifyContent: "center",
        alignItems: "center",
        width: size.trophy,
        height: size.trophy,
    },
    trophyNumber: {
        color: colors.light,
        fontSize: fontSize.trophy,
        fontFamily: fonts.number,
    },

    grid: {
        ...commonStyles.horizontalContainer,
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: widthProportion(3),
        columnGap: 0,
    },
    miniArtifact: {
        width: size.artifactWidth,
        height: size.artifactHeight,
        transform: [{ scale: 0.70 }],
        margin: -20
    },
    religionLogo: {
        ...commonStyles.religionLogo,
        ...commonStyles.centeredContainer,
        width: '30%',
        padding: widthProportion(2),
    },
})
