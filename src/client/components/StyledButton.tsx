/*
------------------------------------------------------------
StyledButton.tsx
Bouton générique stylé avec états pressé/désactivé pour l’UI mobile.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React from 'react';
import { Text, TextStyle, Pressable, ViewStyle, StyleProp } from 'react-native';
import commonStyles from '../theme/styles';

export interface StyleButtonProps {
    text: string
    textStyle: StyleProp<TextStyle>
    buttonStyle: StyleProp<ViewStyle>
    disabled?: boolean
    onPress?: () => void
    onPressStyle?: StyleProp<ViewStyle>
}

const StyledButton: React.FC<StyleButtonProps> = ({ text, onPress, disabled=false, buttonStyle, textStyle, onPressStyle }) => {
  return (
    <Pressable 
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
        buttonStyle,
        disabled && commonStyles.disabled,
        pressed && [{ ...commonStyles.pressed}, onPressStyle],
      ]}
    >
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

export default StyledButton
