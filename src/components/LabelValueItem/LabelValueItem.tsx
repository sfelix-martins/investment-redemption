import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type Props = {
  style?: StyleProp<ViewStyle>;
  label: string;
  value: string | Element;
};

export default function LabelValueItem({ label, value, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text>{label}</Text>
      {typeof value === 'string' ? <Text>{value}</Text> : value}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 2,
  },
});
