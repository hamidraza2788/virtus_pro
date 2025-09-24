import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors } from '../utils';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({ title, onPress, style, textStyle, loading = false, disabled = false }) => (
  <TouchableOpacity 
    style={[
      styles.button, 
      style, 
      (loading || disabled) && styles.disabledButton
    ]} 
    onPress={onPress} 
    activeOpacity={0.8}
    disabled={loading || disabled}
  >
    {loading ? (
      <ActivityIndicator color={Colors.White} size="small" />
    ) : (
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    )}
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
  disabledButton: {
    backgroundColor: Colors.Gray,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 17,
    fontWeight: '600',
  },
});

export default AppButton;