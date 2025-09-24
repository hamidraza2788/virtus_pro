import React from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors } from '../utils';

interface LoaderProps {
  visible: boolean;
  message?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  backgroundColor?: string;
  textColor?: string;
}

const { width, height } = Dimensions.get('window');

const Loader: React.FC<LoaderProps> = ({
  visible,
  message = 'Loading...',
  overlay = true,
  size = 'large',
  color = Colors.primary,
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  textColor = Colors.White,
}) => {
  if (!visible) return null;

  if (overlay) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        statusBarTranslucent
      >
        <View style={[styles.overlay, { backgroundColor }]}>
          <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {message && (
              <Text style={[styles.message, { color: textColor }]}>
                {message}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={[styles.inlineMessage, { color }]}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  container: {
    backgroundColor: Colors.White,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 120,
    shadowColor: Colors.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
  },
  inlineMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'OpenSans-SemiBold',
  },
});

export default Loader;
