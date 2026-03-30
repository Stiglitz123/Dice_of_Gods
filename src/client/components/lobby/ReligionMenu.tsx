/*
------------------------------------------------------------
ReligionMenu.tsx
Menu modal listant les religions disponibles avec icônes et sons, permettant de changer la religion du joueur.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Pressable,
  Image,
} from "react-native";
import { RELIGION_IMAGES } from "@/assets/images/imageData";
import { heightProportion, widthProportion } from "@/service/utils";
import { colors, fontSize, religionColors } from "@/theme/theme";
import commonStyles from "@/theme/styles";
import { PopUpMenuProps } from "./AvatarMenu";
import { useGameStore } from "@/service/gameStore";
import { ReligionData } from "@/common/types";
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { SFX } from "@/assets/audio/audioData";

const ReligionMenu: FC<PopUpMenuProps> = ({ visible = true, onClose, onSelect }) => {
  const religions: ReligionData[] = useGameStore((s) => s.gameValues.religions)
  const audioPlayer: AudioPlayer = useAudioPlayer(SFX['select'])

  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* CONTENT */}
      <View style={styles.container}>
        <Text style={styles.title}>Religion</Text>

        {religions.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => {
              audioPlayer.seekTo(0)
              audioPlayer.play()
              onSelect(r.id)
            }}
            style={({ pressed }) => [
              styles.button,
              pressed && commonStyles.pressed,
            ]}
          >
            <Text style={[styles.label, {color: religionColors[r.id]}]}>{r.name}</Text>
            <Image 
                source={RELIGION_IMAGES[r.id]}
                style={styles.icon}
            />
          </Pressable>
        ))}
      </View>
    </Modal>
  );
};

export default ReligionMenu;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.transparentBlack,
  },

  title: {
    width: "100%",
    textAlign: "center",
    ...commonStyles.labelText,
    ...commonStyles.bigTextShadow,
    fontSize: fontSize.big,
    marginBottom: 20,
  },

  container: {
    ...commonStyles.popUpMenu,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: heightProportion(1),
  },

  // One religion entry
  button: {
    width: '90%',
    paddingHorizontal: widthProportion(2),
    paddingVertical: '1%',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: colors.light,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-around',
  },


  label: {
    ...commonStyles.labelText,
    ...commonStyles.smallTextShadow,
    fontSize: fontSize.medium,
    textAlign: 'left',
    width: '70%',
  },

  icon: {
    width: '20%',
    aspectRatio: 1,
  },
});
