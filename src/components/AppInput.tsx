import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Colors } from '../utils';

interface AppInputProps extends TextInputProps {
  icon?: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
  disabled?: boolean;
}

const AppInput: React.FC<AppInputProps> = ({ 
  icon, 
  rightIcon, 
  onRightIconPress, 
  style, 
  disabled = false,
  ...props 
}) => (
  <View style={[
    styles.inputContainer, 
    
  ]}>
    {icon && (
      <Image 
        source={icon} 
        style={[
          styles.icon, 
          disabled && styles.disabledIcon
        ]} 
      />
    )}
    <TextInput
      style={[styles.input, disabled && styles.disabledInput, style]}
      placeholderTextColor={disabled ? Colors.Gray : Colors.secondary}
      editable={!disabled}
      {...props}
    />
    {rightIcon && (
      <TouchableOpacity 
        onPress={onRightIconPress} 
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        disabled={disabled}
      >
        <Image 
          source={rightIcon} 
          style={[
            styles.rightIcon, 
            disabled && styles.disabledIcon
          ]} 
        />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.White,
    height: 52,
  },
  disabledContainer: {
    backgroundColor: Colors.Gray,
    borderColor: Colors.LightGray,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: Colors.secondary,
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: Colors.secondary,
  },
  disabledIcon: {
    tintColor: Colors.Gray,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.Black,
    fontFamily: 'OpenSans-Regular',
  },
  disabledInput: {
    color: Colors.Gray,
  },
});

export default AppInput;