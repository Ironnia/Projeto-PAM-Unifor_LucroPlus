import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PromocoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏷️ Promoções</Text>
      <Text style={styles.subtitle}>Sugestões para reduzir desperdício</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
});
