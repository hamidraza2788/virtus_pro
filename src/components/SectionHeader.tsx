import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../utils';

interface Props {
  title: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
}

const SectionHeader: React.FC<Props> = ({ title, showSeeAll, onSeeAllPress }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title} <Text style={styles.emoji}>😍</Text></Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.Black,
  },
  emoji: {
    fontSize: 18,
  },
  seeAll: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SectionHeader;