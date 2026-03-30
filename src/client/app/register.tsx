/*
------------------------------------------------------------
register.tsx
Écran d’inscription utilisateur : saisie du pseudo, choix avatar/religion via menus et envoi de la commande register.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import StyledButton from "@/components/StyledButton"
import { useEffect, useState, JSX} from "react"
import { View, Text, TextInput, ImageBackground, StyleSheet, Image } from "react-native"
import commonStyles from "@/theme/styles"
import { addCallback, register, removeCallback } from "@/service/gameCommand"
import { SOCKET_EVENT } from "@/common/types"
import { router } from "expo-router"
import { AVATAR_IMAGES, BACKGROUND_IMAGES, RELIGION_IMAGES, UI_IMAGES } from "@/assets/images/imageData"
import { colors, fonts, fontSize, religionColors } from "@/theme/theme"
import { heightProportion } from "@/service/utils"
import AvatarMenu from "@/components/lobby/AvatarMenu"
import ImageButton from "@/components/ImageButton"
import ReligionMenu from "@/components/lobby/ReligionMenu"
import Toast from "react-native-toast-message"

export default function Register(): JSX.Element {
  const [username, setUsername] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1) 
  const [selectedReligion, setSelectedReligion] = useState<number>(1)
  const [avatarMenu, setAvatarMenu] = useState<boolean>(false)
  const [religionMenu, setReligionMenu] = useState<boolean>(false)
  const usernameValid = username.length >= 3 && username.length <= 12

  const handleSubmit = () => {
    if (usernameValid) {
      register(username, selectedAvatar, selectedReligion)
    }
    else {
      Toast.show({
        type: 'hint',
        position: 'bottom',
        props: {message: 'Le Pseudonyme doit être entre 3 et 12 caractères'},
      })
    }
  }

  const returnToLobby = () => {
    router.replace('/')
  }
  const showError = (message: string) => {
    Toast.show({
      type: 'hint',
      position: 'bottom',
      props: {message: message},
    })
  }

  useEffect(() => {
    addCallback(SOCKET_EVENT.USER_INFO, returnToLobby)
    addCallback(SOCKET_EVENT.ERROR, showError)
    return () => {
        removeCallback(SOCKET_EVENT.USER_INFO, returnToLobby)
        removeCallback(SOCKET_EVENT.ERROR, showError)
    }
  })

  useEffect(() => {
    setAvatarMenu(false)
    setReligionMenu(false)
  }, [selectedAvatar, selectedReligion])

  return (
    <ImageBackground 
      style={styles.container}
      source={BACKGROUND_IMAGES[0]}
    >
      <Image
        source={UI_IMAGES['title']}
        style={styles.title}
        resizeMode="contain"
      />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pseudonyme</Text>
        <TextInput
          style={styles.input}
          placeholder='Zeus'
          placeholderTextColor="gray"
          maxLength={12}
          value={username}
          onChangeText={(t) => setUsername(t)}
        />
      </View>

      <View style={styles.horizontalSection}>
        <View style={[styles.section, {width: '47%'}]}>
          <Text style={styles.sectionTitle}>Avatar</Text>
          <ImageButton
            source={AVATAR_IMAGES[selectedAvatar]}
            onPress={() => setAvatarMenu(true)}
            style={styles.imageButton}
          />
        </View>
        <View style={[styles.section, {width: '47%'}]}>
          <Text style={styles.sectionTitle}>Religion</Text>
          <ImageButton
            source={RELIGION_IMAGES[selectedReligion]}
            onPress={() => setReligionMenu(true)}
            style={[styles.imageButton, styles.religionButton]}
            imageStyle= {{width: '90%', height: '90%'}}
          />
        </View>
      </View>

      {avatarMenu && (
        <AvatarMenu
          onClose={() => setAvatarMenu(false)}
          onSelect={(index) => {
            setSelectedAvatar(index)
            setAvatarMenu(false)
          }}
        />
      )}
      {religionMenu && (
        <ReligionMenu
          onClose={() => setReligionMenu(false)}
          onSelect={(index) => {
            setSelectedReligion(index)
            setReligionMenu(false)
          }}
        />
      )}

      {/* SUBMIT BUTTON */}
      <StyledButton
        text="Confirmer"
        buttonStyle={[
          styles.button, 
          {backgroundColor: religionColors[selectedReligion]},
          !usernameValid && commonStyles.disabled
        ]}
        textStyle={styles.buttonText}
        onPress={handleSubmit}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: 'space-around',
    gap: heightProportion(5),
  },
  section: {
    width: '100%',
    ...commonStyles.centeredContainer,
    gap: heightProportion(0.5)
    
  },
  horizontalSection: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.transparentBlack,
    ...commonStyles.padding,
  },
  title: {
    width: '100%',
    height: heightProportion(12),
    marginTop: heightProportion(10),
  },
  sectionTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: fontSize.medium,
    fontFamily: fonts.ravenholm,
    color: colors.light,
    ...commonStyles.bigTextShadow
  },
  input: {
    width: "80%",
    ...commonStyles.padding,
    backgroundColor: "black",
    color: colors.light,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "grey",
    fontSize: fontSize.userName,
    fontFamily: fonts.ravenholm
  },
  imageButton: {
    width: '90%',
    aspectRatio: 1,
  },
  religionButton: {
    ...commonStyles.religionLogo,
    ...commonStyles.padding,
  },
  button: {
    ...commonStyles.buttonStyle,
    marginBottom: heightProportion(10),
  },
  buttonText: {
    ...commonStyles.labelText,
    ...commonStyles.bigTextShadow,
    fontSize: fontSize.medium

  },
})
