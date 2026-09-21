import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EstoqueScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Estoque</Text>
      <Text style={styles.subtitle}>Lotes de insumos e validades</Text>
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
