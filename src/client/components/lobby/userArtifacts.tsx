/*
------------------------------------------------------------
userArtifacts.tsx
Affiche les artefacts possédés par l’utilisateur dans le lobby et déclenche une animation/son lors de la sélection.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC } from "react"
import { View, ViewStyle, StyleProp } from "react-native"
import Artifact from "../Artifact"
import { ArtifactData } from "@/common/types"
import { getArtifactById } from "@/service/gameCommand"
import { useGameStore } from "@/service/gameStore"
import Wiggle from "../animation/Wiggle"
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { SFX } from "@/assets/audio/audioData";

export interface UserArtifactsProps {
    setActiveArtifact?: (artifact: ArtifactData | null) => void
    containerStyle?: StyleProp<ViewStyle>
    artifactStyle?: StyleProp<ViewStyle>
    disabled?: boolean
}


const UserArtifacts: FC<UserArtifactsProps> = ({setActiveArtifact, containerStyle, artifactStyle, disabled = false}) => {

    const artifactIds: number[] = useGameStore((s) => s.user.artifacts)
    const audioPlayer: AudioPlayer = useAudioPlayer(SFX['artifact_change'])
    return (
        <View style={containerStyle}>
          {artifactIds.map((id) => {
            const data: ArtifactData = getArtifactById(id)
            const artifact = (
              <Artifact
                key={id}
                data={data}
                style={artifactStyle}
                disabled={disabled}
                onPress={() => {
                  setActiveArtifact?.(data)
                  audioPlayer.seekTo(0)
                  audioPlayer.play()
                }}
              />
            )

            if (disabled) return artifact

            return (
              <Wiggle key={id} active={true}>
                {artifact}
              </Wiggle>
            )
          })}
        </View>
    )
}

export default UserArtifacts
