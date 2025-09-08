import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Images from '../../assets/images/ImagePath';
import { Colors } from '../../utils';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi! Login to Virtus Pro</Text>
      <Text style={styles.subtitle}>Sign In to your account</Text>

      <AppInput
        placeholder="Type your email"
        icon={Images.EmailIcon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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

      <TouchableOpacity style={styles.forgotBtn}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <AppButton title="Sign In" onPress={() => {}} style={styles.signInBtn} />

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
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.termsText}>
        By using our services you are agreeing to our{' '}
        <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

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