import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles, { colors } from '../styles/global';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import FilterBar from '../components/FilterBar';
import {
  initStorage,
  getClients,
  addClient,
  updateClient,
  deleteClient,
  filterClients,
} from '../utils/storage';

const HomeScreen = () => {
  const [clients, setClients] = useState(getClients());
  const [filter, setFilter] = useState('todas');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const filteredClients = filterClients(filter);
  const totalDividas = clients
    .filter((c) => c.formaPagamento === 'divida')
    .reduce((acc, c) => acc + c.valor, 0);
  const totalAvista = clients
    .filter((c) => c.formaPagamento === 'avista')
    .reduce((acc, c) => acc + c.valor, 0);

  useEffect(() => {
    initStorage().then(() => setClients([...getClients()]));
  }, []);

  const refresh = useCallback(() => {
    setClients([...getClients()]);
  }, []);

  const handleAdd = async (data) => {
    await addClient(data);
    refresh();
    setModalVisible(false);
  };

  const handleEdit = async (data) => {
    await updateClient(editingClient.id, data);
    refresh();
    setEditingClient(null);
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Excluir registro',
      'Tem certeza que deseja excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteClient(id);
            refresh();
          },
        },
      ]
    );
  };

  const openEdit = (client) => {
    setEditingClient(client);
    setModalVisible(true);
  };

  const openAdd = () => {
    setEditingClient(null);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <ClientCard
      client={item}
      onEdit={openEdit}
      onDelete={handleDelete}
    />
  );

  const renderEmpty = () => (
    <Text style={styles.emptyText}>
      {filter === 'todas'
        ? 'Nenhum cliente cadastrado.'
        : 'Nenhum registro encontrado para este filtro.'}
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Controle Financeiro</Text>
        <Text style={styles.headerSubtitle}>
          {clients.length} cliente{clients.length !== 1 ? 's' : ''}{' '}
          cadastrado{clients.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {clients.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 12,
            gap: 10,
          }}
        >
          <View
            style={[
              styles.card,
              {
                flex: 1,
                marginHorizontal: 0,
                marginVertical: 0,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              À Vista
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.success,
              }}
            >
              R$ {totalAvista.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View
            style={[
              styles.card,
              {
                flex: 1,
                marginHorizontal: 0,
                marginVertical: 0,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              Dívidas
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.danger,
              }}
            >
              R$ {totalDividas.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>
      )}

      <FilterBar activeFilter={filter} onFilterChange={setFilter} />

      <FlatList
        data={filteredClients}
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

      <ClientForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingClient(null);
        }}
        onSubmit={editingClient ? handleEdit : handleAdd}
        editingClient={editingClient}
      />
    </View>
  );
};

export default HomeScreen;
