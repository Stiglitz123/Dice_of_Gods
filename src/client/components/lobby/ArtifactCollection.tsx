/*
------------------------------------------------------------
ArtifactCollection.tsx
Liste les artefacts non équipés du joueur dans le lobby et permet d’en sélectionner un avec retour audio.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from "react";
import { FlatList, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import commonStyles from "@/theme/styles";
import { useGameStore } from "@/service/gameStore";
import Artifact from "../Artifact";
import { ArtifactData } from "@/common/types";
import { colors, fontSize, size } from "@/theme/theme";
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { SFX } from "@/assets/audio/audioData";


export interface ArtifactCollectionProps {
  activeArtifact: ArtifactData | null
  setActiveArtifact: (artifact: ArtifactData | null) => void
  listStyle?: StyleProp<ViewStyle>
  elementStyle?: StyleProp<ViewStyle>
}

const ArtifactCollection: FC<ArtifactCollectionProps> = ({ activeArtifact, setActiveArtifact, listStyle, elementStyle}) => {
    const gameArtifacts: ArtifactData[] = useGameStore((s) => s.gameValues.artifacts)
    const userArtifacts: number[] = useGameStore((s) => s.user.artifacts)
    const artifacts: ArtifactData[] = gameArtifacts.filter((a) => !userArtifacts.includes(a.id))
    const audioPlayer: AudioPlayer = useAudioPlayer(SFX['card_pick'])
    

  return (
    <FlatList
      data={artifacts}
      showsVerticalScrollIndicator={true}
      style={listStyle}
      numColumns={2}
      contentContainerStyle={{
      }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View
          style={elementStyle}
        >
          <Artifact
            data={item}
            style={{width:size.artifactWidth, height:size.artifactHeight}}
            onPress={() =>  {
              setActiveArtifact(item)
              audioPlayer.seekTo(0)
              audioPlayer.play()
            }}
          />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
    textStyle: {
        ...commonStyles.labelText,
        ...commonStyles.smallTextShadow,
        fontSize: fontSize.medium,

    },
    buttonStyle: {
        backgroundColor: colors.lobbyRed,
        ...commonStyles.buttonStyle,
    },
})
export default ArtifactCollection
