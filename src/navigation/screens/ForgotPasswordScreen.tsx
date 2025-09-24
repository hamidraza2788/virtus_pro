import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Images from '../../assets/images/ImagePath';
import { Colors } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { forgotPassword } from '../../redux/slices/authSlice';
import Loader from '../../components/Loader';
import useLoading from '../../hooks/useLoading';

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { isLoading, message, startLoading, stopLoading } = useLoading();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    startLoading('Sending reset email...');

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      stopLoading();
      Alert.alert(
        'Success', 
        'If the email exists in our system, a password reset OTP has been sent.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('ResetPassword', { email }) 
          }
        ]
      );
    } catch (error: any) {
      stopLoading();
      Alert.alert('Error', error || 'Failed to send reset email');
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
          
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your email address and we'll send you an OTP to reset your password</Text>

          <AppInput
            placeholder={t('auth.email')}
            icon={Images.EmailIcon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppButton 
            title="Send Reset Code" 
            onPress={handleForgotPassword} 
            style={styles.sendBtn} 
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

export default ForgotPasswordScreen;

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
    marginBottom: 32,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 22,
  },
  sendBtn: {
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
});
