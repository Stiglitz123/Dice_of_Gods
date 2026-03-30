/*
------------------------------------------------------------
toastConfig.tsx
Configuration des toasts (victoire, défaite, file, indices) avec dégradés, icônes et styles associés.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { ToastConfig, ToastConfigParams } from 'react-native-toast-message'
import Sprite from '@/components/Sprite'
import Artifact from '@/components/Artifact'
import GodWidget from '@/components/GodWidget'
import { ArtifactData } from '@/common/types'
import { GodData } from '@/common/types'
import { SPRITESHEET } from '@/assets/images/imageData'
import { colors, fonts, fontSize, size, spriteData } from './theme'
import { heightProportion, widthProportion } from '@/service/utils'


const VictoryToast = () => (
  <LinearGradient
    colors={['#00C851', '#007E33']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.container, styles.shadowGreen]}
  >
    <Ionicons name="flash" size={40} color="#fff" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={[styles.title, styles.textShadow]}>
        Victoire divine
      </Text>
    </View>
  </LinearGradient>
)

const DefeatToast = () => (
  <LinearGradient
    colors={['#ff4444', '#CC0000']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.container, styles.shadowRed]}
  >
    <Ionicons name="skull" size={40} color="#fff" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={[styles.title, styles.textShadow]}>
        Défaite
      </Text>
    </View>
  </LinearGradient>
)

const QueueToast = () => (
  <LinearGradient
    colors={['#000000ff', '#2b1700ff']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.container, styles.shadowRed]}
  >
    <Ionicons name='hourglass' size={40} color="#fff" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={[styles.title, styles.textShadow]}>
        Recherche d'adversaire...
      </Text>
    </View>
  </LinearGradient>
)

const HintToast = ({ props }: ToastConfigParams<any>) => {
  const message = props?.message ?? "Hint";
  return (
    <LinearGradient
      colors={['#3b0007ff', '#2b1700ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {borderColor: colors.light}
      ]}
    >
      <Ionicons name='warning' size={40} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, styles.textShadow]}>
          {message}
        </Text>
      </View>
    </LinearGradient>
  )
}

type ArtifactToastProps = {
  artifactData: ArtifactData
}

const ArtifactToast = ({ props }: ToastConfigParams<ArtifactToastProps>) => {
  if (!props?.artifactData) return null

  return (
    <View style={styles.artifactContainer}>
      <Artifact
        data={props.artifactData}
        style={{width:size.artifactWidth, height:size.artifactHeight, transform: [{ scale: 1.2 }]}}
        disabled
      />
    </View>
  )
}

type BannerToastProps = {
  image: ImageSourcePropType
  text: string
}

const BannerToast = ({ props }: ToastConfigParams<BannerToastProps>) => {
  if (!props?.image || !props?.text) return null

  return (
    <View style={styles.bannerContainer}>
      <Image source={props.image} style={styles.bannerImage} resizeMode="contain" />
      <Text style={[styles.bannerText, styles.textShadow]}>{props.text}</Text>
    </View>
  )
}

type DiceToastProps = {
  value: number
}

const DiceToast = ({ props }: ToastConfigParams<DiceToastProps>) => {
  if (props?.value === undefined || props?.value === null) return null
  const frameIndex = spriteData.diceRollNumber + props.value

  return (

      <Sprite
        source={SPRITESHEET['dice']}
        style={{marginTop: '42%'}}
        totalFrames={spriteData.diceNumber}
        frameIndex={frameIndex}
        size={{ width: widthProportion(22), height: widthProportion(22) }}
      />
  )
}

type GodToastProps = {
  data: GodData
}

const GodToast = ({ props }: ToastConfigParams<GodToastProps>) => {
  if (!props?.data) return null

  return (
      <GodWidget
        data={props.data}
        disabled={true}
        style={{marginTop: '42%', transform:[{scale: 0.9}]}}
      />
  )
}

const toastConfig: ToastConfig = {
  victory: () => <VictoryToast/>,
  defeat: () => <DefeatToast/>,
  queue: () => <QueueToast/>,
  hint: (params) => <HintToast {...params}/>,
  artifact: (params) => <ArtifactToast {...params} />,
  banner: (params) => <BannerToast {...params} />,
  dice: (params) => <DiceToast {...params} />,
  god: (params) => <GodToast {...params} />,
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    borderColor: 'black',
    borderWidth: 2,
  },
  textContainer: {
    flexShrink: 1,
  },
  icon: {
    marginRight: 14,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center'
  },
  subtitle: {
    color: '#f1f1f1',
    fontSize: 15,
    opacity: 0.9,
  },
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  shadowGreen: {
    shadowColor: '#00C851',
    shadowOpacity: 0.4,
  },
  shadowRed: {
    shadowColor: '#ff4444',
    shadowOpacity: 0.5,
  },
  artifactContainer: {
    alignItems: 'center',
    marginTop: '43%',
    zIndex: 2
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: widthProportion(2),
    borderRadius: 10,
    backgroundColor: colors.transparentBlack,
    borderColor: colors.light,
    borderWidth: 4,
    marginBottom: heightProportion(20),
    gap: widthProportion(2)
  },
  bannerImage: {
    width: widthProportion(15),
    height: widthProportion(15),
  },
  bannerText: {
    color: colors.light,
    fontSize: fontSize.small,
    fontFamily: fonts.number,
  },
  godContainer: {
    paddingHorizontal: widthProportion(2),
    paddingVertical: widthProportion(2),
    marginHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.transparentBlack,
    borderColor: 'black',
    borderWidth: 2,
  },
})

export default toastConfig
