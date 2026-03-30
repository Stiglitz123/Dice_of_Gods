/*
------------------------------------------------------------
AvatarMenu.tsx
Sélecteur modal d’avatar avec grille d’images et retour sonore lors du choix.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from "react";
import { View, StyleSheet, Modal, Text, TouchableWithoutFeedback } from "react-native";
import ImageButton from "@/components/ImageButton";
import { AVATAR_IMAGES } from "@/assets/images/imageData";
import { widthProportion } from "@/service/utils";
import { colors, fontSize } from "@/theme/theme";
import commonStyles from "@/theme/styles";
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { SFX } from "@/assets/audio/audioData";

export interface PopUpMenuProps {
    onClose: () => void;
    onSelect: (index: number) => void;
    visible?: boolean;
}

const AvatarMenu: FC<PopUpMenuProps> = ({ visible = true, onClose, onSelect }) => {
  const audioPlayer: AudioPlayer = useAudioPlayer(SFX['select'])

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* CONTENT */}
      <View style={styles.container}>
        <Text style={styles.title}>Avatar</Text>
        {Object.values(AVATAR_IMAGES).map((src, index) => (
          <ImageButton
            key={index}
            source={src}
            onPress={() => {
              audioPlayer.seekTo(0)
              audioPlayer.play()
              onSelect(index+1)
            }}
            style={styles.button}
          />
        ))}
      </View>
    </Modal>
  );
};

export default AvatarMenu;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.transparentBlack,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    ...commonStyles.labelText,
    ...commonStyles.bigTextShadow,
    fontSize: fontSize.big
  },

  container: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#111",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.light,
    padding: 20,

    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 12,
  },

  button: {
    width: widthProportion(30),
    aspectRatio: 1,
    marginBottom: 12,
    borderColor: colors.light,
    borderWidth: 3,
    borderRadius: 100,
  },
});
