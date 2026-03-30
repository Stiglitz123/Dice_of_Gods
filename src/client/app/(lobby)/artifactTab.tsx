/*
------------------------------------------------------------
artifactTab.tsx
Onglet artefacts du lobby: visualisation des artefacts équipés et de la collection, avec sélection/échange et feedback audio.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { useEffect, useState, JSX } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import ArtifactCollection from '@/components/lobby/ArtifactCollection'
import UserArtifacts from '@/components/lobby/userArtifacts'
import commonStyles from '@/theme/styles'
import { ArtifactData, COMMAND_NAME } from '@/common/types'
import { colors, fonts, fontSize, size } from '@/theme/theme'
import { sendCommand } from '@/service/gameCommand'
import { heightProportion, widthProportion } from '@/service/utils'
import Float from '@/components/animation/Float'
import Artifact from '@/components/Artifact'
import StyledButton from '@/components/StyledButton'
import ButtonCombo from '@/components/common/ButtonCombo'
import { UI_IMAGES } from '@/assets/images/imageData'
import { SFX } from '@/assets/audio/audioData'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'

export default function artifact(): JSX.Element {

  const [activeUserArtifact, setActiveUserArtifact] = useState<ArtifactData | null>(null)
  const [activeArtifact, setActiveArtifact] = useState<ArtifactData | null>(null)
  const [statsMenu, setStatsMenu] = useState<boolean>(false)
  const audioPlayer: AudioPlayer = useAudioPlayer(SFX['select'])


  const playSound = () => {
    audioPlayer.seekTo(0)
    audioPlayer.play()
  }
  useEffect(() => {
    if (activeArtifact && activeUserArtifact) {
      sendCommand(COMMAND_NAME.SWAP_ARTIFACT, activeUserArtifact.id, activeArtifact.id)
      setActiveArtifact(null)
      setActiveUserArtifact(null)
    }
    }
  , [activeUserArtifact])

  return (
    <View style={[commonStyles.mainBlack]}>
      <View style= {styles.upperPart}>
        <Text 
          style={styles.title}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          Mes Artefacts
        </Text>
        <UserArtifacts
          setActiveArtifact={setActiveUserArtifact}
          containerStyle={styles.grid}
          artifactStyle={{ width:size.artifactWidth, height:size.artifactHeight, transform: [{ scale: 1.2 }] }}
          disabled={!activeArtifact}
        />
      </View>
      {!activeArtifact &&
        <View style={styles.bottomPart}>
          <View style={styles.buttonMenu}>
            <ButtonCombo
              text='Collection'
              textStyle={[styles.textStyle, {fontSize: fontSize.userName}]}
              buttonStyle={[
                commonStyles.buttonStyle,
                styles.menuButton,
                {backgroundColor: statsMenu ? colors.dark : colors.activated}
                ]}
              imageContainerStyle={{marginBottom: heightProportion(2)}}
              imageSource={UI_IMAGES['deck']}
              imageStyle={{height: '160%', aspectRatio: 1}}
              onPress={() => {
                setStatsMenu(false)
                playSound()
              }}
            />
            <ButtonCombo
              text='Analyse'
              textStyle={[styles.textStyle, {fontSize: fontSize.userName}]}
              buttonStyle={[
                commonStyles.buttonStyle,
                styles.menuButton, {backgroundColor: statsMenu ? colors.activated : colors.dark }
              ]}
              imageContainerStyle={{marginBottom: heightProportion(2)}}
              imageSource={UI_IMAGES['stats']}
              imageStyle={{height: '140%', aspectRatio: 1}}
              onPress={() => {
                setStatsMenu(true)
                playSound()
              }}
            />
          </View>
          {!statsMenu &&
            <ArtifactCollection
              activeArtifact={activeArtifact}
              setActiveArtifact={setActiveArtifact}
              listStyle={styles.collection}
              elementStyle={styles.collectionElement}
            /> 
          }
          {statsMenu &&
            <ScrollView style={[styles.collection,]}>
              <Text style={styles.textStyle}>À venir...</Text>
            </ScrollView> 
          }
        </View>
      }
      {activeArtifact && 
        <View style={[
            styles.collection,
            styles.confirmMenu,
          ]}
        >
            <Float>
              <Artifact
                  data={activeArtifact}
                  style={[
                    {width: size.artifactWidth, height: size.artifactHeight, transform:[{scale: 1.7}]},
                    {marginTop: heightProportion(2)}
                  ]}
              />
            </Float>
            <StyledButton
                text='Annuler'
                onPress={() => {
                  setActiveArtifact(null)
                  playSound()
                }}
                textStyle={styles.textStyle}
                buttonStyle={styles.cancelBtnStyle}
            >
            </StyledButton>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  upperPart: {
    ...commonStyles.mainBlack,
    ...commonStyles.centeredContainer,
    borderBottomWidth: widthProportion(1.5),
    borderColor: colors.light,
    marginBottom: heightProportion(3)
  },

  bottomPart: {
    height:'52%',
    ...commonStyles.centeredContainer,
    backgroundColor: 'black',
    gap: heightProportion(1)
  },

  buttonMenu: {
    ...commonStyles.horizontalContainer,
    width: '100%',
    height: heightProportion(8),
    borderRadius: 20,
    marginBottom: -heightProportion(1),
    gap: widthProportion(2)
  },
  title: {
      fontFamily: fonts.ravenholm,
      color: colors.light,
      fontSize: fontSize.medium,
      marginBottom: heightProportion(2),
      marginTop: -heightProportion(2),
  },
  grid: {
        ...commonStyles.horizontalContainer,
        justifyContent: 'center',
        flexWrap: 'wrap',
        rowGap: widthProportion(6),
        columnGap: widthProportion(9),
  },
  collection: {
    width: '100%',
    marginBottom: heightProportion(5),
    backgroundColor: colors.dark,
    borderRadius: 7,
    borderColor: colors.light,
    borderWidth: 3,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  collectionElement: {
    width: '50%',
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",  
    marginVertical: heightProportion(1)
  },
  confirmMenu: {
    ...commonStyles.centeredContainer,
    height: '45%',
    gap: heightProportion(7),
  },
  textStyle: {
        ...commonStyles.labelText,
        ...commonStyles.smallTextShadow,
        fontSize: fontSize.medium,

    },
    cancelBtnStyle: {
        backgroundColor: colors.lobbyRed,
        ...commonStyles.buttonStyle,
    },
    menuButton: {
      height: '100%', 
      width: '49%', 
      backgroundColor: colors.dark,
      borderColor: colors.light,
      fontSize: fontSize.small,
      borderWidth: 3,
      borderBottomWidth: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
})
