import { View, Text, StyleSheet } from 'react-native';

type Props = {
  message: string;
};

export function EmptyState({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
