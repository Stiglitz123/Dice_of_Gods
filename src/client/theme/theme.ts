/*
------------------------------------------------------------
theme.ts
Définit les couleurs, tailles, polices et données de sprites utilisées par l’UI cliente.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { RFValue } from 'react-native-responsive-fontsize'
import { widthProportion, heightProportion } from '@/service/utils'


const DICE_FRAME_NB : number = 13

export const religionColors: Record<number, string> = {
    1: '#2f4299',
    2: '#109200',
    3: '#f0c020',
    4: '#c42020ff',
}


export const fonts = {
    ravenholm: 'Ravenholm',
    number: 'Fredoka',
}

export const fontSize = {
    description: RFValue(9),
    artifactName: RFValue(15),
    godName: RFValue(25),
    userName: RFValue(25),
    trophy: RFValue(15),
    big: RFValue(70),
    medium: RFValue(45),
    small: RFValue(32),
    title: RFValue(55),
}

export const spriteData = {
    
    digitsNumber: 10,
    digitsSize: 10,
    diceNumber: 13,
    diceRollNumber: 8,
    diceFaceNumber: 5,
}

export const size = {
    artifactWidth: widthProportion(40),
    artifactHeight: heightProportion(12.5),
    // artifactHeightLarge: heightProportion(12.5),
    artifactWidthLarge: widthProportion(90),
    artifactEffectsHeight: heightProportion(3.5),
    artifactOneEffectWidth: widthProportion(13),
    artifactTwoEffectWidth: widthProportion(20),
    artifactThreeEffectWidth: widthProportion(27),
    divineSymbol: widthProportion(5),
    religionLogo: widthProportion(22),
    avatar: widthProportion(15),
    avatarBorder: 4,
    trophy: widthProportion(17),

    

    dice: 80,
    diceSpritesheet: 80 * DICE_FRAME_NB
}


export const colors = {
    light: '#f5eae0',
    dark: '#5F3B05',
    lobbyGreen: '#458d27',
    lobbyRed: '#9c0505',
    transparentBlack: 'rgba(0, 0, 0, 0.7)',
    veryTransparentBlack:'rgba(0, 0, 0, 0.4)',
    activated: '#b54718'
}

export const padding = {
    HorizontalNormal: widthProportion(2)
}
