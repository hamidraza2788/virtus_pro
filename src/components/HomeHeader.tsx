import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Images from '../assets/images/ImagePath';
import { Colors } from '../utils';
import LanguageDropdown from './LanguageDropdown';
import StorageUtils from '../utils/storage';
import { getProfileImageUrl } from '../api/baseURL';

const HomeHeader = () => {
  const { t } = useTranslation();
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  // const [userLocation, setUserLocation] = useState<string>('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await StorageUtils.getUserData();
      if (userData) {
        // Set user name
        const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
        setUserName(fullName || userData.email || 'User');
        
        // Set user location
        // setUserLocation(userData.address || 'No location set');
        
        // Set profile image
        const profileImageUrl = userData.profile_image_url || 
                              getProfileImageUrl(userData.profile_image) || 
                              null;
        setUserProfileImage(profileImageUrl);
        
        console.log('HomeHeader: User data loaded:', {
          name: fullName,
          profileImage: profileImageUrl
        });
      }
    } catch (error) {
      console.error('HomeHeader: Error loading user data:', error);
    }
  };

  return (
    <View style={styles.header}>
      {userProfileImage ? (
        <Image 
          source={{ uri: userProfileImage }} 
          style={styles.avatar}
          onError={() => {
            console.log('HomeHeader: Profile image failed to load, using default avatar');
            setUserProfileImage(null);
          }}
        />
      ) : (
        <Image source={Images.avatarIcon} style={styles.avatar} />
      )}
      <View style={styles.locationContainer}>
        {userName ? (
          <Text style={styles.userName}>{userName}</Text>
        ) : (
          <Text style={styles.userName}>Welcome!</Text>
        )}
        {/* <Text style={styles.location}>{userLocation}</Text> */}
      </View>
      <View style={styles.rightSection}>
        <LanguageDropdown style={styles.languageDropdown} />
        <TouchableOpacity>
          <View style={styles.bellWrapper}>
            <Image source={Images.BellIcon} style={styles.bell} />
            <View style={styles.redDot} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 20, 
    marginBottom: 12 
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22 
  },
  locationContainer: { 
    flex: 1, 
    marginLeft: 12 
  },
  userName: { 
    color: Colors.Black, 
    fontWeight: 'bold', 
    fontSize: 16,
    marginBottom: 2
  },
  deliverTo: { 
    color: Colors.primary, 
    fontWeight: '600', 
    fontSize: 13 
  },
  location: { 
    color: Colors.secondary, 
    fontWeight: '500', 
    fontSize: 13 
  },
  locationArrow: { 
    fontSize: 12 
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageDropdown: {
    marginRight: 8,
  },
  bellWrapper: { 
    position: 'relative' 
  },
  bell: { 
    width: 24, 
    height: 24, 
    marginLeft: 8 
  },
  redDot: {
    position: 'absolute',
    top: 1,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: Colors.White,
  },
});
export default HomeHeader;