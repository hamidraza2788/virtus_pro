import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LogBox } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Images from '../../assets/images/ImagePath';
import { Colors } from '../../utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { resetPassword } from '../../redux/slices/authSlice';
import Loader from '../../components/Loader';
import useLoading from '../../hooks/useLoading';
import { useGlobalLoader } from '../../contexts/LoaderContext';

// Custom logger function that will definitely show in Metro
const log = (message: string, data?: any) => {
  console.log(`[RESET_PASSWORD] ${message}`, data || '');
  // Also use React Native's built-in logging
  if (__DEV__) {
    console.warn(`[RESET_PASSWORD] ${message}`, data || '');
  }
};

const ResetPasswordScreen = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [buttonPressCount, setButtonPressCount] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { isLoading, message, startLoading, stopLoading } = useLoading();
  const { showLoader: showGlobalLoader, hideLoader: hideGlobalLoader } = useGlobalLoader();

  // Get email from route params if needed
  const email = (route.params as { email?: string })?.email || '';

  // Test logging on component mount
  useEffect(() => {
    log('ResetPasswordScreen component mounted');
    log('Email from route:', email);
  }, []);

  const validateForm = () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    
    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP must be exactly 6 digits');
      return false;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleResetPassword = async () => {
    const currentPressCount = buttonPressCount + 1;
    setButtonPressCount(currentPressCount);
    
    log(`Button pressed ${currentPressCount} times`);
    
    if (!validateForm()) return;
    
    startLoading('Resetting password...');
    
    log('Starting reset password process...');
    log('OTP:', otp);
    log('New Password:', newPassword);
    log('Email from route:', email);
    
    try {
      const result = await dispatch(resetPassword({ 
        otp, 
        new_password: newPassword 
      })).unwrap();
      
      log('Reset password result:', result);
      
      stopLoading();
      Alert.alert('Success', 'Password has been reset successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      log('Reset password error:', error);
      log('Error type:', typeof error);
      log('Error string:', String(error));
      stopLoading();
      Alert.alert('Reset Failed', String(error) || 'Failed to reset password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image source={Images.Logo} style={styles.logo} resizeMode="contain" />
          </View>
          
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to your email and your new password</Text>

          {email ? (
            <Text style={styles.emailText}>Email: {email}</Text>
          ) : null}
          
          <Text style={styles.debugText}>Debug: Button pressed {buttonPressCount} times</Text>

          <AppInput
            placeholder="Enter OTP (6 digits)"
            icon={Images.LockIcon}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />

          <AppInput
            placeholder="New Password"
            icon={Images.LockIcon}
            rightIcon={showPassword ? Images.EyeIcon : Images.EyeOffIcon}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <AppInput
            placeholder="Confirm New Password"
            icon={Images.LockIcon}
            rightIcon={showConfirmPassword ? Images.EyeIcon : Images.EyeOffIcon}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <AppButton 
            title="Reset Password" 
            onPress={handleResetPassword} 
            style={styles.resetBtn} 
            loading={loading}
          />

          <View style={styles.backRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Loader 
        visible={isLoading} 
        message={message}
        overlay={true}
      />
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 100,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 'bold',
    color: Colors.Black,
    marginBottom: 8,
    fontFamily: 'OpenSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 24,
    fontFamily: 'OpenSans-Regular',
  },
  emailText: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 16,
    fontFamily: 'OpenSans-SemiBold',
  },
  resetBtn: {
    borderRadius: 30,
    marginBottom: 24,
    marginTop: 4,
    backgroundColor: Colors.primary,
  },
  backRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  backLink: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
  debugText: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 8,
    fontFamily: 'OpenSans-Regular',
  },
});
