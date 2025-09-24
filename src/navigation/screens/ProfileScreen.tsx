import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, PermissionsAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Images from '../../assets/images/ImagePath';
import { Colors } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUser, updateProfile, updateProfileWithImage } from '../../redux/slices/authSlice';
import StorageUtils from '../../utils/storage';
import Loader from '../../components/Loader';
import useLoading from '../../hooks/useLoading';
import { getProfileImageUrl } from '../../api/baseURL';
const ProfileScreen = () => {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { loading: authLoading } = useAppSelector((state) => state.auth);
    const { isLoading: localLoading, message, startLoading, stopLoading } = useLoading();

    // Load user data from localStorage on component mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setIsLoading(true);
            const userData = await StorageUtils.getUserData();
            if (userData) {
                setFirstName(userData.first_name || '');
                setLastName(userData.last_name || '');
                setEmail(userData.email || '');
                setPhone(userData.phone || '');
                setAddress(userData.address || '');
                // Load profile image if stored (construct full URL from image name)
                const profileImageUrl = userData.profile_image_url || 
                                      getProfileImageUrl(userData.profile_image) || 
                                      null;
                setProfileImage(profileImageUrl);
                console.log('Profile data loaded from localStorage:', userData);
                console.log('Profile image URL constructed:', profileImageUrl);
                console.log('Profile image name from data:', userData.profile_image);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserData = async () => {
        try {
            startLoading('Updating profile...');
            
            // Get user data from localStorage to get user_id
            const currentUserData = await StorageUtils.getUserData();
            if (!currentUserData || !currentUserData.id) {
                Alert.alert('Error', 'User data not found. Please login again.');
                stopLoading();
                return;
            }
            
            const profileData = {
                user_id: parseInt(currentUserData.id), // Convert string to number
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                address: address,
            };
            
            // Remove empty fields (but keep user_id)
            const filteredProfileData = Object.fromEntries(
                Object.entries(profileData).filter(([key, value]) => 
                    key === 'user_id' || (value && value.toString().trim() !== '')
                )
            );
            
            // Check if we have any data to update (excluding user_id)
            const dataToUpdate = Object.keys(filteredProfileData).filter(key => key !== 'user_id');
            if (dataToUpdate.length === 0 && !profileImage) {
                Alert.alert('Info', 'Please enter some information to update');
                stopLoading();
                return;
            }
            
            let response;
            if (profileImage) {
                // Update with image using multipart/form-data
                response = await dispatch(updateProfileWithImage({
                    profileData: filteredProfileData,
                    imageUri: profileImage
                })).unwrap();
            } else {
                // Update without image using JSON
                response = await dispatch(updateProfile(filteredProfileData)).unwrap();
            }
            
            console.log('Profile updated successfully:', response);
            Alert.alert('Success', 'Profile updated successfully!');
            
        } catch (error: any) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', error || 'Failed to update profile');
        } finally {
            stopLoading();
        }
    };

    // Request camera permission for Android
    const requestCameraPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs access to camera to take photos',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    // Image picker options
    const imagePickerOptions = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
    };

    // Handle image picker response
    const handleImagePickerResponse = (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
            console.log('Image picker cancelled or error:', response.errorMessage);
            return;
        }

        if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            if (asset.uri) {
                setProfileImage(asset.uri);
                console.log('Profile image selected:', asset.uri);
                // Note: Image will be saved to server when user clicks Save button
            }
        }
    };

    // Show image picker options
    const showImagePickerOptions = () => {
        Alert.alert(
            'Select Profile Image',
            'Choose an option to select your profile image',
            [
                {
                    text: 'Camera',
                    onPress: async () => {
                        const hasPermission = await requestCameraPermission();
                        if (hasPermission) {
                            launchCamera(imagePickerOptions, handleImagePickerResponse);
                        } else {
                            Alert.alert('Permission Denied', 'Camera permission is required to take photos');
                        }
                    },
                },
                {
                    text: 'Gallery',
                    onPress: () => launchImageLibrary(imagePickerOptions, handleImagePickerResponse),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const handleLogout = async () => {
        try {
            // Clear localStorage and Redux state
            await dispatch(logoutUser()).unwrap();
            // Navigate to WelcomeScreen
            navigation.navigate('WelcomeScreen' as never);
        } catch (error) {
            console.log('Logout error:', error);
            // Even if there's an error, clear localStorage and navigate
            await StorageUtils.clearAuthData();
            navigation.navigate('WelcomeScreen' as never);
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
          contentContainerStyle={{ flexGrow: 1, }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{t('profile.editProfile')}</Text>
          <Text style={styles.subtitle}>Keep your information up to date</Text>

          {/* Profile Image Section */}
          <View style={styles.profileImageContainer}>
            <TouchableOpacity 
              style={styles.profileImageWrapper}
              onPress={showImagePickerOptions}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage }} 
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Image 
                    source={Images.avatarIcon} 
                    style={styles.defaultProfileIcon}
                    resizeMode="cover"
                  />
                </View>
              )}
              
              {/* Camera Icon Overlay */}
              <View style={styles.cameraIconOverlay}>
                <Image 
                  source={Images.CameraIcon} // Using phone icon as camera icon placeholder
                  style={styles.cameraIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.changePhotoButton}
              onPress={showImagePickerOptions}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

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
            disabled={true}
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

          <AppButton 
            title={t('common.save')} 
            onPress={updateUserData} 
            style={styles.signInBtn}
            loading={authLoading || localLoading}
          />

          {/* Separator Line */}
          <View style={styles.separator} />
          
          {/* Logout Button */}
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Image 
              source={Images.LogoutIcon} 
              style={styles.logoutIcon} 
            />
            <Text style={styles.logoutText}>{t('auth.logout')}</Text>
          </TouchableOpacity>

        
         

        
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Loader 
        visible={localLoading} 
        message={message}
        overlay={true}
      />
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
  // Profile Image Styles
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.Gray,
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfileIcon: {
    width: 60,
    height: 60,
    tintColor: Colors.secondary,
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.White,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.White,
  },
  changePhotoButton: {
    backgroundColor: Colors.Gray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
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