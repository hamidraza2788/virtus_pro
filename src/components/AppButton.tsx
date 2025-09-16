import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../utils';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AppButton: React.FC<AppButtonProps> = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 17,
    fontWeight: '600',
  },
});

export default AppButton;