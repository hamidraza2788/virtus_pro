import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Images from '../../assets/images/ImagePath';
import { Colors } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen = () => {
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
          <Text style={styles.title}>Welcome to Virtus Pro</Text>
<Text style={styles.subtitle}>Create your account to continue</Text>

<AppInput
            placeholder="First Name"
            icon={Images.userIcon}
            value={firstName}
            onChangeText={setFirstName}
            keyboardType="default"
            autoCapitalize="words"
          />
          <AppInput
            placeholder="Last Name"
            icon={Images.userIcon}
            value={lastName}
            onChangeText={setLastName}
            keyboardType="default"
            autoCapitalize="words"
          />
          <AppInput
            placeholder="Type your email"
            icon={Images.EmailIcon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppInput
            placeholder="Phone Number"
            icon={Images.phoneIcon}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            // autoCapitalize="words"
          />
          <AppInput
            placeholder="Address"
            icon={Images.locationIcon}
            value={address}
            onChangeText={setAddress}
            keyboardType="default"
            autoCapitalize="words"
          />
          <AppInput
            placeholder="Type your password"
            icon={Images.LockIcon}
            rightIcon={showPassword ? Images.EyeIcon : Images.EyeOffIcon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
 <AppInput
            placeholder="Confirm Password"
            icon={Images.LockIcon}
            rightIcon={showConfirmPassword ? Images.EyeIcon : Images.EyeOffIcon}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
         

          <AppButton title="Sign Up" onPress={() => { navigation.navigate('Login') }} style={styles.signInBtn} />

          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or sign in with</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.socialBtn}>
            <Image source={Images.AppleIcon} style={styles.socialIcon} />
            <Text style={styles.socialText}>Sign In with Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={Images.GoogleIcon} style={styles.socialIcon} />
            <Text style={styles.socialText}>Sign In with Google</Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
              <Text style={styles.signupLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By using our services you are agreeing to our{' '}
            <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    padding: 24,
    justifyContent: 'center',
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
    color: Colors.Gray,
    marginBottom: 24,
    fontFamily: 'OpenSans-Regular',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: Colors.Purple,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Regular',
  },
  signInBtn: {
    borderRadius: 30,
    marginBottom: 24,
    marginTop: 4,
    backgroundColor: Colors.Black
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  orText: {
    color: Colors.Gray,
    fontSize: 14,
    marginHorizontal: 8,
    fontFamily: 'OpenSans-Regular',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.LightGray,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally
    borderWidth: 1,
    borderColor: Colors.LightGray,
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
    color: '#222',
    fontFamily: 'OpenSans-SemiBold',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  signupText: {
    color: Colors.Black,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  signupLink: {
    color: '#7C3AED',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
  termsText: {
    color: Colors.Gray,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 16,
   
  },
  link: {
    color: Colors.Purple,
    textDecorationLine: 'underline',
    fontFamily: 'OpenSans-Bold',
    
  },
});