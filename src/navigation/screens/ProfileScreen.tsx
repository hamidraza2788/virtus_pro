import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Images from '../../assets/images/ImagePath';
import { Colors } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
const ProfileScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
      const navigation = useNavigation();
    
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Update Your Profile</Text>
<Text style={styles.subtitle}>Keep your information up to date</Text>

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
              disabled={true}
          
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
         
 
         

          <AppButton title="Update" onPress={() => { navigation.navigate('Login') }} style={styles.signInBtn} />

         

         
   {/* Separator Line */}
                    <View style={styles.separator} />
                    
                    {/* Logout Button */}
                    <TouchableOpacity 
                        onPress={() => { 
                            // Add logout logic here
                            navigation.navigate('Login'); 
                        }} 
                        style={styles.logoutButton}
                    >
                        <Image 
                            source={Images.LogoutIcon} 
                            style={styles.logoutIcon} 
                        />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

        
         

        
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: Colors.White,
    padding: 24,
    // justifyContent: 'center',
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
  signInBtn: {
    borderRadius: 30,
    marginBottom: 0,
    marginTop: 4,
    backgroundColor: Colors.primary
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
 
 separator: {
        height: 1,
        backgroundColor: Colors.secondary,
        marginVertical: 50,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.secondary,
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: Colors.White,
    },
    logoutIcon: {
        width: 20,
        height: 20,
        marginRight: 12,
        tintColor: Colors.secondary,
    },
    logoutText: {
        color: Colors.secondary,
        fontSize: 16,
        fontFamily: 'OpenSans-SemiBold',
    },
 
});