/*
------------------------------------------------------------
EndMenu.tsx
Pop-up de fin de partie affichant victoire ou defaite selon le gagnant et offrant un retour vers le menu combat.
[Auteur : Frederic Desrosiers]
-------------------------------------------------------------
*/
import { FC, useEffect, useState } from "react"
import { ImageBackground, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"
import { useRouter } from "expo-router"
import { getItem } from "expo-secure-store"
import { SOCKET_EVENT } from "@/common/types"
import StyledButton from "@/components/StyledButton"
import commonStyles from "@/theme/styles"
import { colors, fonts, fontSize } from "@/theme/theme"
import { heightProportion, widthProportion } from "@/service/utils"
import { addCallback, removeCallback } from "@/service/gameCommand"
import { stopBGM } from "@/service/audioPlayer"
import { UI_IMAGES } from "@/assets/images/imageData"
import { RFValue } from "react-native-responsive-fontsize"

export interface EndMenuProps {
  playerId: number
}

const EndMenu: FC<EndMenuProps> = ({ playerId }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isVictory, setIsVictory] = useState<boolean>(false)
  const [trophy, setTrophy] = useState<number>(0)
  const router = useRouter()

  const handleGameEnded = (data: any) => {
    setIsVictory(data.winnerId === playerId)
    setTrophy(data.ratingChange)
    setVisible(true)
  }

  const returnToMenu = async () => {
    setVisible(false)
    router.replace("/(lobby)/combatTab")
  }

  useEffect(() => {
    addCallback(SOCKET_EVENT.GAME_ENDED, handleGameEnded)
    return () => removeCallback(SOCKET_EVENT.GAME_ENDED, handleGameEnded)
  }, [playerId])

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={[styles.container, {backgroundColor: isVictory? colors.lobbyGreen + 'bc' : colors.lobbyRed + 'bc'}]}>
        <Text style={styles.title}>
          {isVictory ? "Victoire" : "Défaite"}
        </Text>
        {trophy != 0 &&
          <ImageBackground
            source={UI_IMAGES['trophy']}
            resizeMode='contain'
            style={styles.trophyBackground}
          >
            <Text style={styles.trophyText}>{trophy > 0 ? '+' + trophy : trophy}</Text>

          </ImageBackground>
        
        }
        <StyledButton
          text="Quitter"
          onPress={returnToMenu}
          textStyle={styles.buttonText}
          buttonStyle={styles.button}
          onPressStyle={styles.pressed}
        />
      </View>
    </Modal>
  )
}

export default EndMenu

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.veryTransparentBlack,
  },
  container: {
    ...commonStyles.popUpMenu,
    top: "55%",
    alignItems: "center",
    justifyContent: "center",
    gap: heightProportion(3),
    borderColor: colors.light,
    borderWidth: 5,
    backgroundColor: colors.lobbyRed
  },
  title: {
    ...commonStyles.labelText,
    ...commonStyles.bigTextShadow,
    fontSize: fontSize.title,
  },
  victoryBorder: {
    borderColor: colors.lobbyGreen,
  },
  defeatBorder: {
    borderColor: colors.lobbyRed,
  },
  button: {
    ...commonStyles.buttonStyle,
    width: "80%",
    height: heightProportion(8),
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: widthProportion(1),
    backgroundColor: 'black',
    borderColor: colors.light
  },
  buttonText: {
    ...commonStyles.labelText,
    ...commonStyles.smallTextShadow,
    fontSize: fontSize.medium,
    color: colors.light,
  },
  pressed: {
    ...commonStyles.pressed,
  },

  trophyBackground: {
    width: widthProportion(22),
    aspectRatio: 1,
    backgroundColor: 'black',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyText: {
    fontFamily: fonts.number,
    color: colors.light,
    fontSize: RFValue(22)
  },
})
