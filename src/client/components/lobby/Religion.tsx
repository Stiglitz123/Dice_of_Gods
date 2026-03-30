/*
------------------------------------------------------------
Religion.tsx
Carte détaillée d’une religion: bannière, skill, die spécial et dieux associés avec leurs séquences d’effets.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native"
import { DICE_FACE, ICON_TYPE, ReligionData } from "@/common/types"
import GodWidget from "@/components/GodWidget"
import StyledButton from "../StyledButton"
import EffectSequence from "../EffectSequence"
import { BACKGROUND_IMAGES, RELIGION_IMAGES, SCROLL_IMAGES, SPRITESHEET } from "@/assets/images/imageData"
import { colors, fontSize, religionColors, spriteData } from "@/theme/theme"
import commonStyles from "@/theme/styles"
import { enumLength, heightProportion, widthProportion } from "@/service/utils"
import { FC } from "react"
import Sprite from "../Sprite"

export interface ReligionProps {
    data: ReligionData
    userReligion: number
    setReligion: (id: number) => void
}

const Religion: FC<ReligionProps> = ({ data, userReligion, setReligion}) =>{

    return (
        <ImageBackground
            source={BACKGROUND_IMAGES[data.id]}
            style={styles.container}
        >
            <View style={[
                commonStyles.horizontalContainer,
                styles.title
            ]}>
                <Image
                source={RELIGION_IMAGES[data.id]}
                style={styles.logo}
                />
                <Text style={[styles.titleText, { color: religionColors[data.id] }]}>
                    {data.name}
                </Text>

            </View>

            <ImageBackground
                source={SCROLL_IMAGES[data.id]}
                style={styles.scroll}
                resizeMode="contain"
            >
                <Sprite
                    source={SPRITESHEET['dice']}
                    totalFrames={spriteData.diceNumber}
                    frameIndex={spriteData.diceRollNumber + DICE_FACE.STAR}
                    size={{width: widthProportion(17), height: widthProportion(17)}}
                    style={{marginLeft: widthProportion(5), marginRight: -widthProportion(5)}}
                />
                <Sprite
                    source={SPRITESHEET['icon']}
                    frameIndex={ICON_TYPE.DOTS}                  
                    totalFrames={ enumLength(ICON_TYPE) }
                    size={{width: widthProportion(12), height: widthProportion(12)}}
                    // style={{marginLeft: -widthProportion(26), marginRight: -widthProportion(20)}}
                />
                <EffectSequence
                    icons={data.skill.iconSequence}
                    iconSize={widthProportion(15)}
                    style={{flex: 1, justifyContent: 'center', marginRight: widthProportion(10)}}
                >

                </EffectSequence>
            </ImageBackground>

            <View
                style={[
                    styles.gods,
                    { borderColor: religionColors[data.id] },
                ]}
            >
                {data.gods.map((god) => (
                    <GodWidget key={god.id} data={god} />
                ))}
            </View>
            <StyledButton
                text="Sélectionner"
                buttonStyle={[
                    styles.button,
                    { backgroundColor: religionColors[data.id] },
                ]}
                textStyle={styles.buttonText}
                disabled={userReligion == data.id}
                onPress={() => setReligion(data.id)}
            />
        </ImageBackground>
    )
}
export default Religion

const styles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        gap: heightProportion(1),
        justifyContent: "space-around",
    },
    title: {
        backgroundColor: colors.light,
        borderRadius: 35,
        borderWidth: 4,
        paddingHorizontal: widthProportion(2),
        marginTop: heightProportion(2),
    },
    titleText: {
        ...commonStyles.labelText,
        ...commonStyles.smallTextShadow,
        paddingVertical: heightProportion(0.5),
        paddingHorizontal: widthProportion(5),
        fontSize: fontSize.title,
    },
    logo: {
        width: widthProportion(17),
        aspectRatio: 1,
    },
    scroll: {
        width: "100%",
        height: heightProportion(14),
        ...commonStyles.horizontalContainer,
        justifyContent: 'flex-start',
        paddingBottom: heightProportion(3)
    },
    gods: {
        width: "90%",
        padding: 3,
        gap: 10,
        borderRadius: 25,
        borderWidth: 10,
        backgroundColor: colors.light + 'AB',
    },
    button: {
        ...commonStyles.buttonStyle,
        marginBottom: heightProportion(10)

    },
    buttonText: {
        ...commonStyles.labelText,
        ...commonStyles.bigTextShadow,
        fontSize: fontSize.medium,
    },
})
