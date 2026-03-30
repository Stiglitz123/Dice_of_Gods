/*
------------------------------------------------------------
PauseMenu.tsx
Menu pause modal inspiré des pop-up du lobby avec deux actions
et fermeture possible en touchant l'extérieur.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from "react"
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import { UI_IMAGES } from "@/assets/images/imageData"
import ButtonCombo from "@/components/common/ButtonCombo"
import { colors, fontSize } from "@/theme/theme"
import commonStyles from "@/theme/styles"
import { heightProportion, widthProportion } from "@/service/utils"

export interface PauseMenuProps {
  visible?: boolean
  onClose: () => void
  onContinue: () => void
  onAbandon: () => void
}

const PauseMenu: FC<PauseMenuProps> = ({
  visible = true,
  onClose,
  onContinue,
  onAbandon,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <ButtonCombo
          text="Continuer"
          onPress={onContinue}
          imageSource={UI_IMAGES["swords"]}
          imageStyle={styles.image}
          imageContainerStyle={styles.imageContainer}
          buttonStyle={[styles.button, {backgroundColor: colors.lobbyGreen}]}
          textStyle={styles.text}
        />

        <ButtonCombo
          text="Abandonner"
          onPress={onAbandon}
          imageSource={UI_IMAGES["surrender"]}
          imageStyle={styles.image}
          imageContainerStyle={styles.imageContainer}
          buttonStyle={[styles.button, styles.quitButton]}
          textStyle={styles.text}
        />
      </View>
    </Modal>
  )
}

export default PauseMenu

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.transparentBlack,
  },
  container: {
    ...commonStyles.popUpMenu,
    top: '30%',
    alignItems: "center",
    justifyContent: "center",
    gap: heightProportion(3),
  },
  button: {
    ...commonStyles.buttonStyle,
    justifyContent: 'flex-start',
    gap: widthProportion(3),
    width: "90%",
    height: heightProportion(9),
    borderColor: colors.light,
    borderWidth: 4,
    borderRadius: 14,
  },
  continueButton: {
    backgroundColor: colors.activated,
  },
  quitButton: {
    backgroundColor: colors.lobbyRed,
  },
  text: {
    ...commonStyles.labelText,
    ...commonStyles.smallTextShadow,
    fontSize: fontSize.small,
  },
  imageContainer: {
    marginBottom: heightProportion(1),
  },
  image: {
    height: "120%",
    aspectRatio: 1,
  },
  pressed: {
    ...commonStyles.pressed,
  },
})
