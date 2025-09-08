import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../utils';

interface AppInputProps extends TextInputProps {
  icon?: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
}

const AppInput: React.FC<AppInputProps> = ({ icon, rightIcon, onRightIconPress, style, ...props }) => (
<View style={styles.inputContainer}>
    {icon && <Image source={icon} style={styles.icon} />}
    <TextInput
        style={[styles.input, style]}
        placeholderTextColor={require('../utils/colors').GRAY}
        {...props}
    />
    {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={rightIcon} style={styles.rightIcon} />
        </TouchableOpacity>
    )}
</View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.White,
    height: 52,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: Colors.LightBlue,
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: Colors.LightBlue,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.Black,
    fontFamily: 'OpenSans-Regular',
  },
});

export default AppInput;