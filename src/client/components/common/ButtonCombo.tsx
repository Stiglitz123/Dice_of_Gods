/*
------------------------------------------------------------
ButtonCombo.tsx
Bouton combinant icône et texte pour les menus du lobby avec gestion d’état pressé/désactivé.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import {FC} from 'react';
import { View, Text, TextStyle, Pressable, ViewStyle, StyleProp, ImageStyle, ImageSourcePropType, Image } from 'react-native';
import commonStyles from '@/theme/styles';

export interface ButtonComboProps {
    text: string
    textStyle: StyleProp<TextStyle>
    buttonStyle: StyleProp<ViewStyle>
    imageSource: ImageSourcePropType
    imageStyle?: StyleProp<ImageStyle>
    imageContainerStyle?: StyleProp<ViewStyle>
    disabled?: boolean
    onPress?: () => void
    onPressStyle?: StyleProp<ViewStyle>
}

const ButtonCombo: FC<ButtonComboProps> = ({ text, onPress, imageSource, imageStyle, imageContainerStyle, disabled=false, buttonStyle, textStyle, onPressStyle }) => {
  return (
    <Pressable 
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
        commonStyles.horizontalContainer,
        buttonStyle,
        disabled && commonStyles.disabled,
        pressed && [{ ...commonStyles.pressed}, onPressStyle],
      ]}
    >
    <View style={[{height: '100%'}, imageContainerStyle]}>
        <Image
            source={imageSource}
            style={imageStyle}
            resizeMode='contain'
        />
    </View>
      <Text 
        style={textStyle}
        numberOfLines={1}
        adjustsFontSizeToFit
      >

          {text}
      </Text>
    </Pressable>
  );
}

export default ButtonCombo
