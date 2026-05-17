import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import styles, { colors } from '../styles/global';
import VendaCard from '../components/VendaCard';
import VendaForm from '../components/VendaForm';
import {
  initStorage,
  getVendas,
  addVenda,
  deleteVenda,
  searchVendas,
} from '../utils/storage';

const formatCurrency = (value) => {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const VendasScreen = () => {
  const [vendas, setVendas] = useState(getVendas());
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = searchVendas(searchQuery);
  const totalVendas = vendas.length;
  const receitaTotal = vendas.reduce((acc, v) => acc + v.total, 0);
  const lucroTotal = vendas.reduce((acc, v) => acc + v.lucro, 0);

  useEffect(() => {
    initStorage().then(() => setVendas([...getVendas()]));
  }, []);

  const refresh = useCallback(() => {
    setVendas([...getVendas()]);
  }, []);

  const handleAdd = async (data) => {
    try {
      await addVenda(data);
      refresh();
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Excluir venda',
      'Tem certeza que deseja excluir esta venda? O estoque será restaurado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteVenda(id);
            refresh();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <VendaCard venda={item} onDelete={handleDelete} />
  );

  const renderEmpty = () => (
    <Text style={styles.emptyText}>
      {searchQuery.trim()
        ? 'Nenhuma venda encontrada para esta busca.'
        : 'Nenhuma venda registrada.'}
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vendas</Text>
        <Text style={styles.headerSubtitle}>
          {totalVendas} venda{totalVendas !== 1 ? 's' : ''} | Receita:{' '}
          {formatCurrency(receitaTotal)} | Lucro:{' '}
          {formatCurrency(lucroTotal)}
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <TextInput
          style={[
            styles.input,
            {
              marginBottom: 0,
              backgroundColor: colors.surface,
            },
          ]}
          placeholder="Buscar por mercadoria ou cliente..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: colors.primary,
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 30,
            lineHeight: 32,
            fontWeight: '300',
          }}
        >
          +
        </Text>
      </TouchableOpacity>

      <VendaForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAdd}
      />
    </View>
  );
};

export default VendasScreen;
