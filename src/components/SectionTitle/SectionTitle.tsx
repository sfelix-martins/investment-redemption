import React from 'react';
import { StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

type Props = {
  children: string;
};

export default function SectionTitle({ children }: Props) {
  return <Title style={styles.title}>{children}</Title>;
}

const styles = StyleSheet.create({
  title: { padding: 16 },
});
