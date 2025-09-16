import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { setLanguageByCode } from '../redux/slices/languageSlice';
import { Colors } from '../utils';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { useLanguageSync } from '../hooks/useLanguageSync';

const { width } = Dimensions.get('window');

interface LanguageDropdownProps {
  style?: any;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ style }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentLanguage, availableLanguages } = useAppSelector(
    (state) => state.language
  );
  
  // Ensure language sync
  useLanguageSync();
  
  const [isVisible, setIsVisible] = useState(false);

  const handleLanguageSelect = (languageCode: string) => {
    dispatch(setLanguageByCode(languageCode));
    setIsVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        currentLanguage.code === item.code && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text
        style={[
          styles.languageName,
          currentLanguage.code === item.code && styles.selectedLanguageName,
        ]}
      >
        {item.name}
      </Text>
      {currentLanguage.code === item.code && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.flag}>{currentLanguage.flag}</Text>
        <Text style={styles.currentLanguageText}>
          {currentLanguage.name}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('language.selectLanguage')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableLanguages}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.White,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.Gray,
    minWidth: 120,
  },
  flag: {
    fontSize: 18,
    marginRight: 8,
  },
  currentLanguageText: {
    fontSize: 14,
    color: Colors.Black,
    flex: 1,
    fontFamily: 'OpenSans-SemiBold',
  },
  dropdownArrow: {
    fontSize: 12,
    color: Colors.Gray,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    width: width * 0.8,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Gray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Black,
    fontFamily: 'OpenSans-Bold',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.Gray,
    fontWeight: 'bold',
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguageItem: {
    backgroundColor: '#f8f9fa',
  },
  languageName: {
    fontSize: 16,
    color: Colors.Black,
    flex: 1,
    fontFamily: 'OpenSans-Regular',
  },
  selectedLanguageName: {
    color: Colors.primary,
    fontFamily: 'OpenSans-SemiBold',
  },
  checkmark: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default LanguageDropdown;
