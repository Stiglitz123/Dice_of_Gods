/*
------------------------------------------------------------
ImageButton.tsx
Bouton image réutilisable appliquant les états pressé/désactivé pour les sélections visuelles.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import {FC} from "react"
import commonStyles from "@/theme/styles"
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native"

export interface ImageButtonProps {
  source: ImageSourcePropType
  style: StyleProp<ViewStyle>
  onPress: () => void
  disabled?: boolean
  onPressStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
}

const ImageButton: FC<ImageButtonProps> = ({source, style, disabled = false, onPress, onPressStyle, imageStyle}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          justifyContent: "center",
          alignItems: "center",
        },
        style,
        pressed && [commonStyles.pressed, onPressStyle],
        disabled && commonStyles.disabled,
      ]}
    >
      <Image
        source={source}
        style={[
          { width: "100%", height: "100%", resizeMode: "contain" },
          imageStyle,
        ]}
      />
    </Pressable>
  )
}

export default ImageButton
