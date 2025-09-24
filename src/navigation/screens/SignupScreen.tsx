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
import { registerUser } from '../../redux/slices/authSlice';
import Loader from '../../components/Loader';
import useLoading from '../../hooks/useLoading';

const SignupScreen = () => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { isLoading, message, startLoading, stopLoading } = useLoading();

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    startLoading('Creating account...');

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone: phone || undefined,
        address: address || undefined,
      };
      
      const result = await dispatch(registerUser(userData)).unwrap();
      if (result) {
        stopLoading();
        Alert.alert('Success', 'Account created successfully! Please login.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error: any) {
      stopLoading();
      Alert.alert('Registration Failed', error || 'Failed to create account');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{   }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 1}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image source={Images.Logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>{t('home.welcome')}</Text>
          <Text style={styles.subtitle}>Create your account to continue</Text>

          <AppInput
            placeholder={t('auth.firstName')}
            icon={Images.userIcon}
            value={firstName}
            onChangeText={setFirstName}
            keyboardType="default"
            autoCapitalize="words"
          />
          <AppInput
            placeholder={t('auth.lastName')}
            icon={Images.userIcon}
            value={lastName}
            onChangeText={setLastName}
            keyboardType="default"
            autoCapitalize="words"
          />
          <AppInput
            placeholder={t('auth.email')}
            icon={Images.EmailIcon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppInput
            placeholder={t('auth.phone')}
            icon={Images.phoneIcon}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <AppInput
            placeholder={t('auth.address')}
            icon={Images.locationIcon}
            value={address}
            onChangeText={setAddress}
            keyboardType="default"
            autoCapitalize="words"
          />
          <AppInput
            placeholder={t('auth.password')}
            icon={Images.LockIcon}
            rightIcon={showPassword ? Images.EyeIcon : Images.EyeOffIcon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
          <AppInput
            placeholder={t('auth.confirmPassword')}
            icon={Images.LockIcon}
            rightIcon={showConfirmPassword ? Images.EyeIcon : Images.EyeOffIcon}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <AppButton 
            title={t('auth.signup')} 
            onPress={handleSignup} 
            style={styles.signInBtn} 
            loading={loading}
          />

          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>{t('auth.signInWith')}</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.socialBtn}>
            <Image source={Images.AppleIcon} style={styles.socialIcon} />
            <Text style={styles.socialText}>{t('auth.signInWithApple')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={Images.GoogleIcon} style={styles.socialIcon} />
            <Text style={styles.socialText}>{t('auth.signInWithGoogle')}</Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>{t('auth.alreadyHaveAccount')} </Text>
            <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
              <Text style={styles.signupLink}>{t('auth.login')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            {t('auth.termsAndPrivacy')}{' '}
            <Text style={styles.link}>{t('auth.terms')}</Text> and <Text style={styles.link}>{t('auth.privacyPolicy')}</Text>
          </Text>
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

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    padding: 24,
    // justifyContent: 'center',
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
    lineHeight:38,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },

  signInBtn: {
    borderRadius: 30,
    marginBottom: 24,
    marginTop: 4,
    backgroundColor: Colors.primary
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  orText: {
    color: Colors.secondary,
    fontSize: 14,
    marginHorizontal: 8,
    fontFamily: 'OpenSans-Regular',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.secondary,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 14,
    
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
    resizeMode: 'contain',
  },
  socialText: {
    fontSize: 16,
    color: Colors.secondary,
    fontFamily: 'OpenSans-SemiBold',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  signupText: {
    color: Colors.secondary,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
  termsText: {
    color: Colors.secondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 16,
   
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontFamily: 'OpenSans-Bold',
    
  },
});