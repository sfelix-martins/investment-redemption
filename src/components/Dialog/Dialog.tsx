import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Button,
  Dialog as PaperDialog,
  Portal,
  useTheme,
} from 'react-native-paper';

type Props = {
  visible: boolean;
  onDismiss(): void;
  title: string;
  message: string | null;
  actionText: string;
  type?: 'success' | 'error';
};

export default function Dialog({
  visible,
  onDismiss,
  title,
  message,
  actionText,
  type = 'success',
}: Props) {
  const { colors } = useTheme();
  const conditionalActionsStyles = {
    backgroundColor: type === 'success' ? colors.primary : undefined,
    padding: type === 'success' ? 0 : undefined,
  };

  return (
    <Portal>
      <PaperDialog visible={visible} onDismiss={onDismiss}>
        <PaperDialog.Title
          style={styles.title}
          accessibilityComponentType
          accessibilityTraits>
          {title}
        </PaperDialog.Title>
        <PaperDialog.Content style={styles.content}>
          <Text>{message}</Text>
        </PaperDialog.Content>
        <PaperDialog.Actions
          style={{
            ...conditionalActionsStyles,
            ...styles.actions,
          }}>
          <Button
            uppercase
            accessibilityComponentType
            accessibilityTraits
            mode={type === 'success' ? 'contained' : 'text'}
            labelStyle={{ ...styles.buttonLabelStyle, color: colors.accent }}
            style={type === 'success' ? styles.successButton : {}}
            onPress={onDismiss}>
            {actionText}
          </Button>
        </PaperDialog.Actions>
      </PaperDialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  content: { alignItems: 'center' },
  actions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabelStyle: {
    fontWeight: 'bold',
  },
  successButton: {
    width: '100%',
    height: 50,
    flex: 1,
    justifyContent: 'center',
  },
});
