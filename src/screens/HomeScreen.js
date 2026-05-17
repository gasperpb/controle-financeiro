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
    .filter((c) => c.formaPagamento === 'divida' && !c.pago)
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

  const addMonths = (dateStr, months) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    date.setMonth(date.getMonth() + months);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${date.getFullYear()}`;
  };

  const handleAdd = async (data) => {
    if (data.formaPagamento === 'divida' && data.parcelas > 1) {
      const valorParcela = data.valor / data.parcelas;
      for (let i = 1; i <= data.parcelas; i++) {
        await addClient({
          nome: data.nome,
          tipoGasto: data.tipoGasto,
          valor: valorParcela,
          formaPagamento: 'divida',
          dataPagamento: addMonths(data.dataPagamento, i - 1),
          parcelaInfo: { atual: i, total: data.parcelas },
        });
      }
    } else {
      const { parcelas, ...cleanData } = data;
      await addClient(cleanData);
    }
    refresh();
    setModalVisible(false);
  };

  const handleEdit = async (data) => {
    const { parcelas, ...cleanData } = data;
    await updateClient(editingClient.id, cleanData);
    refresh();
    setEditingClient(null);
    setModalVisible(false);
  };

  const handleMarkAsPaid = (client) => {
    const hoje = new Date();
    const dataFormatada = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
    Alert.alert(
      'Dar Baixa',
      `Confirmar pagamento de ${client.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: `Pago em ${dataFormatada}`,
          onPress: async () => {
            await updateClient(client.id, {
              pago: true,
              dataPagamentoRealizado: dataFormatada,
            });
            refresh();
          },
        },
      ]
    );
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
      onMarkAsPaid={handleMarkAsPaid}
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
