import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lotesApi } from '../services/api';
import { CriticidadeLote } from '../types/apiTypes';

// Dados de contingencia para demonstracao offline
const DADOS_MOCK_LOTES = [
  {
    id: 1,
    ingredienteNome: 'Pão de Hambúrguer',
    numeroLote: 'LOT-PAO-01',
    quantidadeFormatada: '40 un',
    diasRestantes: 4,
    dataValidade: '2026-09-25',
    criticidade: CriticidadeLote.ATENCAO,
    custoUnitario: 0.015,
  },
  {
    id: 2,
    ingredienteNome: 'Carne Moída (Blend)',
    numeroLote: 'LOT-CARNE-01',
    quantidadeFormatada: '10.00 kg',
    diasRestantes: 2,
    dataValidade: '2026-09-23',
    criticidade: CriticidadeLote.CRITICO,
    custoUnitario: 0.0325,
  },
  {
    id: 3,
    ingredienteNome: 'Queijo Mussarela',
    numeroLote: 'LOT-QUEIJO-01',
    quantidadeFormatada: '8.00 kg',
    diasRestantes: 3,
    dataValidade: '2026-09-24',
    criticidade: CriticidadeLote.ATENCAO,
    custoUnitario: 0.038,
  },
  {
    id: 4,
    ingredienteNome: 'Alface Americana',
    numeroLote: 'LOT-ALFACE-01',
    quantidadeFormatada: '3.50 kg',
    diasRestantes: 1,
    dataValidade: '2026-09-22',
    criticidade: CriticidadeLote.CRITICO,
    custoUnitario: 0.008,
  },
  {
    id: 5,
    ingredienteNome: 'Tomate',
    numeroLote: 'LOT-TOMATE-01',
    quantidadeFormatada: '5.00 kg',
    diasRestantes: 5,
    dataValidade: '2026-09-26',
    criticidade: CriticidadeLote.ATENCAO,
    custoUnitario: 0.0065,
  },
  {
    id: 6,
    ingredienteNome: 'Massa de Pizza',
    numeroLote: 'LOT-MASSA-01',
    quantidadeFormatada: '20 un',
    diasRestantes: 15,
    dataValidade: '2026-10-06',
    criticidade: CriticidadeLote.SEGURO,
    custoUnitario: 0.0133,
  },
  {
    id: 7,
    ingredienteNome: 'Molho de Tomate',
    numeroLote: 'LOT-MOLHO-01',
    quantidadeFormatada: '4.00 kg',
    diasRestantes: 20,
    dataValidade: '2026-10-11',
    criticidade: CriticidadeLote.SEGURO,
    custoUnitario: 0.012,
  },
];

export default function EstoqueScreen() {
  const [lotes, setLotes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [filtro, setFiltro] = useState('TODOS');

  const carregarLotes = useCallback(async () => {
    try {
      const dados = await lotesApi.getLotes();
      if (Array.isArray(dados) && dados.length > 0) {
        setLotes(dados);
      } else {
        setLotes(DADOS_MOCK_LOTES);
      }
    } catch (error) {
      setLotes(DADOS_MOCK_LOTES);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarLotes();
  }, [carregarLotes]);

  const onRefresh = () => {
    setAtualizando(true);
    carregarLotes();
  };

  const lotesFiltrados = lotes.filter((lote) => {
    if (filtro === 'CRITICO') return lote.criticidade === CriticidadeLote.CRITICO;
    if (filtro === 'ATENCAO') return lote.criticidade === CriticidadeLote.ATENCAO;
    if (filtro === 'SEGURO') return lote.criticidade === CriticidadeLote.SEGURO;
    return true;
  });

  const obterBadgeInfo = (criticidade, dias) => {
    if (criticidade === CriticidadeLote.CRITICO) {
      return {
        texto: dias <= 0 ? 'Vence HOJE' : dias === 1 ? '1 dia restante' : `${dias} dias restantes`,
        corTexto: '#ff5252',
        bg: 'rgba(255, 82, 82, 0.15)',
        borda: '#ff5252',
        icone: 'alert-circle',
      };
    }
    if (criticidade === CriticidadeLote.ATENCAO) {
      return {
        texto: `${dias} dias restantes`,
        corTexto: '#ffb74d',
        bg: 'rgba(255, 183, 77, 0.15)',
        borda: '#ffb74d',
        icone: 'warning',
      };
    }
    return {
      texto: `${dias} dias restantes`,
      corTexto: '#00e676',
      bg: 'rgba(0, 230, 118, 0.15)',
      borda: '#00e676',
      icone: 'shield-checkmark',
    };
  };

  const renderItem = ({ item }) => {
    const badge = obterBadgeInfo(item.criticidade, item.diasRestantes);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.ingredienteNome}>{item.ingredienteNome}</Text>
            <Text style={styles.numeroLote}>{item.numeroLote}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.borda }]}>
            <Ionicons name={badge.icone} size={14} color={badge.corTexto} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeText, { color: badge.corTexto }]}>{badge.texto}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardBody}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Estoque Atual</Text>
            <Text style={styles.infoValue}>{item.quantidadeFormatada}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Validade</Text>
            <Text style={styles.infoValue}>{item.dataValidade}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Custo Unit.</Text>
            <Text style={styles.infoValue}>R$ {item.custoUnitario?.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6c63ff" />
        <Text style={styles.loadingText}>Carregando lotes do estoque...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {['TODOS', 'CRITICO', 'ATENCAO', 'SEGURO'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filtro === f && styles.filterChipActive]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filterChipText, filtro === f && styles.filterChipTextActive]}>
              {f === 'TODOS' ? 'Todos' : f === 'CRITICO' ? '🔴 Críticos' : f === 'ATENCAO' ? '🟡 Atenção' : '🟢 Seguros'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={lotesFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={onRefresh} tintColor="#6c63ff" />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={48} color="#555" />
            <Text style={styles.emptyTitle}>Nenhum lote encontrado</Text>
            <Text style={styles.emptySubtitle}>Não há insumos com os filtros selecionados.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8b8ba7',
    marginTop: 12,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#14142b',
    borderBottomWidth: 1,
    borderBottomColor: '#252545',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1f1f3a',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#303055',
  },
  filterChipActive: {
    backgroundColor: '#6c63ff',
    borderColor: '#6c63ff',
  },
  filterChipText: {
    color: '#8b8ba7',
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#18182e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#262646',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  ingredienteNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  numeroLote: {
    fontSize: 12,
    color: '#8b8ba7',
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#262646',
    marginVertical: 12,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#8b8ba7',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e0e0ff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8b8ba7',
    marginTop: 4,
    textAlign: 'center',
  },
});
