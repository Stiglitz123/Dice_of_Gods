/*
------------------------------------------------------------
Button.tsx
Bouton simple utilisé pour quelques actions basiques de l’application.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import commonStyles from '../theme/styles';
import { ButtonProps } from '../assets/types';

export const Button: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={commonStyles.buttonFrame} onPress={onPress}>
      <Text style={{color: 'black'}}>{text}</Text>
    </TouchableOpacity>
  );
}
