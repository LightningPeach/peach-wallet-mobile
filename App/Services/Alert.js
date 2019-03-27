import { Alert } from 'react-native';

export const showConfirm = (text, cb, title) =>
  Alert.alert(title, text, [
    {
      text: 'Yes',
      onPress: () => {
        if (cb) cb();
      },
    },
    {
      text: 'Cancel',
      onPress: () => {},
    },
  ]);

export const showConfirmAsync = (text, title) =>
  new Promise((resolve) => {
    setTimeout(() => {
      Alert.alert(
        title,
        text,
        [
          { text: 'Yes', onPress: () => resolve({ yes: true }) },
          { text: 'Cancel', onPress: () => resolve({ cancel: true }) },
        ],
        { onDismiss: () => resolve({ cancel: true }) },
      );
    }, 100);
  });

export const showConfirmOkAsync = text =>
  new Promise((resolve) => {
    setTimeout(() => {
      Alert.alert('', text, [{ text: 'Ok', onPress: () => resolve() }], {
        onDismiss: () => resolve(),
      });
    }, 100);
  });
