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
import MercadoriaCard from '../components/MercadoriaCard';
import MercadoriaForm from '../components/MercadoriaForm';
import {
  initStorage,
  getMercadorias,
  addMercadoria,
  updateMercadoria,
  deleteMercadoria,
  searchMercadorias,
} from '../utils/storage';

const MercadoriasScreen = () => {
  const [mercadorias, setMercadorias] = useState(getMercadorias());
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMercadoria, setEditingMercadoria] = useState(null);

  const filtered = searchMercadorias(searchQuery);
  const totalEstoque = mercadorias.reduce(
    (acc, m) => acc + m.quantidade,
    0
  );
  const totalItens = mercadorias.length;
  const estoqueBaixo = mercadorias.filter((m) => m.quantidade <= 5).length;

  useEffect(() => {
    initStorage().then(() => setMercadorias([...getMercadorias()]));
  }, []);

  const refresh = useCallback(() => {
    setMercadorias([...getMercadorias()]);
  }, []);

  const handleAdd = async (data) => {
    await addMercadoria(data);
    refresh();
    setModalVisible(false);
  };

  const handleEdit = async (data) => {
    await updateMercadoria(editingMercadoria.id, data);
    refresh();
    setEditingMercadoria(null);
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    const item = mercadorias.find((m) => m.id === id);
    Alert.alert(
      'Excluir mercadoria',
      `Tem certeza que deseja excluir "${item?.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteMercadoria(id);
            refresh();
          },
        },
      ]
    );
  };

  const openEdit = (mercadoria) => {
    setEditingMercadoria(mercadoria);
    setModalVisible(true);
  };

  const openAdd = () => {
    setEditingMercadoria(null);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <MercadoriaCard
      mercadoria={item}
      onEdit={openEdit}
      onDelete={handleDelete}
    />
  );

  const renderEmpty = () => (
    <Text style={styles.emptyText}>
      {searchQuery.trim()
        ? 'Nenhuma mercadoria encontrada para esta busca.'
        : 'Nenhuma mercadoria cadastrada.'}
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mercadorias</Text>
        <Text style={styles.headerSubtitle}>
          {totalItens} item{totalItens !== 1 ? 's' : ''} |{' '}
          {totalEstoque} un em estoque
          {estoqueBaixo > 0 && ` | ${estoqueBaixo} com estoque baixo`}
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
          placeholder="Buscar mercadoria..."
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
        onPress={openAdd}
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

      <MercadoriaForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingMercadoria(null);
        }}
        onSubmit={editingMercadoria ? handleEdit : handleAdd}
        editingMercadoria={editingMercadoria}
      />
    </View>
  );
};

export default MercadoriasScreen;
