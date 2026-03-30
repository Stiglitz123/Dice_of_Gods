/*
------------------------------------------------------------
styles.ts
Styles réutilisables pour l’interface (layouts, boutons, ombres) basés sur le thème global.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { StyleSheet } from 'react-native'
import { fonts, fontSize, size, colors, padding } from './theme'
import { widthProportion, heightProportion } from '@/service/utils'


const commonStyles = StyleSheet.create({
    margin: {
        marginHorizontal: widthProportion(1),
        marginVertical: heightProportion(1),
    },
    padding: {
        paddingHorizontal: widthProportion(3),
        paddingVertical: heightProportion(1),
    },
    mainBlack: {
        flex: 1,
        backgroundColor: 'black'
    },
    mainLight: {
        flex: 1,
        backgroundColor: colors.light
    },
    cover: {
        width: '100%',
        height: '100%',
    },
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonFrame: {
        borderWidth: 4,
        borderRadius: 3,
        padding: 2,
        borderColor: 'blue',
        backgroundColor: 'white',
    },
    absoluteFill : {
        flex: 1,
        position: 'absolute',
    },
    relativeFill: {
        flex: 1,
        position: 'relative'
    },
    bigTextShadow: {
        textShadowColor: "black",
        textShadowOffset: { width: 2, height: 4 },
        textShadowRadius: 2,
    },
    smallTextShadow: {
        textShadowColor: "black",
        textShadowOffset: { width: 0.5, height: 1 },
        textShadowRadius: 1,
    },
    centeredContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    horizontalContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    labelText: {
        textAlign: 'center',
        fontFamily: fonts.ravenholm,
        color: colors.light,
    },
    religionLogo: {
        boxSizing: 'border-box',
        borderRadius: 200,
        borderWidth: 5,
        borderColor: 'black',
        backgroundColor: colors.light,
        aspectRatio: 1,
    },
    popUpMenu: {
        position: "absolute",
        top: "20%",
        alignSelf: "center",
        width: "90%",
        backgroundColor: "#111",
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colors.light,
        padding: 20,
    },
    buttonStyle: {
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 5,
        padding: 10,
    },
    pressed: {
        transform: [{ scale: 0.95 }],
        filter: [{brightness: 0.7}]
    },
    dim: {
        filter: [{brightness: 0.8}]
    },
    usable: {
        filter: [{brightness: 1.2}]
    },
    disabled: {
        filter: [{brightness: 0.5}]
    },
})



export const effectStyle = StyleSheet.create( {
    artifactContainer: {
        position: 'absolute',
        top: 30,
        left: -10,
        width: size.artifactTwoEffectWidth,
        height: size.artifactEffectsHeight,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: colors.dark,
    }
})
export default commonStyles
