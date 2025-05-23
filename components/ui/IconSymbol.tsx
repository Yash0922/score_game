import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/Colors';

interface IconSymbolProps {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
}

const IconSymbol: React.FC<IconSymbolProps> = ({
  name,
  size = 24,
  color = COLORS.primary
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconSymbol;